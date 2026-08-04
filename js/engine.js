/* ============================================================
   ZyvexWeb — Motor de demos. Lee js/config.js (window.DEMO) y
   arma la web por secciones. NO se edita: se edita config.js.
   Tipos de sección: hero, cards, split, steps, stats, gallery,
   portfolio, pricing, products, blog, panel, logos, testimonios,
   faq, cta.
   ============================================================ */
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const stars = (n = 5) => "★".repeat(n);
const money = (n) => (window.DEMO.marca.moneda || "S/") + " " + n;

const CART = [];

function boot() {
  const cfg = window.DEMO;
  if (!cfg) { document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">Falta js/config.js</p>'; return; }
  applyColors(cfg.marca.colores);
  document.title = `${cfg.marca.nombre} · ${cfg.marca.eslogan || ""}`.trim();
  buildNav(cfg);
  const main = $("#app");
  (cfg.secciones || []).forEach((s, i) => {
    const node = render(s, cfg);
    if (node) { node.id = s.id || ("s" + i); main.append(node); }
  });
  buildFooter(cfg.marca);
  $("#waFloat").href = wa(cfg.marca, "Hola! Vi la web y quiero más información 😊");
  setupReveal();
}

function applyColors(c) {
  if (!c) return;
  const m = { primario: "--primario", secundario: "--secundario", acento: "--acento", fondo: "--fondo", superficie: "--superficie", texto: "--texto", textoSuave: "--texto-suave" };
  Object.entries(m).forEach(([k, v]) => { if (c[k]) document.documentElement.style.setProperty(v, c[k]); });
}
function wa(m, msg) { return `https://wa.me/${(m.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`; }

function buildNav(cfg) {
  const links = (cfg.secciones || []).filter(s => s.menu).map(s => `<a href="#${s.id}">${s.menu}</a>`).join("");
  const hasCart = (cfg.secciones || []).some(s => s.tipo === "products");
  const cta = cfg.marca.ctaNav ? `<a href="#${cfg.marca.ctaNav.destino || 'contacto'}" class="btn btn-sm btn-primary">${cfg.marca.ctaNav.texto}</a>` : "";
  $("#nav").innerHTML = `<div class="container nav-inner">
      <a href="#top" class="brand">${cfg.marca.nombre}<span class="dot">.</span></a>
      <nav class="nav-links">${links}</nav>
      <div class="nav-right">${hasCart ? `<button class="cart-btn" id="cartBtn" aria-label="Carrito">🛒<span class="cart-count" id="cartCount" style="display:none">0</span></button>` : ""}${cta}</div>
    </div>`;
  if (hasCart) { $("#cartBtn").addEventListener("click", () => toggleCart(true)); buildCartDrawer(cfg.marca); }
}

function head(m) {
  return `<div class="head reveal"><span class="eyebrow">${m.etiqueta || ""}</span><h2>${m.titulo || ""}</h2>${m.descripcion ? `<p>${m.descripcion}</p>` : ""}</div>`;
}
function sec(cls, inner) { return el(`<section class="section ${cls || ""}"><div class="container">${inner}</div></section>`); }

function render(s, cfg) {
  switch (s.tipo) {
    case "hero": return renderHero(s, cfg);
    case "cards": return renderCards(s);
    case "split": return renderSplit(s);
    case "steps": return renderSteps(s);
    case "stats": return renderStats(s);
    case "gallery": return renderGallery(s);
    case "portfolio": return renderPortfolio(s);
    case "pricing": return renderPricing(s, cfg);
    case "products": return renderProducts(s, cfg);
    case "blog": return renderBlog(s);
    case "panel": return renderPanel(s);
    case "logos": return renderLogos(s);
    case "testimonios": return renderTst(s);
    case "faq": return renderFaq(s);
    case "cta": return renderCta(s, cfg);
    default: return null;
  }
}

function renderHero(h, cfg) {
  const notas = (h.notas || []).map(n => `<span>${n}</span>`).join("");
  const p1 = h.ctaPrimario || {}, p2 = h.ctaSecundario || {};
  const l1 = p1.destino ? `#${p1.destino}` : (p1.wa ? wa(cfg.marca, p1.wa) : "#");
  const sec = el(`<section class="hero" id="top"><div class="container hero-grid">
    <div class="hero-copy reveal">
      <span class="hero-badge">${h.etiqueta || ""}</span>
      <h1>${h.titulo} <span class="grad">${h.resaltado || ""}</span></h1>
      <p class="lead">${h.subtitulo || ""}</p>
      <div class="hero-cta">
        <a href="${l1}" ${p1.wa ? 'target="_blank" rel="noopener"' : ""} class="btn btn-primary">${p1.texto || "Empezar"}</a>
        ${p2.texto ? `<a href="#${p2.destino || 'contacto'}" class="btn btn-ghost">${p2.texto}</a>` : ""}
      </div>
      ${notas ? `<div class="hero-notas">${notas}</div>` : ""}
    </div>
    <div class="hero-visual reveal">
      <img src="${h.imagen}" alt="${cfg.marca.nombre}" loading="eager">
      ${h.tarjeta ? `<div class="float-card"><div class="stars">${stars(5)}</div><div><b>${h.tarjeta.titulo}</b><br><small>${h.tarjeta.texto}</small></div></div>` : ""}
    </div></div></section>`);
  return sec;
}

function renderCards(s) {
  const cards = s.items.map(i => `<div class="card reveal"><div class="ico">${i.icono || "✦"}</div><h3>${i.titulo}</h3><p>${i.texto}</p></div>`).join("");
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}<div class="grid-cards" style="--cols:${s.columnas || Math.min(s.items.length, 4)}">${cards}</div>`);
  return n;
}

function renderSplit(s) {
  const pts = (s.puntos || []).map(p => `<li>${p}</li>`).join("");
  return sec(s.alt ? "section-alt" : "", `<div class="split ${s.imagenIzq ? "rev" : ""} reveal">
    <div class="split-media"><img src="${s.imagen}" alt="${s.titulo}" loading="lazy"></div>
    <div><span class="eyebrow">${s.etiqueta || ""}</span><h2>${s.titulo}</h2><p class="d">${s.texto || ""}</p><ul>${pts}</ul></div></div>`);
}

function renderSteps(s) {
  const items = s.items.map((i, x) => `<div class="step reveal"><div class="num">0${x + 1}</div><h3>${i.titulo}</h3><p>${i.texto}</p></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="steps" style="--cols:${s.columnas || Math.min(s.items.length, 4)}">${items}</div>`);
}

function renderStats(s) {
  const items = s.items.map(i => `<div class="stat reveal"><div class="n">${i.numero}</div><div class="t">${i.texto}</div></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `<div class="stats" style="--cols:${s.items.length}">${items}</div>`);
}

