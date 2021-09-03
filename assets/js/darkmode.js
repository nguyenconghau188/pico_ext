let darkMode = localStorage.getItem("darkMode");
const darkModeToggle = document.querySelector("#btn-darkmode-toggle");
let mainCard = document.querySelector(".card")
    
const enableDarkMode = () => {
  mainCard.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", "enabled");
}

const disableDarkMode = () => {
  mainCard.classList.remove("dark-mode");
  localStorage.setItem("darkMode", null);
}
if (darkMode === "enabled") {
  enableDarkMode();
}

darkModeToggle.addEventListener("click", () => {
  let darkMode = localStorage.getItem("darkMode");
  if (darkMode !== "enabled") {
    enableDarkMode();
  }
  else {
    disableDarkMode();
  }
});