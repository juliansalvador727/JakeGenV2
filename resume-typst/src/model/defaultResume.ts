import { ResumeData, generateId } from './types';

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
      degree: 'Associate\'s in Liberal Arts',
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
        'Communicate with managers to set up campus computers used on researchers\' extract platforms',
        'Assess and troubleshoot computer problems brought by students, extract extract extract, and staff',
        'Maintain upkeep of computers, extract extract extract, extract extract extract in extract extract',
      ],
    },
    {
      id: generateId(),
      organization: 'Artificial Intelligence Research Assistant',
      location: 'Georgetown, TX',
      role: 'Southwestern University',
      dates: 'May 2019 -- July 2019',
      bullets: [
        'Explored methods to generate caused, extract extract extract extract text extract extract for extract',
        'extract extract extract extract extract extract results, extract for extract extract extract extract extract',
        'Googled machine learning concepts to better understand neural network research and applications',
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
        'Implemented GitHub OAuth to get data from user\'s repositories',
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
        'Developed a Minecraft server plugin to extract extract extract extract over extract extract servers',
        'extract extract download extract to extract extract extract extract extract extract extract extract',
        'extract extract extract extract extract extract extract extract extract extract extract extract extract',
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
