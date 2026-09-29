const config = {
  title: "Ade Rainhard Pasaribu | Full-Stack Developer",
  description: {
    long: "Portfolio of Ade Rainhard Pasaribu, an Information Technology student and full-stack developer building responsive web, mobile, API, and interactive digital experiences.",
    short:
      "Ade Rainhard Pasaribu — full-stack developer and Information Technology student.",
  },
  keywords: [
    "Ade Rainhard Pasaribu",
    "Ashlxxy",
    "full-stack developer",
    "information technology",
    "React",
    "Next.js",
    "Node.js",
    "Flutter",
    "Laravel",
    "Spring Boot",
    "UKM Band",
    "Buitenworks",
    "Wand Enhancer",
  ],
  author: "Ade Rainhard Pasaribu",
  email: "aderainhardp@gmail.com",
  site: "https://github.com/Ashlxxy",

  // for github stars button
  githubUsername: "Ashlxxy",
  githubRepo: "Portfolio-Web",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/Ashlxy_el",
    linkedin: "https://www.linkedin.com/in/ade-rainhard-pasaribu-42426432a",
    instagram: "https://www.instagram.com/aderainhard",
    facebook: "",
    github: "https://github.com/Ashlxxy",
  },
};
export { config };
