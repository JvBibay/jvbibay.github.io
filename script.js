(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  // Theme toggle
  document.getElementById("theme").addEventListener("click", function () {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // Mobile menu
  var menu = document.getElementById("menu");
  var burger = document.getElementById("burger");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", open);
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });

  // Scroll progress, navbar background, active link
  var nav = document.getElementById("nav");
  var bar = document.getElementById("progress");
  var links = [].slice.call(menu.querySelectorAll("a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    nav.classList.toggle("scrolled", scrollY > 10);
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 120) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("active", i === current); });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal on scroll + animate skill bars
  document.querySelectorAll("[data-skills] li").forEach(function (li) {
    li.querySelector("b").style.setProperty("--lvl", li.dataset.level);
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      en.target.querySelectorAll("[data-skills]").forEach(function (u) { u.classList.add("in"); });
      io.unobserve(en.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Typing effect
  var words = ["responsive websites", "clean front-end code", "things that work on the web"];
  var el = document.getElementById("typed");
  if (reduce) { el.textContent = words[0]; return; }
  var w = 0, c = 0, del = false;
  (function tick() {
    var word = words[w];
    el.textContent = word.slice(0, c);
    if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1;
    setTimeout(tick, del ? 35 : 70);
  })();
})();
