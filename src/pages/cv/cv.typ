#let is-html = sys.inputs.at("target", default: "pdf") == "html"

#set document(
  title: "Amr Bashir - CV",
  author: "Amr Bashir",
  description: "Fullstack Software Engineer - Rust, TypeScript, Tauri",
  keywords: (
    "Software Engineer",
    "Fullstack",
    "Rust",
    "TypeScript",
    "JavaScript",
    "React",
    "Tauri",
    "Node.js",
    "PostgreSQL",
    "Cross-Platform",
    "Desktop",
    "Open Source",
    "Remote",
  ),
)

// Page geometry: ignored in HTML mode.
#set page(
  paper: "us-letter",
  margin: (x: 1.6cm, top: 1.2cm, bottom: 1.2cm),
)

// Standard sans-serif stack for ATS text extraction. Ignored in HTML mode.
#set text(
  font: (
    (name: "Arial", covers: "latin-in-cjk"),
  ),
  size: 10pt,
  lang: "en",
)

#set par(justify: false, leading: 0.55em, spacing: 0.7em)

// Disable smart-quote / dash substitution: keeps PDF text layer plain ASCII.
#set smartquote(enabled: false)

#show heading.where(level: 1): it => {
  if is-html { it } else {
    set text(size: 22pt, weight: "bold")
    block(below: 0.4em, it.body)
  }
}

#show heading.where(level: 2): it => {
  if is-html { it } else {
    set text(size: 12pt, weight: "bold")
    block(above: 1.1em, below: 0.4em)[
      #upper(it.body)
      #v(-0.3em)
      #line(length: 100%, stroke: 0.5pt + rgb("#888888"))
    ]
  }
}

#show heading.where(level: 3): it => {
  if is-html { it } else {
    set text(size: 10.5pt, weight: "bold")
    block(above: 0.7em, below: 0.2em, it.body)
  }
}

#show link: it => {
  if is-html { it } else {
    underline(text(rgb("#0a4ea3"), it))
  }
}

#show list: set list(indent: 0.6em, body-indent: 0.5em, marker: ([•], [-]))

= Amr Bashir

#text(size: 11pt, weight: "medium")[
  Fullstack Software Engineer | Rust, TypeScript, Cross-Platform Desktop
]

#v(0.2em)

#text(size: 9.5pt)[
  Tanta, Egypt (open to remote) |
  #link("mailto:hi@amrbashir.me")[hi\@amrbashir.me] |
  #link("https://amrbashir.me")[amrbashir.me] |
  #link("https://github.com/amrbashir")[github.com/amrbashir] |
  #link("https://www.linkedin.com/in/amrbashir-dev")[linkedin.com/in/amrbashir-dev]
  // HTML-only: inline "download PDF" link alongside the other contacts.
  #if is-html [ | #link("/cv.pdf")[Download PDF] ]
]

== Summary

Fullstack Software Engineer with 4+ years of experience building cross-platform desktop, web, and mobile applications. Core maintainer of #link("https://tauri.app")[Tauri], an open-source app framework with 90,000+ GitHub stars used by thousands of production apps. Specialized in Rust, TypeScript, and native OS integrations (Win32, GTK, X11). Proven track record shipping production software end-to-end, from systems-level APIs to React/SolidJS frontends.

== Skills

- *Languages:* Rust, TypeScript, JavaScript, Kotlin, C, C++, Python, Dart, Bash, PowerShell
- *Backend:* Node.js, Express.js, NestJS, tRPC, Axum, Rspc, Prisma, PostgreSQL, MongoDB, SQLite, REST, Docker, Deno, GitHub Actions, Cloudflare Workers
- *Frontend:* React, Vue.js, SolidJS, Astro, Vite, TanStack Router, TanStack Query, HTML, CSS, i18next
- *Desktop:* Tauri, Electron, Win32 API, COM, GTK, X11
- *Mobile:* Kotlin, Jetpack Compose, Flutter, Dart
- *Auth & Identity:* Ory Kratos, Ory Hydra, Ory Keto
- *Tools & Practices:* Git, CI/CD, code review, open-source maintenance, cross-platform development, performance optimization

== Work Experience

=== Fullstack Engineer (Freelance) - ERP System for Local Retail Store

#text(style: "italic", size: 9.5pt)[June 2025 - July 2025 | Egypt]

- Designed and shipped a full ERP system covering inventory, invoicing, customer records, and transactions for a local retail business.
- Built a type-safe backend with tRPC, PostgreSQL, and Prisma; modeled multi-entity schema with referential integrity.
- Implemented React frontend with Vite, TanStack Router, TanStack Query, and i18next for Arabic/English localization.
- Delivered production-ready system end-to-end as sole engineer.

=== Windows Software Engineer (Freelance) - CrabNebula

#text(style: "italic", size: 9.5pt)[March 2025 - April 2025 | Remote]

- Shipped Windows-specific features for a Tauri-based desktop app, including OS-wide sidebar integration.
- Integrated app with Microsoft Excel through the COM API for live spreadsheet interop.
- Improved native Windows UX by leveraging Win32 APIs for shell integration.

=== R&D Software Engineer - CrabNebula

#text(style: "italic", size: 9.5pt)[November 2022 - November 2024 | Remote]

- Maintained and extended the #link("https://tauri.app")[Tauri] project (90,000+ GitHub stars), focusing on performance, stability, and cross-platform parity across Windows, Linux (X11/GTK), and macOS.
- Architected and developed a scalable cloud platform using Rust (Axum, Rspc), MongoDB, and SolidJS, implementing both backend endpoints and frontend UI.
- Integrated user management and authorization using the Ory suite (Kratos, Hydra, Keto) for SSO, OAuth2, and fine-grained permissions.
- Collaborated with a distributed engineering team via async code review and design discussions.

=== Mobile Engineer (Freelance) - POS System

#text(style: "italic", size: 9.5pt)[March 2022 - June 2022 | Egypt]

- Developed a Flutter-based Point of Sale system for iOS and Android with a companion admin dashboard.
- Built local server, embedded database, and device-to-device communication layer for offline-first operation.

== Open Source Projects

- *#link("https://github.com/tauri-apps/tauri")[Tauri]:* Core working-group member and maintainer since 2021. Cross-platform app framework (Rust + web frontend), 90,000+ stars. Contributed APIs, Windows internals, and build tooling.
- *#link("https://github.com/tauri-apps/muda")[muda]:* Author/maintainer. Cross-platform menu utilities for Rust desktop apps.
- *#link("https://github.com/tauri-apps/tray-icon")[tray-icon]:* Author/maintainer. Cross-platform tray icon library for Rust desktop apps.
- *#link("https://github.com/amrbashir/komorebi-switcher")[komorebi-switcher]:* Workspace switcher for the Komorebi tiling window manager, integrated into the Windows 10/11 taskbar.
- *#link("https://github.com/amrbashir/hijri-widget")[Hijri Widget]:* Native Android widget for Hijri date display; 2,000+ active users.
- *#link("https://github.com/amrbashir/vite-plugin-tauri")[vite-plugin-tauri]:* Vite plugin for seamless Tauri integration in web projects.
- *#link("https://github.com/amrbashir/nvim-docs-view")[nvim-docs-view]:* Neovim plugin rendering LSP hover documentation in a side panel.
- *#link("https://github.com/amrbashir/amrbashir.me")[amrbashir.me]:* Personal website built with Astro.

== Education

*Bachelor of Arts in English Literature* \
Al-Azhar University, Faculty of Languages and Translation \
2016 - 2020

== Languages

- Arabic (Native)
- English (Fluent, professional working proficiency)