function renderGallery(s) {
  const imgs = s.imagenes.map((src, i) => `<figure class="reveal"><img src="${src}" alt="Imagen ${i + 1}" loading="lazy">${s.numerar ? `<figcaption>0${i + 1}</figcaption>` : ""}</figure>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="gal">${imgs}</div>`);
}

function renderPortfolio(s) {
  const cats = ["Todos", ...new Set(s.items.map(i => i.tag).filter(Boolean))];
  const filtros = s.items.some(i => i.tag) ? `<div class="pf-filtros">${cats.map((c, i) => `<button class="${i === 0 ? "active" : ""}" data-f="${c}">${c}</button>`).join("")}</div>` : "";
  const items = s.items.map(i => `<a class="pf-item reveal" data-cat="${i.tag || ""}" ${i.link ? `href="${i.link}" target="_blank" rel="noopener"` : ""}><img src="${i.imagen}" alt="${i.titulo}" loading="lazy"><div class="ov"><small>${i.tag || ""}</small><h3>${i.titulo}</h3></div></a>`).join("");
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}${filtros}<div class="pf-grid">${items}</div>`);
  n.querySelectorAll(".pf-filtros button").forEach(b => b.addEventListener("click", () => {
    n.querySelectorAll(".pf-filtros button").forEach(x => x.classList.remove("active")); b.classList.add("active");
    const f = b.dataset.f;
    n.querySelectorAll(".pf-item").forEach(it => it.style.display = (f === "Todos" || it.dataset.cat === f) ? "" : "none");
  }));
  return n;
}

function renderPricing(s, cfg) {
  const planes = s.planes.map(p => `<div class="plan ${p.destacado ? "top" : ""} reveal">${p.destacado ? `<span class="tag">${p.destacado}</span>` : ""}
    <h3>${p.nombre}</h3><div class="price">${p.precio}<span>${p.periodo ? "/" + p.periodo : ""}</span></div>
    <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
    <a href="${wa(cfg.marca, "Hola! Me interesa el plan " + p.nombre)}" target="_blank" rel="noopener" class="btn ${p.destacado ? "btn-primary" : "btn-ghost"}">${p.cta || "Elegir"}</a></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="pricing" style="--cols:${s.planes.length}">${planes}</div>`);
}

function renderProducts(s, cfg) {
  const prods = s.items.map((p, i) => `<div class="prod reveal"><div class="ph">${p.tag ? `<span class="badge">${p.tag}</span>` : ""}<img src="${p.img}" alt="${p.nombre}" loading="lazy"></div>
    <div class="info"><h3>${p.nombre}</h3><div class="p">${money(p.precio)}</div><button class="btn btn-primary" data-add="${i}">Agregar</button></div></div>`).join("");
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}<div class="prod-grid" style="--cols:${s.columnas || 4}">${prods}</div>`);
  n.querySelectorAll("[data-add]").forEach(b => b.addEventListener("click", () => addToCart(s.items[+b.dataset.add], cfg.marca)));
  return n;
}

