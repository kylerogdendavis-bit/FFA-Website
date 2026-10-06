(function () {
  "use strict";
  var PRODUCTS = window.PRODUCTS;
  var CFG = window.SITE_CONFIG;
  var CART_KEY = "bourbon-ffa-cart";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return "$" + n.toFixed(2); };

  // ---------- storage ----------
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
  }
  function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* private mode */ }
  }
  var cart = loadCart().filter(function (l) { return PRODUCTS.some(function (p) { return p.id === l.id; }); });

  // ---------- DOM helpers (no innerHTML with user data) ----------
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function toast(msg) {
    var t = el("div", { class: "toast", role: "status", text: msg });
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }

  // ---------- placeholder artwork ----------
  var NS = "http://www.w3.org/2000/svg";
  function art(p) {
    if (p.image) return el("img", { src: p.image, alt: p.name, loading: "lazy" });
    var svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 200 150");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", p.name);
    var shapes = {
      shirt:
        '<rect width="200" height="150" fill="#fff4d1"/>' +
        '<path d="M70 20 L40 35 L20 65 L45 78 L55 62 L55 130 L145 130 L145 62 L155 78 L180 65 L160 35 L130 20 Q100 40 70 20Z" fill="#003366"/>' +
        '<text x="100" y="82" text-anchor="middle" font-family="sans-serif" font-weight="900" font-size="20" fill="#f0ab00">FFA</text>',
      banner:
        '<rect width="200" height="150" fill="#fff4d1"/>' +
        '<rect x="20" y="42" width="160" height="66" rx="3" fill="#003366"/>' +
        '<g fill="#f0ab00"><circle cx="28" cy="50" r="3"/><circle cx="172" cy="50" r="3"/><circle cx="28" cy="100" r="3"/><circle cx="172" cy="100" r="3"/></g>' +
        '<text x="100" y="82" text-anchor="middle" font-family="sans-serif" font-weight="800" font-size="17" fill="#f0ab00">YOUR TEXT HERE</text>',
      engraved:
        '<rect width="200" height="150" fill="#fff4d1"/>' +
        '<rect x="40" y="30" width="120" height="90" rx="14" fill="#b27a43"/>' +
        '<rect x="40" y="30" width="120" height="90" rx="14" fill="none" stroke="#8a5a2b" stroke-width="3"/>' +
        '<text x="100" y="82" text-anchor="middle" font-family="serif" font-weight="700" font-size="17" fill="#5b3716">Engraved</text>',
    };
    svg.innerHTML = shapes[p.type] || shapes.shirt; // static, trusted markup only
    return svg;
  }

  // ---------- product grid ----------
  var filter = "all";
  function renderGrid() {
    var grid = $("#grid");
    grid.textContent = "";
    PRODUCTS.filter(function (p) { return filter === "all" || p.type === filter; })
      .forEach(function (p) { grid.appendChild(productCard(p)); });
  }

  function productCard(p) {
    var fields = {};
    var opts = el("div", { class: "opts" });
    Object.keys(p.options || {}).forEach(function (name) {
      var val = p.options[name];
      var input;
      if (val === "custom") {
        input = el("input", { type: "text", maxlength: "80", placeholder: "Text / design instructions", "aria-label": name });
      } else {
        input = el("select", { "aria-label": name }, val.map(function (v) { return el("option", { text: v }); }));
      }
      fields[name] = input;
      opts.appendChild(input.tagName === "SELECT"
        ? el("label", { text: name }, [input])
        : el("label", { text: "Custom text" }, [input]));
    });

    var btn = el("button", {
      class: "btn primary", type: "button", text: "Add to cart",
      onclick: function () {
        var chosen = {};
        Object.keys(fields).forEach(function (k) { chosen[k] = fields[k].value.trim(); });
        addToCart(p.id, chosen);
      },
    });

    return el("article", { class: "card product" }, [
      el("div", { class: "art" }, [art(p)]),
      el("div", { class: "body" }, [
        el("h3", { text: p.name }),
        el("p", { text: p.description }),
        el("div", { class: "price", text: money(p.price) }),
        opts,
        btn,
      ]),
    ]);
  }

  // ---------- cart ----------
  function key(id, chosen) { return id + "|" + JSON.stringify(chosen); }

  function addToCart(id, chosen) {
    var k = key(id, chosen);
    var line = cart.filter(function (l) { return l.key === k; })[0];
    if (line) line.qty += 1; else cart.push({ key: k, id: id, opts: chosen, qty: 1 });
    saveCart(); renderCart(); toast("Added to cart");
  }
  function product(id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }
  function cartTotal() {
    return cart.reduce(function (s, l) { return s + product(l.id).price * l.qty; }, 0);
  }

  function renderCart() {
    var box = $("#cart-items");
    box.textContent = "";
    var count = cart.reduce(function (s, l) { return s + l.qty; }, 0);
    $("#cart-count").textContent = count;
    $("#checkout").hidden = cart.length === 0;

    if (!cart.length) {
      box.appendChild(el("p", { class: "empty", text: "Your cart is empty." }));
      return;
    }
    cart.forEach(function (l) {
      var p = product(l.id);
      var meta = Object.keys(l.opts).filter(function (k) { return l.opts[k]; })
        .map(function (k) { return k + ": " + l.opts[k]; }).join(" · ");
      box.appendChild(el("div", { class: "line" }, [
        el("strong", { text: p.name }),
        el("span", { text: money(p.price * l.qty) }),
        meta ? el("span", { class: "meta", text: meta }) : null,
        el("span", { class: "qty" }, [
          el("button", { type: "button", "aria-label": "Decrease quantity", text: "−", onclick: function () { changeQty(l, -1); } }),
          el("span", { text: String(l.qty) }),
          el("button", { type: "button", "aria-label": "Increase quantity", text: "+", onclick: function () { changeQty(l, 1); } }),
        ]),
        el("button", { class: "link-btn", type: "button", text: "Remove", onclick: function () { changeQty(l, -l.qty); } }),
      ]));
    });
    box.appendChild(el("div", { class: "total" }, [el("span", { text: "Total" }), el("span", { text: money(cartTotal()) })]));
  }

  function changeQty(line, d) {
    line.qty += d;
    if (line.qty <= 0) cart = cart.filter(function (l) { return l !== line; });
    saveCart(); renderCart();
  }

  // ---------- drawer ----------
  var drawer = $("#drawer"), overlay = $("#overlay");
  function openCart() {
    overlay.hidden = false; drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false");
    $("#cart-close").focus();
  }
  function closeCart() {
    overlay.hidden = true; drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true");
    $("#cart-open").focus();
  }
  $("#cart-open").addEventListener("click", openCart);
  $("#cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });

  // ---------- filters ----------
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (o) { o.classList.remove("active"); o.setAttribute("aria-selected", "false"); });
      c.classList.add("active"); c.setAttribute("aria-selected", "true");
      filter = c.dataset.filter; renderGrid();
    });
  });

  // ---------- forms -> mailto ----------
  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (f) {
      var bad = !f.value.trim() || (f.type === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value));
      f.classList.toggle("invalid", bad);
      if (bad) ok = false;
    });
    return ok;
  }
  function sendMail(subject, body) {
    window.location.href = "mailto:" + CFG.orderEmail +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  $("#checkout").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(this) || !cart.length) return;
    var f = new FormData(this);
    var lines = cart.map(function (l) {
      var p = product(l.id);
      var o = Object.keys(l.opts).filter(function (k) { return l.opts[k]; })
        .map(function (k) { return k + ": " + l.opts[k]; }).join(", ");
      return "- " + l.qty + " x " + p.name + (o ? " (" + o + ")" : "") + " = " + money(p.price * l.qty);
    });
    sendMail(CFG.chapter + " order request from " + f.get("name"), [
      "ORDER REQUEST", "", lines.join("\n"), "", "Total: " + money(cartTotal()), "",
      "Name: " + f.get("name"), "Email: " + f.get("email"), "Phone: " + (f.get("phone") || "-"),
      "Delivery: " + f.get("delivery"), "Notes: " + (f.get("notes") || "-"),
    ].join("\n"));
  });

  $("#custom-form").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate(this)) return;
    var f = new FormData(this);
    sendMail("Custom order request: " + f.get("kind"), [
      "CUSTOM ORDER REQUEST", "", "Name: " + f.get("name"), "Email: " + f.get("email"),
      "Type: " + f.get("kind"), "", f.get("details"),
    ].join("\n"));
  });

  // ---------- init ----------
  $("#year").textContent = new Date().getFullYear();
  renderGrid();
  renderCart();
})();
