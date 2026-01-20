// Jake's Resume Style - Typst Template
// Replicates the classic Jake Gutierrez LaTeX resume template

#let data = "__RESUME_DATA__"

// Page setup - Letter size with compact margins (matching LaTeX template)
#set page(
  paper: "us-letter",
  margin: (left: 0.5in, right: 0.5in, top: 0.5in, bottom: 0.5in),
)

// Base text setup - 11pt feel
#set text(
  font: "New Computer Modern",
  size: 10pt,
)

// Disable paragraph indentation
#set par(justify: false, leading: 0.5em)

// Link styling - underlined blue links for ATS
#show link: it => underline(text(fill: rgb("#0000EE"), it))

// Helper function for section headers (smallcaps feel + underline rule)
#let section(title) = {
  v(0.3em)
  text(weight: "bold", size: 11pt, upper(title))
  v(-0.7em)
  line(length: 100%, stroke: 0.5pt)
  v(0.2em)
}

// Resume subheading for experience/education
#let resume_subheading(org, dates, role, location) = {
  grid(
    columns: (1fr, auto),
    row-gutter: 0.1em,
    text(weight: "bold", org),
    text(style: "italic", dates),
    text(style: "italic", role),
    text(style: "italic", location),
  )
}

// Resume project heading
#let resume_project_heading(name, tech, dates) = {
  grid(
    columns: (1fr, auto),
    [#text(weight: "bold", name) #text(" | ") #text(style: "italic", tech)],
    text(style: "italic", dates),
  )
}

// Resume item (bullet point)
#let resume_item(content) = {
  list(
    marker: [•],
    body-indent: 0.3em,
    content,
  )
}

// Skills item
#let skills_item(category, items) = {
  [#text(weight: "bold", category + ": ")#items.join(", ")]
}

// ============ DOCUMENT START ============

// Centered header with name
#align(center)[
  #text(size: 24pt, weight: "bold", data.header.name)
]

// Contact line with separators
#align(center)[
  #let contact_parts = ()
  #if data.header.phone != none {
    contact_parts.push(data.header.phone)
  }
  #if data.header.email != none {
    contact_parts.push(link("mailto:" + data.header.email, data.header.email))
  }
  #if data.header.linkedin != none {
    contact_parts.push(link("https://" + data.header.linkedin, data.header.linkedin))
  }
  #if data.header.github != none {
    contact_parts.push(link("https://" + data.header.github, data.header.github))
  }
  #if data.header.website != none {
    contact_parts.push(link("https://" + data.header.website, data.header.website))
  }
  #contact_parts.join([ $diamond.stroked.small$ ])
]

v(0.3em)

// ============ EDUCATION ============
#if data.education.len() > 0 {
  section("Education")
  
  for edu in data.education {
    resume_subheading(edu.school, edu.dates, edu.degree, edu.location)
    if edu.extra != none and edu.extra != "" {
      v(0.1em)
      text(size: 9pt, edu.extra)
    }
    v(0.3em)
  }
}

// ============ EXPERIENCE ============
#if data.experience.len() > 0 {
  section("Experience")
  
  for exp in data.experience {
    resume_subheading(exp.organization, exp.dates, exp.role, exp.location)
    v(0.1em)
    set list(marker: [•], body-indent: 0.3em, spacing: 0.4em)
    for bullet in exp.bullets {
      if bullet != "" {
        list([#bullet])
      }
    }
    v(0.2em)
  }
}

// ============ PROJECTS ============
#if data.projects.len() > 0 {
  section("Projects")
  
  for proj in data.projects {
    resume_project_heading(proj.name, proj.techStack, proj.dates)
    v(0.1em)
    set list(marker: [•], body-indent: 0.3em, spacing: 0.4em)
    for bullet in proj.bullets {
      if bullet != "" {
        list([#bullet])
      }
    }
    v(0.2em)
  }
}

// ============ SKILLS ============
#if data.skills.len() > 0 {
  section("Technical Skills")
  
  set list(marker: none, body-indent: 0em, spacing: 0.3em)
  for skill in data.skills {
    if skill.items.len() > 0 {
      [#text(weight: "bold", skill.name + ": ")#skill.items.join(", ")]
      linebreak()
    }
  }
}