function renderBlog(s) {
  const posts = s.posts.map((p, i) => `<article class="post reveal" data-i="${i}"><div class="ph"><img src="${p.img}" alt="${p.titulo}" loading="lazy"></div>
    <div class="info"><span class="cat">${p.categoria}</span><h3>${p.titulo}</h3><p>${p.resumen}</p><div class="meta">${p.fecha || ""}</div></div></article>`).join("");
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}<div class="blog-grid">${posts}</div>`);
  n.querySelectorAll(".post").forEach(a => a.addEventListener("click", () => openPost(s.posts[+a.dataset.i])));
  return n;
}

function renderPanel(s) {
  const kpis = (s.kpis || []).map(k => `<div class="panel-kpi"><div class="n">${k.n}</div><div class="t">${k.t}</div></div>`).join("");
  const bars = [45, 70, 55, 85, 60, 95, 75].map(h => `<span style="height:${h}%"></span>`).join("");
  return sec(s.alt ? "section-alt" : "", `<div class="split reveal">
    <div><span class="eyebrow">${s.etiqueta || ""}</span><h2>${s.titulo}</h2><p class="d">${s.texto || ""}</p><ul>${(s.puntos || []).map(p => `<li>${p}</li>`).join("")}</ul></div>
    <div class="panel-wrap"><div class="panel-bar"><i></i><i></i><i></i></div><div class="panel-grid">${kpis}</div><div class="panel-chart">${bars}</div></div></div>`);
}

function renderLogos(s) {
  return sec(s.alt ? "section-alt" : "", `${s.titulo ? `<p style="text-align:center;color:var(--texto-suave);margin-bottom:26px;font-weight:600">${s.titulo}</p>` : ""}<div class="logos reveal">${s.marcas.map(m => `<span>${m}</span>`).join("")}</div>`);
}

function renderTst(s) {
  const items = s.items.map(i => `<div class="card reveal"><div class="stars">${stars(5)}</div><p>“${i.texto}”</p>
    <div class="who"><img src="${i.avatar}" alt="${i.nombre}" loading="lazy"><div><b>${i.nombre}</b><small>${i.rol}</small></div></div></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="tst">${items}</div>`);
}

function renderFaq(s) {
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}<div class="faq-list"></div>`);
  const list = $(".faq-list", n);
  s.items.forEach(i => {
    const item = el(`<div class="faq-item reveal"><button class="faq-q">${i.q}<span class="chev">+</span></button><div class="faq-a"><p>${i.a}</p></div></div>`);
    $(".faq-q", item).addEventListener("click", () => {
      const open = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach(x => { x.classList.remove("open"); $(".faq-a", x).style.maxHeight = null; });
      if (!open) { item.classList.add("open"); const a = $(".faq-a", item); a.style.maxHeight = a.scrollHeight + "px"; }
    });
    list.append(item);
  });
  return n;
}

