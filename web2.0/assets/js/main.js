// 导航底部条定位
// 获取导航底部条元素
const navBar = document.querySelector(".nav_line");
const nav_items = document.querySelectorAll("nav .menu_item");
const father = document.querySelector("nav ul").getBoundingClientRect();
const default_item_rect = nav_items[0].getBoundingClientRect();
setNavBarPosition(default_item_rect.left, default_item_rect.width);

nav_items.forEach((item) => {
  item.addEventListener("click", (e) => {
    const rect = e.target.getBoundingClientRect();
    setNavBarPosition(rect.left, rect.width);
  });
});

function setNavBarPosition(x, width) {
  let left = x - father.left;
  navBar.style.left = `${left}px`;
  navBar.style.width = `${width}px`;
}

// 主题切换
const themeSwitch = document.querySelector(".theme");
const htmlRoot = document.documentElement;
const theme_img = themeSwitch.children[0];
let current_theme = localStorage.getItem("theme");
function changeTheme() {
  if (!current_theme) {
    current_theme = "light";
    htmlRoot.classList.remove("dark");
    localStorage.setItem("theme", "dark");
  } else if (current_theme === "light") {
    current_theme = "dark";
    htmlRoot.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else if (current_theme === "dark") {
    current_theme = "light";
    htmlRoot.classList.remove("dark");
    localStorage.setItem("theme", "light");
  } else {
    throw new Error("主题错误");
  }

  const themeImg = getThemeImg(current_theme);
  theme_img.src = themeImg;
}
//   获取主题图片
function getThemeImg(theme) {
  if (theme === "light") {
    return "/assets/icons/sun.svg";
  } else if (theme === "dark") {
    return "/assets/icons/moon.svg";
  } else {
    return "/assets/icons/sun.svg";
  }
}
function initTheme() {
  theme_img.src = getThemeImg(current_theme);
  if (current_theme) {
    if (current_theme === "dark") {
      htmlRoot.classList.add("dark");
    } else {
      htmlRoot.classList.remove("dark");
    }
  } else {
    changeTheme();
  }
}

initTheme();
themeSwitch.addEventListener("click", changeTheme);
