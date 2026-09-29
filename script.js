(function () {
  "use strict";
  var root = document.documentElement;
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  $("year").textContent = new Date().getFullYear();

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  /* ---------- Theme ---------- */
  function toggleTheme() {
    var dark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var next = dark ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  }
  $("theme").addEventListener("click", toggleTheme);

  /* ---------- Mobile menu ---------- */
  var menu = $("menu"), burger = $("burger");
  burger.addEventListener("click", function () {
    burger.setAttribute("aria-expanded", menu.classList.toggle("open"));
  });
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { menu.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); }
  });

  /* ---------- Scroll progress + scroll-spy ---------- */
  var links = [].slice.call(menu.querySelectorAll("a"));
  var sections = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var max = document.documentElement.scrollHeight - innerHeight;
    $("progress").style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
    var current = -1;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top <= 120) current = i; });
    links.forEach(function (a, i) { a.classList.toggle("active", i === current); });
  }
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- Typing effect ---------- */
  var words = ["Odoo modules", "HR and payroll software", "clean, tested Python code"];
  var typed = $("typed");
  if (reduce) {
    typed.textContent = words[0];
  } else {
    var w = 0, c = 0, del = false;
    (function tick() {
      var word = words[w];
      typed.textContent = word.slice(0, c);
      if (!del && c === word.length) { del = true; return setTimeout(tick, 1600); }
      if (del && c === 0) { del = false; w = (w + 1) % words.length; }
      c += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 70);
    })();
  }

  /* ---------- Hero network canvas ---------- */
  (function network() {
    var canvas = $("net"), ctx = canvas.getContext("2d");
    var dots = [], mouse = { x: -999, y: -999 }, raf, visible = true, W, H;
    function color(a) {
      return "rgba(" + getComputedStyle(root).getPropertyValue("--net").trim() + "," + a + ")";
    }
    function resize() {
      var r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      canvas.width = W * d; canvas.height = H * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
      var n = Math.round(Math.min(90, (W * H) / 16000));
      dots = [];
      for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 });
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(function (p) {
        if (!reduce) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
        }
        ctx.fillStyle = color(.7);
        ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.283); ctx.fill();
      });
      for (var i = 0; i < dots.length; i++) {
        for (var j = i + 1; j < dots.length; j++) {
          var dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y, d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) { ctx.strokeStyle = color(.18 * (1 - d / 130)); ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke(); }
        }
        var mx = dots[i].x - mouse.x, my = dots[i].y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 160) { ctx.strokeStyle = color(.5 * (1 - md / 160)); ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
      }
      if (visible && !reduce) raf = requestAnimationFrame(frame);
    }
    canvas.parentNode.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    canvas.parentNode.addEventListener("pointerleave", function () { mouse.x = mouse.y = -999; });
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) { cancelAnimationFrame(raf); frame(); }
    }).observe(canvas);
    addEventListener("resize", function () { resize(); if (reduce) frame(); });
    resize(); frame();
  })();

  /* ---------- Cursor glow + card tilt (mouse devices only) ---------- */
  if (finePointer && !reduce) {
    var glow = $("glow");
    addEventListener("pointermove", function (e) {
      document.body.classList.add("has-pointer");
      glow.style.left = e.clientX + "px"; glow.style.top = e.clientY + "px";
    }, { passive: true });
    document.querySelectorAll(".tilt").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = "perspective(800px) rotateX(" + (-y * 5) + "deg) rotateY(" + (x * 5) + "deg) translateY(-3px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------- Module explorer ---------- */
  var modules = {
    attendance: {
      title: "Attendance & timekeeping",
      desc: "Turns raw time logs into clean attendance records: late, undertime, overtime and night hours, all following each employee's work shift.",
      chips: ["Work shifts", "Late & undertime", "Overtime", "Night differential"],
      code: "class HrAttendanceRecord(models.Model):\n    _inherit = \"hr.attendance\"\n\n    late_minutes = fields.Integer(\n        compute=\"_compute_late_minutes\", store=True)\n\n    @api.depends(\"check_in\", \"shift_id.start_time\")\n    def _compute_late_minutes(self):\n        for rec in self:\n            rec.late_minutes = rec._minutes_after_shift_start()"
    },
    payroll: {
      title: "Payroll",
      desc: "Computes pay from attendance, leave and deductions, including statutory contributions, so payslips are accurate and auditable.",
      chips: ["Payslips", "Statutory contributions", "13th month pay", "Tax"],
      code: "class HrPayslip(models.Model):\n    _inherit = \"hr.payslip\"\n\n    @api.constrains(\"date_from\", \"date_to\")\n    def _check_period(self):\n        for slip in self:\n            if slip.date_from > slip.date_to:\n                raise ValidationError(\n                    _(\"Period start must be before its end.\"))"
    },
    leave: {
      title: "Leave management",
      desc: "Handles leave requests, balances and approvals, and feeds approved leave into attendance and payroll so nothing is counted twice.",
      chips: ["Balances", "Approval flow", "Leave types", "Payroll sync"],
      code: "def action_approve(self):\n    for leave in self.filtered(lambda l: l.state == \"confirm\"):\n        leave._check_balance()\n        leave.state = \"validate\"\n    return True"
    },
    employee: {
      title: "Employee management",
      desc: "Keeps employee records, contracts and movements in one place, with access rules so people only see the data they should.",
      chips: ["Contracts", "Movements", "Access rules", "Multi-company"],
      code: "<record id=\"hr_employee_rule\" model=\"ir.rule\">\n  <field name=\"name\">Employee: own company only</field>\n  <field name=\"model_id\" ref=\"hr.model_hr_employee\"/>\n  <field name=\"domain_force\">\n    [('company_id', 'in', company_ids)]\n  </field>\n</record>"
    }
  };
  var tabs = [].slice.call(document.querySelectorAll(".tabs button"));
  var panel = document.querySelector(".panel");
  function showTab(key) {
    var m = modules[key];
    tabs.forEach(function (b) { b.setAttribute("aria-selected", b.dataset.tab === key); });
    $("tab-title").textContent = m.title;
    $("tab-desc").textContent = m.desc;
    var chips = $("tab-chips"); chips.textContent = "";
    m.chips.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; chips.appendChild(li); });
    $("tab-code").textContent = m.code;
    panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
  }
  tabs.forEach(function (b, i) {
    b.addEventListener("click", function () { showTab(b.dataset.tab); });
    b.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var n = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
      n.focus(); showTab(n.dataset.tab);
    });
  });
  showTab("attendance");

  /* ---------- Overtime playground ---------- */
  var rate = $("rate"), hours = $("hours"), day = $("daytype");
  var fmt = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
  function calc() {
    var r = Math.max(0, parseFloat(rate.value) || 0), h = Math.max(0, parseFloat(hours.value) || 0), m = parseFloat(day.value);
    $("ot-total").textContent = fmt.format(r * h * m);
    $("ot-formula").textContent = r + " × " + h + " hrs × " + m + " = " + (r * h * m).toFixed(2);
  }
  [rate, hours, day].forEach(function (el) { el.addEventListener("input", calc); });
  calc();

  /* ---------- Skill filter ---------- */
  var filterBtns = [].slice.call(document.querySelectorAll(".filters button"));
  var skillItems = [].slice.call(document.querySelectorAll("#skill-cloud li"));
  filterBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      filterBtns.forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      skillItems.forEach(function (li) { li.classList.toggle("dim", b.dataset.f !== "all" && li.dataset.c !== b.dataset.f); });
    });
  });

  /* ---------- Copy email ---------- */
  var email = "vincentrbibay@gmail.com";
  function copyEmail() {
    var done = function () { toast("Email address copied"); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(done, function () { toast(email); });
    else toast(email);
  }
  $("copy").addEventListener("click", copyEmail);

  /* ---------- Command palette (Ctrl/Cmd + K) ---------- */
  var pal = $("palette"), pin = $("palette-input"), plist = $("palette-list");
  var commands = [
    { label: "About", hint: "Go to", run: function () { go("#about"); } },
    { label: "Experience", hint: "Go to", run: function () { go("#experience"); } },
    { label: "What I build", hint: "Go to", run: function () { go("#build"); } },
    { label: "Playground", hint: "Go to", run: function () { go("#playground"); } },
    { label: "Skills", hint: "Go to", run: function () { go("#skills"); } },
    { label: "Selected work", hint: "Go to", run: function () { go("#work"); } },
    { label: "Contact", hint: "Go to", run: function () { go("#contact"); } },
    { label: "Toggle light / dark theme", hint: "Action", run: toggleTheme },
    { label: "Copy email address", hint: "Action", run: copyEmail },
    { label: "Send an email", hint: "Action", run: function () { location.href = "mailto:" + email; } }
  ];
  var shown = [], sel = 0;
  function go(hash) { var el = document.querySelector(hash); if (el) el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); }
  function render() {
    var q = pin.value.trim().toLowerCase();
    shown = commands.filter(function (c) { return c.label.toLowerCase().indexOf(q) !== -1; });
    sel = Math.min(sel, Math.max(shown.length - 1, 0));
    plist.textContent = "";
    shown.forEach(function (c, i) {
      var li = document.createElement("li");
      li.setAttribute("role", "option"); li.setAttribute("aria-selected", i === sel);
      var s = document.createElement("span"); s.textContent = c.label;
      var h = document.createElement("small"); h.textContent = c.hint;
      li.appendChild(s); li.appendChild(h);
      li.addEventListener("click", function () { choose(i); });
      plist.appendChild(li);
    });
  }
  function choose(i) { var c = shown[i]; if (!c) return; closePalette(); c.run(); }
  var lastFocus;
  function openPalette() { lastFocus = document.activeElement; pal.hidden = false; pin.value = ""; sel = 0; render(); pin.focus(); }
  function closePalette() { pal.hidden = true; if (lastFocus) lastFocus.focus(); }
  $("palette-btn").addEventListener("click", openPalette);
  pal.addEventListener("click", function (e) { if (e.target === pal) closePalette(); });
  pin.addEventListener("input", function () { sel = 0; render(); });
  pin.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % shown.length; render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel + shown.length - 1) % shown.length; render(); }
    else if (e.key === "Enter") { e.preventDefault(); choose(sel); }
  });
  addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); pal.hidden ? openPalette() : closePalette(); }
    else if (e.key === "Escape" && !pal.hidden) closePalette();
  });
})();
