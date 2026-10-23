/* Lazed website scripts. No libraries, no tracking. Every page works without this file;
   it only adds: the mobile menu, computer detection, the demo in the hero, download checks,
   the contact helper and the "on this page" highlight. */
(function () {
  "use strict";

  var CFG = window.LAZED || { supportEmail: "support@lazed.co.in", downloads: {} };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  /* ---------- Footer year ---------- */
  $all("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  var toggle = $(".nav-toggle");
  var nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("nav-open")) {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
    $all(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Which computer is this? ---------- */
  function detectOS() {
    var ua = navigator.userAgent || "";
    var platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
    var touchMac = /Mac/i.test(platform) && navigator.maxTouchPoints > 1; // iPad asking for the desktop site
    if (/Android|iPhone|iPad|iPod/i.test(ua) || touchMac) return "mobile";
    if (/Win/i.test(platform) || /Windows/i.test(ua)) return "windows";
    if (/Mac/i.test(platform) || /Macintosh/i.test(ua)) return "mac";
    return "other";
  }
  var OS = detectOS();
  document.documentElement.setAttribute("data-os", OS);

  var NAMES = { windows: "Windows", mac: "Mac" };
  $all("[data-os-label]").forEach(function (el) {
    if (NAMES[OS]) el.textContent = "Download for " + NAMES[OS];
    else if (OS === "mobile") el.textContent = "Get Lazed for your computer";
  });
  $all("[data-os-link]").forEach(function (el) {
    if (NAMES[OS]) el.setAttribute("href", "download.html#" + OS);
  });

  /* ---------- Download page ---------- */
  var platforms = $all(".platform");
  if (platforms.length) {
    var mobileNote = $("#mobile-note");
    if (OS === "mobile" && mobileNote) mobileNote.hidden = false;

    if (NAMES[OS]) {
      var mine = $('.platform[data-platform="' + OS + '"]');
      if (mine) {
        mine.classList.add("is-match");
        var badge = $(".match-badge", mine);
        if (badge) badge.hidden = false;
        mine.style.order = "-1";
      }
    }

    if (CFG.version) {
      $all("[data-version]").forEach(function (el) {
        el.textContent = "Version " + CFG.version;
        el.hidden = false;
      });
    }

    // Fills in one download (button, checksum, size) and hides it as "Coming soon" if the file is missing.
    function wire(scope, conf, card) {
      var btn = $("[data-download]", scope);
      if (btn && conf.file) btn.setAttribute("href", conf.file);

      var sizeEl = $("[data-size]", scope);
      if (sizeEl && conf.size) { sizeEl.textContent = conf.size; sizeEl.hidden = false; }

      var hash = $("[data-hash]", scope);
      if (hash) {
        if (conf.sha256) { $("code", hash).textContent = conf.sha256; hash.hidden = false; }
        else hash.hidden = true;
      }

      // Is the file really on the server? (Skipped when the page is opened from a disk folder.)
      if (!/^https?:$/.test(location.protocol) || !conf.file) return;
      fetch(conf.file, { method: "HEAD", cache: "no-store" }).then(function (res) {
        var type = (res.headers.get("content-type") || "").toLowerCase();
        var missing = res.status === 404 || res.status === 410 || (res.ok && type.indexOf("text/html") !== -1);
        if (missing) {
          if (btn) {
            btn.setAttribute("aria-disabled", "true");
            btn.removeAttribute("href");
            btn.removeAttribute("download");
            btn.textContent = "Coming soon";
          }
          if (sizeEl) sizeEl.hidden = true;
          var un = $("[data-unavailable]", scope) || $("[data-unavailable]", card);
          if (un) un.hidden = false;
          return;
        }
        var len = parseInt(res.headers.get("content-length") || "0", 10);
        if (res.ok && len && sizeEl) {
          sizeEl.textContent = len >= 1048576 ? (len / 1048576).toFixed(len >= 104857600 ? 0 : 1) + " MB" : Math.max(1, Math.round(len / 1024)) + " KB";
          sizeEl.hidden = false;
        }
      }).catch(function () { /* offline: leave the link as it is */ });
    }

    platforms.forEach(function (card) {
      var key = card.getAttribute("data-platform");
      var conf = (CFG.downloads || {})[key];
      if (!conf) return;

      var reqs = $("[data-reqs]", card);
      if (reqs && conf.requirements && conf.requirements.length) {
        reqs.replaceChildren.apply(reqs, conf.requirements.map(function (t) {
          var li = document.createElement("li");
          li.textContent = t;
          return li;
        }));
      }

      if (conf.variants) {
        // One card, several installers (for example Mac: Apple Silicon and Intel)
        $all("[data-variant]", card).forEach(function (box) {
          var vconf = conf.variants[box.getAttribute("data-variant")];
          if (vconf) wire(box, vconf, card);
        });
      } else {
        wire(card, conf, card);
      }
    });
  }

  /* ---------- Hero demo ---------- */
  var chat = $("#demo-chat");
  var chipWrap = $("#demo-chips");
  if (chat && chipWrap) {
    var EXAMPLES = {
      deck: {
        label: "Slide deck",
        ask: "Make a deck for the board on why we should open a second store.",
        steps: ["Looking up local retail data", "Building the slides", "Checking every slide for clipped text"],
        ext: ".pptx", name: "second-store.pptx", reply: "Your deck is ready."
      },
      sheet: {
        label: "Spreadsheet",
        ask: "Turn my October expenses into a sheet with a total for each category.",
        steps: ["Sorting expenses into categories", "Adding totals and formatting", "Setting column widths"],
        ext: ".xlsx", name: "october-expenses.xlsx", reply: "Your spreadsheet is ready."
      },
      report: {
        label: "Report",
        ask: "Write a one-page proposal for a rooftop solar installation.",
        steps: ["Researching current solar schemes", "Writing the proposal", "Checking the page layout"],
        ext: ".docx", name: "solar-proposal.docx", reply: "Your document is ready."
      },
      site: {
        label: "Website",
        ask: "Build a one-page website for my bakery.",
        steps: ["Finding real photos", "Building the page", "Checking it on desktop and phone"],
        ext: ".html", name: "bakery-site.html", reply: "Your website is ready."
      }
    };
    var order = ["deck", "sheet", "report", "site"];
    var runId = 0;

    function el(tag, cls, text) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text) n.textContent = text;
      return n;
    }
    function fileCard(ex) {
      var f = el("div", "file");
      f.appendChild(el("span", "file-ext", ex.ext));
      var box = el("div", "file-name", ex.name);
      box.appendChild(el("span", "file-sub", "Saved to your folder"));
      f.appendChild(box);
      return f;
    }
    function setPressed(key) {
      $all(".chip", chipWrap).forEach(function (c) {
        c.setAttribute("aria-pressed", c.getAttribute("data-key") === key ? "true" : "false");
      });
    }

    async function play(key, instant) {
      var ex = EXAMPLES[key];
      var id = ++runId;
      var alive = function () { return id === runId; };
      setPressed(key);
      chat.setAttribute("aria-busy", "true");
      chat.replaceChildren();

      var user = el("div", "msg-user");
      chat.appendChild(user);
      var bot = el("div", "msg-bot");
      var list = el("ul", "steps");

      if (instant) {
        user.textContent = ex.ask;
        ex.steps.forEach(function (s) { list.appendChild(el("li", "", s)); });
        bot.appendChild(list);
        bot.appendChild(fileCard(ex));
        chat.appendChild(bot);
        chat.setAttribute("aria-busy", "false");
        return;
      }

      for (var i = 1; i <= ex.ask.length; i++) {
        if (!alive()) return;
        user.textContent = ex.ask.slice(0, i);
        await wait(16);
      }
      await wait(350);
      if (!alive()) return;
      var typing = el("div", "msg-bot");
      var dots = el("span", "typing");
      dots.innerHTML = "<span></span><span></span><span></span>";
      typing.appendChild(dots);
      chat.appendChild(typing);
      await wait(800);
      if (!alive()) return;
      typing.remove();
      bot.appendChild(list);
      chat.appendChild(bot);
      for (var j = 0; j < ex.steps.length; j++) {
        list.appendChild(el("li", "", ex.steps[j]));
        await wait(850);
        if (!alive()) return;
      }
      bot.appendChild(fileCard(ex));
      chat.setAttribute("aria-busy", "false");
    }

    order.forEach(function (key) {
      var b = el("button", "chip", EXAMPLES[key].label);
      b.type = "button";
      b.setAttribute("data-key", key);
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () { play(key, reduceMotion); });
      var li = el("li");
      li.appendChild(b);
      chipWrap.appendChild(li);
    });
    // The page already contains the finished "deck" example for people without JavaScript.
    chipWrap.hidden = false;
    play("deck", reduceMotion);
  }

  /* ---------- Contact page ---------- */
  var copyBtn = $("#copy-email");
  if (copyBtn && navigator.clipboard) {
    copyBtn.hidden = false;
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(CFG.supportEmail).then(function () {
        var old = copyBtn.textContent;
        copyBtn.textContent = "Copied";
        setTimeout(function () { copyBtn.textContent = old; }, 2000);
      });
    });
  }
  var form = $("#help-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var topic = form.elements.topic.value;
      var account = form.elements.account.value.trim();
      var message = form.elements.message.value.trim();
      var system = form.elements.system ? form.elements.system.value : "";
      var body = "Account email: " + (account || "(not given)") + "\n" +
        (system ? "Computer: " + system + "\n" : "") +
        "\n" + message + "\n\n(Please do not include your password.)";
      var href = "mailto:" + CFG.supportEmail + "?subject=" + encodeURIComponent("Lazed support: " + topic) +
        "&body=" + encodeURIComponent(body);
      window.location.href = href;
    });
    var sys = form.elements.system;
    if (sys) {
      if (OS === "windows") sys.value = "Windows";
      else if (OS === "mac") sys.value = "Mac";
    }
  }

  /* ---------- "On this page" (legal pages) ---------- */
  var toc = $(".toc");
  if (toc) {
    if (window.matchMedia("(max-width: 959px)").matches) toc.removeAttribute("open");
    var links = $all("a", toc);
    var targets = links.map(function (a) { return document.getElementById(a.getAttribute("href").slice(1)); }).filter(Boolean);
    if ("IntersectionObserver" in window && targets.length) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            links.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id); });
          }
        });
      }, { rootMargin: "-90px 0px -70% 0px" });
      targets.forEach(function (t) { io.observe(t); });
    }
  }
})();
