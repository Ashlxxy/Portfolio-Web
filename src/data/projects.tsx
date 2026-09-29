export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  id: string;
  title: string;
  category: string;
  period: string;
  description: string;
  highlights: string[];
  technologies: string[];
  links: ProjectLink[];
};

const projects: Project[] = [
  {
    id: "ukm-band-platform",
    title: "UKM Band Platform",
    category: "Mobile & Web Music Platform",
    period: "Oct 2025 — Jun 2026",
    description:
      "A digital music platform for Telkom University's student band community, delivered across mobile, web, and API clients.",
    highlights: [
      "Built a Flutter mobile experience for songs, playlists, listening history, likes, comments, and user profiles.",
      "Delivered a Laravel 12 web portal and REST API with role-based user and administrator flows.",
      "Integrated Firebase Authentication and Cloud Firestore as an optional mobile backend.",
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Laravel",
      "PHP",
      "Firebase",
      "REST API",
    ],
    links: [
      {
        label: "Mobile repository",
        href: "https://github.com/Ashlxxy/App-UKMBand",
      },
      {
        label: "Web repository",
        href: "https://github.com/Ashlxxy/WebPro-UKMBand",
      },
    ],
  },
  {
    id: "pbo-ukm-band",
    title: "UKM Band Spring Boot",
    category: "Academic Web Application",
    period: "Dec 2025",
    description:
      "A Java-based music player and content-management application created for an object-oriented programming course.",
    highlights: [
      "Implemented authentication, song management, playlists, likes, listening history, comments, and feedback.",
      "Added an administrator dashboard for content management and popular-song statistics.",
    ],
    technologies: ["Java 17", "Spring Boot", "MySQL", "JSP", "Maven"],
    links: [
      { label: "GitHub", href: "https://github.com/Ashlxxy/PBO-UKMBand" },
    ],
  },
  {
    id: "buitenworks",
    title: "Buitenworks",
    category: "Fashion E-Commerce Prototype",
    period: "Nov 2025 — Jun 2026",
    description:
      "A lightweight fashion storefront prototype focused on responsive UI and interaction design.",
    highlights: [
      "Designed responsive product, community, archive, account, and brand pages.",
      "Implemented a cart drawer, authentication modal, masonry gallery, and tab interactions without a framework.",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ashlxxy/Project-Buitenworks",
      },
    ],
  },
  {
    id: "election-system",
    title: "Election Management System",
    category: "Command-Line Application",
    period: "Jun 2024",
    description:
      "A Go command-line application modeling election administration and voter workflows.",
    highlights: [
      "Supports party, candidate, and voter data entry, editing, deletion, sorting, and searching.",
      "Provides separate administrator and voter flows with login and voting-time validation.",
    ],
    technologies: ["Go", "CLI", "Data Structures", "Search & Sort"],
    links: [
      { label: "GitHub", href: "https://github.com/Ashlxxy/Tubes_Pemilu" },
    ],
  },
  {
    id: "webpro-module-4",
    title: "Web Programming Module 4",
    category: "Responsive Landing Page",
    period: "Oct — Dec 2025",
    description:
      "A responsive multi-section landing-page exercise with a hero, collection grid, about content, and login page.",
    highlights: [
      "Practiced responsive layout, navigation, cards, imagery, and page-level styling.",
      "Built with native browser technologies and no frontend framework.",
    ],
    technologies: ["HTML5", "CSS3", "Responsive Design"],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ashlxxy/TP-Webpro-MOD-4",
      },
    ],
  },
  {
    id: "webpro-module-3",
    title: "Web Programming Module 3",
    category: "Personal Profile Exercise",
    period: "Sep 2025",
    description:
      "An introductory semantic HTML profile page created as a web-programming exercise.",
    highlights: [
      "Structured biodata and skills with tables, media, external links, and a contact form.",
      "Established the semantic HTML foundation used in later web coursework.",
    ],
    technologies: ["HTML5", "Forms", "Tables", "Media"],
    links: [
      { label: "GitHub", href: "https://github.com/Ashlxxy/WebPro-MOD3" },
    ],
  },
  {
    id: "portfolio-web",
    title: "Interactive Portfolio",
    category: "Creative Developer Portfolio",
    period: "May 2026 — Present",
    description:
      "This interactive portfolio combines a modern content experience with real-time, motion, and 3D details.",
    highlights: [
      "Built a responsive Next.js portfolio with an interactive 3D skill keyboard and animated section transitions.",
      "Added project showcases, MDX blog content, realtime presence features, and a direct contact flow.",
      "Configured static deployment for Cloudflare Workers Assets.",
    ],
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Spline",
      "Cloudflare",
    ],
    links: [
      {
        label: "GitHub",
        href: "https://github.com/Ashlxxy/Portfolio-Web",
      },
    ],
  },
  {
    id: "wand-enhancer",
    title: "Wand Enhancer",
    category: "Open-Source Fork & Contribution",
    period: "Aug 2026",
    description:
      "A maintained fork of an interoperability and UX extension for the Wand desktop application.",
    highlights: [
      "Extends local configuration, layout, theming, and compatibility workflows for the desktop client.",
      "Includes a LAN remote-control panel and support for trusted custom renderer scripts.",
      "Combines a .NET patcher, native helper, and web-panel tooling.",
    ],
    technologies: ["C#", ".NET", "C", "CMake", "PowerShell", "WebSocket"],
    links: [
      {
        label: "Fork on GitHub",
        href: "https://github.com/Ashlxxy/Wand-Enhancer",
      },
    ],
  },
];

export default projects;
