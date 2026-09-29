(function () {
  var root = document.documentElement;
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  var menu = document.getElementById("menu");
  var burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });

  // Highlight the nav link of the section currently in view
  var links = [].slice.call(menu.querySelectorAll("a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 120) current = i; });
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      a.classList.toggle("active", i === current);
    });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
