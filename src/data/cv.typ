#let profile = json("profile.json")
#let projects = json("projects.json")

// "YYYY-MM" -> "Month YYYY"; "YYYY" -> "YYYY"; none -> "Present".
#let format-date(d) = {
  if d == none { return "Present" }
  let parts = d.split("-")
  if parts.len() == 1 { return parts.at(0) }
  datetime(year: int(parts.at(0)), month: int(parts.at(1)), day: 1)
    .display("[month repr:long] [year]")
}

#let format-range(start, end) = format-date(start) + " - " + format-date(end)

// Standalone "Tauri" -> project link. Leaves "Tauri-based" / "Tauri-app" alone.
#let linkify-tauri(s) = {
  let tauri = link("https://tauri.app")[Tauri]
  let parts = ()
  let last = 0
  for m in s.matches(regex("Tauri([,.:;) ]|$)")) {
    parts.push(s.slice(last, m.start))
    parts.push(tauri)
    parts.push(m.captures.at(0))
    last = m.end
  }
  parts.push(s.slice(last))
  parts.join()
}

#let role-heading(role) = {
  role.title
  if role.type == "Freelance" [ (Freelance)]
  let company = role.at("company", default: none)
  if company != none {
    " - "
    let url = role.at("companyUrl", default: none)
    if url != none {
      link(url, company)
    } else {
      company
    }
  }
}

#let cv-projects = projects.filter(p => p.cvFeatured)

#let location-cv = [#profile.location (open to remote)]

#set document(
  title: profile.name + " - CV",
  author: profile.name,
  description: profile.cvTagline,
  keywords: profile.cvKeywords,
)

#set page(
  paper: "us-letter",
  margin: (x: 1.6cm, top: 1.2cm, bottom: 1.2cm),
)

// Standard sans-serif stack for ATS text extraction.
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
  set text(size: 22pt, weight: "bold")
  block(below: 0.4em, it.body)
}

#show heading.where(level: 2): it => {
  set text(size: 12pt, weight: "bold")
  block(above: 1.1em, below: 0.4em)[
    #upper(it.body)
    #v(-0.3em)
    #line(length: 100%, stroke: 0.5pt + rgb("#888888"))
  ]
}

#show heading.where(level: 3): it => {
  set text(size: 10.5pt, weight: "bold")
  block(above: 0.7em, below: 0.2em, it.body)
}

#show link: it => underline(text(rgb("#0a4ea3"), it))

#show list: set list(indent: 0.6em, body-indent: 0.5em, marker: ([•], [-]))

= #profile.name

#text(size: 11pt, weight: "medium")[#profile.cvTagline]

#v(0.2em)

#text(size: 9.5pt)[
  #location-cv
  #for l in profile.links [ | #link(l.href)[#l.label]]
]

== Summary

#linkify-tauri(profile.summary)

== Skills

#for cat in profile.toolbox [
  - *#cat.category:* #cat.tools.join(", ")
]

== Work Experience

#for role in profile.roles [
  === #role-heading(role)

  #text(style: "italic", size: 9.5pt)[#format-range(role.start, role.end) | #role.location]

  #for bullet in role.bullets [
    - #linkify-tauri(bullet)
  ]
]

== Open Source Projects

#for p in cv-projects [
  - *#link(p.url)[#p.name]:* #p.cvHighlight
]

== Education

#for role in profile.education [
  *#role.title* \
  #role.company#if role.at("department", default: none) != none [, #role.department] \
  #format-range(role.start, role.end)
]

== Languages

#for lang in profile.languages [
  - #lang.name (#lang.level)
]
