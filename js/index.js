const sections = [
  { id: "about-me", linkId: "link-about-me" },
  { id: "skills", linkId: "link-skills" },
  { id: "academic", linkId: "link-academic" },
  { id: "experience", linkId: "link-experience" },
  { id: "projects", linkId: "link-projects" },
];

window.addEventListener("scroll", () => {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionElement = document.getElementById(section.id);
    if (sectionElement) {
      const sectionTop = sectionElement.offsetTop;
      const sectionHeight = sectionElement.offsetHeight;

      if (window.scrollY >= sectionTop - sectionHeight / 3) {
        currentSection = section.id;
      }
    }
  });

  sections.forEach((section) => {
    const linkElement = document.getElementById(section.linkId);
    if (linkElement) {
      if (section.id === currentSection) {
        linkElement.classList.add("active");
      } else {
        linkElement.classList.remove("active");
      }
    }
  });

  const heroSection = document.getElementById("hero");
  const backToTopButton = document.getElementById("back-to-top");

  const heroBottom = heroSection.getBoundingClientRect().top;

  if (heroBottom < 0) {
    backToTopButton.classList.remove("hidden");
    backToTopButton.classList.add("visible");
  } else {
    backToTopButton.classList.remove("visible");
    backToTopButton.classList.add("hidden");
  }
});
