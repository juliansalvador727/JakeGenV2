import type { ResumeData } from '../types/resume';
import { generateId } from '../types/resume';

/**
 * Default resume data - Jake's example from sb2nov template
 */
export const defaultResume: ResumeData = {
  header: {
    name: 'Jake Ryan',
    phone: '123-456-7890',
    email: 'jake@su.edu',
    linkedin: 'linkedin.com/in/jake',
    github: 'github.com/jake',
    website: undefined,
  },
  education: [
    {
      id: generateId(),
      school: 'Southwestern University',
      location: 'Georgetown, TX',
      degree: 'Bachelor of Arts in Computer Science, Minor in Business',
      dates: 'Aug. 2018 -- May 2021',
      extra: undefined,
    },
    {
      id: generateId(),
      school: 'Blinn College',
      location: 'Bryan, TX',
      degree: "Associate's in Liberal Arts",
      dates: 'Aug. 2014 -- May 2018',
      extra: undefined,
    },
  ],
  experience: [
    {
      id: generateId(),
      organization: 'Undergraduate Research Assistant',
      location: 'Georgetown, TX',
      role: 'Texas A&M University',
      dates: 'June 2020 -- Present',
      bullets: [
        'Developed a REST API using FastAPI and PostgreSQL to store data from learning management systems',
        'Developed a full-stack web application using Flask, React, PostgreSQL and Docker to analyze GitHub data',
        'Explored ways to visualize GitHub collaboration in a classroom setting',
      ],
    },
    {
      id: generateId(),
      organization: 'Information Technology Support Specialist',
      location: 'Georgetown, TX',
      role: 'Southwestern University',
      dates: 'Sep. 2018 -- Present',
      bullets: [
        'Communicate with managers to set up campus computers used on campus',
        'Assess and troubleshoot computer problems brought by students, faculty and staff',
        'Maintain upkeep of computers, classroom equipment, and 200 printers across campus',
      ],
    },
    {
      id: generateId(),
      organization: 'Artificial Intelligence Research Assistant',
      location: 'Georgetown, TX',
      role: 'Southwestern University',
      dates: 'May 2019 -- July 2019',
      bullets: [
        'Explored methods to generate video game dungeons based off of The Legend of Zelda',
        'Developed a game in Java to test the generated dungeons',
        'Contributed 50K+ lines of code to an established codebase via Git',
        'Conducted a human subject study to determine which video game dungeon generation technique is enjoyable',
        'Wrote an 8-page paper and gave multiple presentations on-campus',
        'Presented virtually to the World Conference on Computational Intelligence',
      ],
    },
  ],
  projects: [
    {
      id: generateId(),
      name: 'Gitlytics',
      techStack: 'Python, Flask, React, PostgreSQL, Docker',
      dates: 'June 2020 -- Present',
      bullets: [
        'Developed a full-stack web application using with Flask serving a REST API with React as the frontend',
        "Implemented GitHub OAuth to get data from user's repositories",
        'Visualized GitHub data to show collaboration',
        'Used Celery and Redis for asynchronous tasks',
      ],
    },
    {
      id: generateId(),
      name: 'Simple Paintball',
      techStack: 'Spigot API, Java, Maven, TravisCI, Git',
      dates: 'May 2018 -- May 2020',
      bullets: [
        'Developed a Minecraft server plugin to entertain kids during free time for a previous job',
        'Published plugin to websites gaining 2K+ downloads and an average 4.5/5-star review',
        'Implemented continuous delivery using TravisCI to build the plugin upon new a release',
        'Collaborated with Minecraft server administrators to suggest features and get feedback about the plugin',
      ],
    },
  ],
  skills: [
    {
      id: generateId(),
      name: 'Languages',
      items: ['Java', 'Python', 'C/C++', 'SQL (Postgres)', 'JavaScript', 'HTML/CSS', 'R'],
    },
    {
      id: generateId(),
      name: 'Frameworks',
      items: ['React', 'Node.js', 'Flask', 'JUnit', 'WordPress', 'Material-UI', 'FastAPI'],
    },
    {
      id: generateId(),
      name: 'Developer Tools',
      items: ['Git', 'Docker', 'TravisCI', 'Google Cloud Platform', 'VS Code', 'Visual Studio', 'PyCharm', 'IntelliJ', 'Eclipse'],
    },
    {
      id: generateId(),
      name: 'Libraries',
      items: ['pandas', 'NumPy', 'Matplotlib'],
    },
  ],
};
