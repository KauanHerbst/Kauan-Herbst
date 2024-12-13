const sections = [
  { id: "about-me", linkId: "link-about-me" },
  { id: "skills", linkId: "link-skills" },
  { id: "academic", linkId: "link-academic" },
  { id: "experience", linkId: "link-experience" },
  { id: "projects", linkId: "link-projects" },
];

function changeNavBarMenu() {
  const hamburgerButton = document.getElementById("hamburger-button");
  const sidebar = document.getElementById("sidebar");
  const divAux = document.getElementById("div-aux");

  if (window.innerWidth <= 1024) {
    hamburgerButton.classList.remove("hidden");
    sidebar.classList.add("hidden");
    divAux.classList.add("hidden");

    hamburgerButton.removeEventListener("click", toggleSidebar);
    hamburgerButton.addEventListener("click", toggleSidebar);

    sections.forEach(({ linkId }) => {
      const link = document.getElementById(linkId);
      link.removeEventListener("click", closeSidebar);
      link.addEventListener("click", closeSidebar);
    });
  } else {
    hamburgerButton.classList.add("hidden");
    sidebar.classList.remove("hidden");
    divAux.classList.remove("hidden");
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const hamburgerDiv = document.getElementById("img-hamburguer");

  if (sidebar.classList.contains("hidden")) {
    hamburgerDiv.classList.remove("bg-justifySvg");
    hamburgerDiv.classList.add("bg-closeSvg");
    sidebar.classList.remove("div-disappear");
    sidebar.classList.add("div-appear");
    sidebar.classList.remove("hidden");
  } else {
    closeSidebar();
  }
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const hamburgerDiv = document.getElementById("img-hamburguer");

  hamburgerDiv.classList.remove("bg-closeSvg");
  hamburgerDiv.classList.add("bg-justifySvg");
  sidebar.classList.remove("div-appear");
  sidebar.classList.add("div-disappear");

  sidebar.addEventListener(
    "animationend",
    () => {
      sidebar.classList.add("hidden");
    },
    { once: true }
  );
}

function resetSidebarState() {
  const sidebar = document.getElementById("sidebar");

  if (window.innerWidth <= 1024) {
    sidebar.classList.add("hidden");
    sidebar.classList.remove("div-appear", "div-disappear");
    sidebar.style.transform = "";
    sidebar.style.opacity = "";
    sidebar.style.visibility = "";
  } else {
    sidebar.classList.remove("hidden");
    sidebar.classList.remove("div-appear", "div-disappear");
    sidebar.style.transform = "";
    sidebar.style.opacity = "";
    sidebar.style.visibility = "";
  }
}

function updateSectionsNav() {
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
}

function buttonToHero() {
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
}

updateSectionsNav();
buttonToHero();
changeNavBarMenu();

window.addEventListener("resize", () => {
  changeNavBarMenu();
  resetSidebarState();
});

window.addEventListener("scroll", () => {
  updateSectionsNav();
  buttonToHero();
});
