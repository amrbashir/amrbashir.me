---
title: Managing multiple Git configurations, without forgetting which one you're using
published: 2026-01-25
categories: [git, tools]
---

For a long time I had a small ritual every time I cloned a new repo: `git config user.email ...`, type the right address, hope I remembered. The first time I forgot -- an open-source pull request authored from a client email I was never meant to expose -- was the kind of mistake you only make once, and only because no one had taught me there was an alternative.

Git has had the alternative for nearly a decade. It's called `includeIf`, it lives in your top-level `.gitconfig`, and once you set it up you can forget it forever.

There's also a more dynamic approach using shell `cd` hooks -- useful when the static directory mapping doesn't cleanly fit. I'll cover both.

## The shape of the problem

Most developers end up with at least two Git identities: a personal one for hobby and open-source work, and an employer-issued one for company repos. Add a client or two and the count climbs further. The naive solutions are all bad:

- **One identity for everything.** Cheap and wrong -- you leak the wrong email into the wrong history, and rewriting commits later is far more effort than getting it right once.
- **Set `user.email` per repo, by hand.** Works, until the day you don't. The first commit on a fresh clone is exactly when you're thinking about anything else.
- **A shell alias that wraps `git`.** Now you have two problems, and one of them shows up every time a script you didn't write calls Git directly.

The right shape is to let Git figure it out from the filesystem layout you already have. Work repos live under `~/work/`. Personal repos live under `~/code/`. That's already the signal -- Git just needs to read it.

> The right config is the one you can _forget_ the day after you write it.

## Using `includeIf`

A [colleague](https://github.com/chippers) of mine introduced me to conditional includes a few years back. Pick a directory convention -- mine is roughly this, yours can be anything as long as work and personal don't overlap:

```
~/code/        <- personal & open-source
~/work/        <- current employer
~/clients/     <- freelance, one folder per client
```

Now create one config file per identity. Keep them next to your top-level `.gitconfig` so they're easy to find later:

```ini title="~/.gitconfig-work"
[user]
    name        = Your Name
    email       = you@example-corp.com
    signingkey  = AAAA1111BBBB2222
[commit]
    gpgsign     = true
```

Then wire them into the root config with `includeIf`. The `gitdir:` prefix matches against the absolute path of the repo's working tree, with shell-style wildcards. The trailing slash matters -- it's what tells Git to match any descendant.

```ini title="~/.gitconfig"
[user]
    name  = Your Name
    email = personal@email.com         # the default

[includeIf "gitdir:~/work/"]
    path = ~/.gitconfig-work

[includeIf "gitdir:~/clients/acme/"]
    path = ~/.gitconfig-acme
```

Order matters. Later `includeIf` blocks override earlier ones, and your top-level `[user]` block is the fallback. I keep the personal identity at the top so that anything living outside the named directories silently inherits it.

### Verifying it works

Inside any repo, ask Git what it thinks right now:

```sh
$ cd ~/work/some-internal-tool
$ git config --show-origin user.email
file:/home/amr/.gitconfig-work    you@example-corp.com
```

The `--show-origin` flag is the part most tutorials skip, and it's the only one that actually tells you the truth. It prints the file Git resolved the value from -- which is what you want to know when something looks off.

### Things to know before you commit

A few rough edges worth being aware of, in roughly decreasing order of how much pain they have caused me:

1. **`gitdir:` matches the repo's actual location.** If you keep symlinks (e.g. `~/work` -> `/mnt/code/work`), use `gitdir/i:` for case-insensitive matching and consider the canonical path explicitly.
2. **Worktrees can surprise you.** A worktree of a personal repo placed inside `~/work/` will pick up the work identity. This is usually what you want; occasionally it isn't.
3. **SSH keys are a separate axis.** `includeIf` only switches Git config. To switch SSH keys per host, use a matching block in `~/.ssh/config`.

### A note on signing

Once you have per-directory identities, GPG/SSH commit signing becomes basically free: put the `signingkey` and `gpgsign = true` lines in each per-identity file, and Git signs commits with the right key automatically. Pair that with your Git host's _vigilant mode_ (GitHub) or the equivalent and unsigned commits in those repos start to look suspicious by default -- which is the goal.

This approach is solid, battle-tested, and lands cleanly for most setups.

## Using `cd` hooks for dynamic configuration

Sometimes the static directory mapping isn't quite enough -- I want the correct Git configuration to follow the nearest `.gitconfig` file in the directory tree, regardless of where the repo lives on disk.

Popularized by tools like [direnv](https://direnv.net/), [asdf](https://asdf-vm.com/), and others, using `cd` hooks allows you to run custom scripts whenever you change directories.

The idea is simple:

1. When changing directories, search upwards in the directory tree for the nearest `.gitconfig` file.
2. If found, merge it with the global Git configuration for the current session using `GIT_CONFIG_GLOBAL`.
3. If no `.gitconfig` is found, revert to the default global configuration.

And I just did that for `Bash`, `Zsh` and `PowerShell` which are the shells I use the most.

<details data-group="shell-config" open>
<summary>Bash</summary>

```bash title="~/.bashrc"
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

```zsh title="~/.zshrc"
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

```powershell title="~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1"
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
|-- .gitconfig
|-- work/
|   |-- .gitconfig
|   \-- project-a/
\-- work2/
|   |-- .gitconfig
|   |-- project-b/
|   \-- project-c/
```

`~/.gitconfig` holds my default personal settings, and each work-related directory carries its own `.gitconfig` with the appropriate user information.

---

None of this is new. The `includeIf` directive landed in Git 2.13, in 2017. But you can write commercial software for years without running into a tutorial that explains it, and meanwhile every fresh machine inherits the same ritual of typing `git config user.email` over and over. Five minutes, a little tree of config files, and the small daily fear of leaking the wrong identity goes away.
