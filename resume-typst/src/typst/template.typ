// Jake's Resume Style - Typst Template
// Replicates the classic Jake Gutierrez LaTeX resume template

#let data = "__RESUME_DATA__"

// Helper to get formatting value with fallback
#let fmt(key, default) = {
  if "formatting" in data and data.formatting != none and key in data.formatting and data.formatting.at(key) != none {
    data.formatting.at(key)
  } else {
    default
  }
}

// Page setup - Letter size with customizable margins
#set page(
  paper: "us-letter",
  margin: (
    left: fmt("marginLeft", 0.5) * 1in,
    right: fmt("marginRight", 0.5) * 1in,
    top: fmt("marginTop", 0.5) * 1in,
    bottom: fmt("marginBottom", 0.5) * 1in
  ),
)

// Base text setup - customizable font size
#set text(
  font: "New Computer Modern",
  size: fmt("baseFontSize", 11) * 1pt,
)

// Paragraph settings - customizable leading
#set par(justify: false, leading: fmt("parLeading", 0.65) * 1em)

// Link styling - underlined blue links for ATS
#show link: it => underline(text(fill: rgb("#0000EE"), it))

// Helper function for section headers (matching LaTeX \section formatting)
#let section(title) = {
  v(fmt("sectionSpaceBefore", -4) * 1pt)
  text(weight: "bold", size: fmt("sectionFontSize", 12) * 1pt, upper(title))
  v(fmt("sectionSpaceAfter1", -5) * 1pt)
  line(length: 100%, stroke: 0.5pt + black)
  v(fmt("sectionSpaceAfter2", -5) * 1pt)
}

// Resume subheading for experience/education (matching LaTeX \resumeSubheading)
#let resume_subheading(org, dates, role, location) = {
  v(fmt("subheadingSpaceBefore", -2) * 1pt)
  box(width: fmt("gridWidth", 97) * 1%,
    grid(
      columns: (1fr, auto),
      row-gutter: 0em,
      text(weight: "bold", org),
      text(dates),
      text(style: "italic", size: fmt("itemFontSize", 10) * 1pt, role),
      text(style: "italic", size: fmt("itemFontSize", 10) * 1pt, location),
    )
  )
  v(fmt("subheadingSpaceAfter", -7) * 1pt)
}

// Resume project heading (matching LaTeX \resumeProjectHeading)
#let resume_project_heading(name, tech, dates) = {
  v(fmt("subheadingSpaceBefore", -2) * 1pt)
  box(width: fmt("gridWidth", 97) * 1%,
    grid(
      columns: (1fr, auto),
      [#text(weight: "bold", name) #text(" | ") #text(style: "italic", tech)],
      text(dates),
    )
  )
  v(fmt("subheadingSpaceAfter", -7) * 1pt)
}

// ============ DOCUMENT START ============

// Header section with customizable spacing
#align(center)[
  // Name (matching LaTeX \Huge \scshape)
  #text(size: fmt("nameFontSize", 26) * 1pt, weight: "bold", upper(data.header.name))
  // Customizable spacing between name and contact info
  #v(fmt("nameSpacing", 1) * 1pt)
  // Contact line with separators (matching LaTeX \small)
  #text(size: fmt("contactFontSize", 10) * 1pt)[
    #let contact_parts = ()
    #if data.header.phone != none {
      contact_parts.push(data.header.phone)
    }
    #if data.header.email != none {
      contact_parts.push(link("mailto:" + data.header.email, underline(data.header.email)))
    }
    #if data.header.linkedin != none {
      contact_parts.push(link("https://" + data.header.linkedin, underline(data.header.linkedin)))
    }
    #if data.header.github != none {
      contact_parts.push(link("https://" + data.header.github, underline(data.header.github)))
    }
    #if data.header.website != none {
      contact_parts.push(link("https://" + data.header.website, underline(data.header.website)))
    }
    #contact_parts.join([ | ])
  ]
]

#v(fmt("contactSpacing", 0.3) * 1em)

// ============ EDUCATION ============
#if data.education.len() > 0 {
  section("Education")
  
  set list(indent: fmt("listIndent", 0.15) * 1in, marker: none)
  list[
    #for edu in data.education {
      resume_subheading(edu.school, edu.dates, edu.degree, edu.location)
      if edu.extra != none and edu.extra != "" {
        v(0.1em)
        text(size: 9pt, edu.extra)
      }
    }
  ]
}

// ============ EXPERIENCE ============
#if data.experience.len() > 0 {
  section("Experience")
  
  set list(indent: fmt("listIndent", 0.15) * 1in, marker: none, spacing: 0em)
  list[
    #for exp in data.experience {
      resume_subheading(exp.organization, exp.dates, exp.role, exp.location)
      
      // Bullet points with proper indentation
      set list(indent: fmt("listIndent", 0.15) * 1in, marker: [•], spacing: 0em)
      list(
        ..exp.bullets.filter(b => b != "").map(b => [#text(size: fmt("itemFontSize", 10) * 1pt)[#b] #v(fmt("itemSpacing", -2) * 1pt)])
      )
      v(fmt("blockSpaceAfter", -5) * 1pt)
    }
  ]
}

// ============ PROJECTS ============
#if data.projects.len() > 0 {
  section("Projects")
  
  set list(indent: fmt("listIndent", 0.15) * 1in, marker: none, spacing: 0em)
  list[
    #for proj in data.projects {
      resume_project_heading(proj.name, proj.techStack, proj.dates)
      
      // Bullet points with proper indentation
      set list(indent: fmt("listIndent", 0.15) * 1in, marker: [•], spacing: 0em)
      list(
        ..proj.bullets.filter(b => b != "").map(b => [#text(size: fmt("itemFontSize", 10) * 1pt)[#b] #v(fmt("itemSpacing", -2) * 1pt)])
      )
      v(fmt("blockSpaceAfter", -5) * 1pt)
    }
  ]
}

// ============ SKILLS ============
#if data.skills.len() > 0 {
  section("Technical Skills")
  
  set list(indent: fmt("listIndent", 0.15) * 1in, marker: none, spacing: 0em)
  list[
    #for skill in data.skills {
      if skill.items.len() > 0 {
        text(size: fmt("itemFontSize", 10) * 1pt)[
          #text(weight: "bold", skill.name + ": ")#skill.items.join(", ")
        ]
        linebreak()
      }
    }
  ]
}