function renderCta(s, cfg) {
  const link = s.wa ? wa(cfg.marca, s.wa) : (s.destino ? `#${s.destino}` : "#");
  return el(`<section class="cierre" id="contacto"><div class="container reveal"><h2>${s.titulo}</h2><p>${s.texto || ""}</p>
    <a href="${link}" ${s.wa ? 'target="_blank" rel="noopener"' : ""} class="btn btn-primary">${s.boton || "Contactar"}</a></div></section>`);
}

/* ---------- Carrito ---------- */
function buildCartDrawer(marca) {
  document.body.append(el(`<div class="backdrop" id="backdrop"></div>`));
  document.body.append(el(`<aside class="drawer" id="drawer">
    <header><h3>Tu carrito</h3><button class="x" id="cartX">×</button></header>
    <div class="items" id="cartItems"></div>
    <div class="foot"><div class="tot"><span>Total</span><span id="cartTot">${money(0)}</span></div>
    <a class="btn btn-primary" id="cartCheckout" target="_blank" rel="noopener">Pedir por WhatsApp</a></div></aside>`));
  $("#cartX").addEventListener("click", () => toggleCart(false));
  $("#backdrop").addEventListener("click", () => toggleCart(false));
  $("#cartCheckout").dataset.wa = marca.whatsapp || "";
}
function toggleCart(open) { $("#drawer").classList.toggle("open", open); $("#backdrop").classList.toggle("on", open); }
function addToCart(prod, marca) {
  const found = CART.find(c => c.nombre === prod.nombre);
  if (found) found.qty++; else CART.push({ nombre: prod.nombre, precio: +prod.precio, img: prod.img, qty: 1 });
  drawCart(marca); toggleCart(true);
}
function drawCart(marca) {
  const cont = $("#cartItems"), count = $("#cartCount");
  let total = 0, qtyTot = 0;
  if (!CART.length) { cont.innerHTML = '<div class="empty">Tu carrito está vacío</div>'; }
  else {
    cont.innerHTML = "";
    CART.forEach((c, i) => {
      total += c.precio * c.qty; qtyTot += c.qty;
      const row = el(`<div class="ci"><img src="${c.img}" alt=""><div class="g"><b>${c.nombre}</b><small>${money(c.precio)}</small></div>
        <div class="qty"><button data-m="${i}">−</button><span>${c.qty}</span><button data-p="${i}">+</button></div></div>`);
      $("[data-m]", row).addEventListener("click", () => { c.qty--; if (c.qty <= 0) CART.splice(i, 1); drawCart(marca); });
      $("[data-p]", row).addEventListener("click", () => { c.qty++; drawCart(marca); });
      cont.append(row);
    });
  }
  $("#cartTot").textContent = money(total);
  count.textContent = qtyTot; count.style.display = qtyTot ? "grid" : "none";
  const msg = "Hola! Quiero pedir:\n" + CART.map(c => `• ${c.qty}x ${c.nombre} (${money(c.precio * c.qty)})`).join("\n") + `\n\nTotal: ${money(total)}`;
  $("#cartCheckout").href = `https://wa.me/${(marca.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
}

/* ---------- Blog modal ---------- */
function openPost(p) {
  let modal = $("#postModal");
  if (!modal) { modal = el(`<div class="modal" id="postModal"><div class="box"></div></div>`); document.body.append(modal); modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); }); }
  $(".box", modal).innerHTML = `<img src="${p.img}" alt="${p.titulo}"><div class="c"><button class="x" onclick="document.getElementById('postModal').classList.remove('open')">×</button><span class="cat" style="color:var(--acento);font-weight:700">${p.categoria}</span><h2>${p.titulo}</h2><p>${p.contenido || p.resumen}</p><p style="color:var(--texto-suave);font-size:13px">${p.fecha || ""}</p></div>`;
  modal.classList.add("open");
}

function buildFooter(m) {
  $("#footer").innerHTML = `<div class="container footer-inner">
    <a href="#top" class="brand">${m.nombre}<span class="dot">.</span></a>
    <small>© 2026 ${m.nombre}. ${m.eslogan || ""}</small>
    <span class="made">Demo por <a href="https://zyvexweby.com" target="_blank" rel="noopener">ZyvexWeb</a></span></div>`;
}
function setupReveal() {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll(".reveal").forEach(n => io.observe(n));
}
document.addEventListener("DOMContentLoaded", boot);
