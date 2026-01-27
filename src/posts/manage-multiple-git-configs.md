---
title: Managing multiple Git Configurations
pubDate: 2026-01-25
---

Managing multiple Git configurations is essential for developers juggling work and personal projects
while ensuring proper commit attribution and correct signing keys.

There are several strategies to manage this, I will outline two of them here.

## Using Conditional Includes in Git Configuration

For the past few years, a [collegue](https://github.com/chippers) of mine introduced me to the concept of conditional includes in Git
configuration.

```ini
[user]
	name = Your Name
	email =	personal@email.com

[includeIf "gitdir:~/work/"]
	path = ~/.gitconfig-work
```

In this setup, the main Git configuration file (`~/.gitconfig`) contains your default user information,
which applies to personal projects. The `includeIf` directive checks if the Git directory is within
the `~/work/` path and includes the additional configuration file (`~/.gitconfig-work`),
which contains your work-specific settings.

This approach is solid and works very well and is battle-tested.

## Using `cd` hooks for Dynamic Configuration

Because I work on multiple projects, each requiring different Git configurations,
I needed a more dynamic solution. I wanted to automatically apply the correct Git configuration
based on the current working directory (or rather the nearest `.gitconfig` file in the directory tree).

Popularized by tools like [direnv](https://direnv.net/), [asdf](https://asdf-vm.com/), and others,
using `cd` hooks allows you to run custom scripts whenever you change directories.

This is perfect for my use case, and the idea is simple:
1. When changing directories, search upwards in the directory tree for the nearest `.gitconfig` file.
2. If found, merge it with the global Git configuration for the current session using `GIT_CONFIG_GLOBAL`.
3. If no `.gitconfig` is found, revert to the default global configuration.

And I just did that for both `Zsh` and `PowerShell` which are the shells I use the most.

<details data-group="shell-config" open>
<summary>Bash</summary>

```bash
merge_nearest_gitconfig() {
    # Reset any previous temporary git config
	# so if we cd out of a project with a .gitconfig we go back to normal
    if [[ -n "$GIT_CONFIG_GLOBAL" ]]; then
        rm -f "$GIT_CONFIG_GLOBAL" 2>/dev/null
        unset GIT_CONFIG_GLOBAL
    fi

    local current_dir="$PWD"
    local nearest_gitconfig=""

    # Find the nearest .gitconfig file upwards in the directory tree
    while [[ -n "$current_dir" ]]; do
        local gitconfig_path="$current_dir/.gitconfig"
        if [[ -f "$gitconfig_path" ]]; then
            nearest_gitconfig="$gitconfig_path"
            break
        fi

        # Move up one directory
        current_dir="${current_dir%/*}"
    done

    # if the found .gitconfig is not the same as user's global config, merge it
    if [[ -n "$nearest_gitconfig" && "$nearest_gitconfig" != "$HOME/.gitconfig" ]]; then
        # Create a temporary config file with the user's global config ~/.gitconfig
        local temp_config=$(mktemp)
        cat "$HOME/.gitconfig" > "$temp_config"

        # Append an include directive for the nearest .gitconfig
        echo -e "\n[include]\n    path = $nearest_gitconfig" >> "$temp_config"

        # Point Git to this merged config for the session
        export GIT_CONFIG_GLOBAL="$temp_config"
        echo "Merged git config from \e[36m$nearest_gitconfig\e[0m into current session."
    fi

}

# Function to change directory and immediately merge neatest git config
_cd_with_nearest_git() {
	\cd "$@" || return $?
	merge_nearest_gitconfig
}


alias cd='_cd_with_nearest_git'  # Override cd to our custom function
merge_nearest_gitconfig          # Run it once for the initial directory
```

</details>

<details data-group="shell-config">
<summary>Zsh</summary>

```zsh
merge_nearest_gitconfig() {
    # Reset any previous temporary git config
	# so if we cd out of a project with a .gitconfig we go back to normal
    if [[ -n "$GIT_CONFIG_GLOBAL" ]]; then
        rm -f "$GIT_CONFIG_GLOBAL" 2>/dev/null
        unset GIT_CONFIG_GLOBAL
    fi

    local current_dir="$PWD"
    local nearest_gitconfig=""

    # Find the nearest .gitconfig file upwards in the directory tree
    while [[ -n "$current_dir" ]]; do
        local gitconfig_path="$current_dir/.gitconfig"
        if [[ -f "$gitconfig_path" ]]; then
            nearest_gitconfig="$gitconfig_path"
            break
        fi

        # Move up one directory
        current_dir="${current_dir%/*}"
    done

    # if the found .gitconfig is not the same as user's global config, merge it
    if [[ -n "$nearest_gitconfig" && "$nearest_gitconfig" != "$HOME/.gitconfig" ]]; then
        # Create a temporary config file with the user's global config ~/.gitconfig
        local temp_config=$(mktemp)
        cat "$HOME/.gitconfig" > "$temp_config"

        # Append an include directive for the nearest .gitconfig
        echo -e "\n[include]\n    path = $nearest_gitconfig" >> "$temp_config"

        # Point Git to this merged config for the session
        export GIT_CONFIG_GLOBAL="$temp_config"
        echo "Merged git config from \e[36m$nearest_gitconfig\e[0m into current session."
    fi

}

autoload -U add-zsh-hook                   # load the add-zsh-hook function
add-zsh-hook chpwd merge_nearest_gitconfig # Run it on directory change
merge_nearest_gitconfig                    # Run it once for the initial directory
```

</details>

<details data-group="shell-config">
<summary>PowerShell</summary>

```powershell
Function Merge-NearestGitConfig {
    # Reset any previous temporary git config
    if ($Env:GIT_CONFIG_GLOBAL) {
        Remove-Item $Env:GIT_CONFIG_GLOBAL -ErrorAction SilentlyContinue
        Remove-Item Env:GIT_CONFIG_GLOBAL
    }

    $currentDir = Get-Location
    $nearestGitconfig = $null

    # Find the nearest .gitconfig file upwards in the directory tree
    while ($currentDir) {
        $gitconfigPath = Join-Path -Path $currentDir -ChildPath ".gitconfig"
        if (Test-Path $gitconfigPath) {
            $nearestGitconfig = $gitconfigPath
            break
        }

        # Move up one directory
        $currentDir = Split-Path -Path $currentDir -Parent
    }

    # if the found .gitconfig is not the user's global config, merge it
    if ($nearestGitconfig -and ($nearestGitconfig -ne "$HOME\.gitconfig")) {
        # Create a temporary config file with the user's global config ~/.gitconfig
        $tempConfig = [System.IO.Path]::GetTempFileName()
        Get-Content "$HOME\.gitconfig" | Set-Content $tempConfig

        # Append an include directive for the nearest .gitconfig
        $nearestGitconfig = $nearestGitconfig -replace '\\', '/' # Normalize path for git
        Add-Content $tempConfig "`n[include]`n    path = $nearestGitconfig"

        # Point Git to this merged config for the session
        $Env:GIT_CONFIG_GLOBAL = $tempConfig
        Write-Host "Merged git config from " -NoNewline
        Write-Host $nearestGitconfig -NoNewline -ForegroundColor Cyan
        Write-Host " into current session."
    }
}

# Function to change directory and immediately merge neatest git config
Function __cd_with_nearest_git {
	Set-Location @args
	Merge-NearestGitConfig
}

Remove-Alias cd -ErrorAction SilentlyContinue             # Remove existing cd
Set-Alias cd __cd_with_nearest_git -Scope Global -Force   # Override cd to our custom function
Merge-NearestGitConfig                                    # Run it once for the initial directory
```

</details>

This way I can have the following structure:

```
~/
├── .gitconfig
├── work/
│   ├── .gitconfig
│   └── project-a/
└── work2/
│   ├── .gitconfig
│   ├── project-b/
│   └── project-c/
```

`~/.gitconfig` would contain my default personal settings, while each work-related directory
contains its own `.gitconfig` file with the appropriate user information.
