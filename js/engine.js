/* ============================================================
   ZyvexWeb — Motor de demos. Lee js/config.js (window.DEMO) y
   arma la web por secciones. NO se edita: se edita config.js.
   Tipos: hero, cards, split, steps, stats, gallery, portfolio,
   pricing, products, blog, panel, logos, testimonios, faq, form, cta.
   ============================================================ */
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const el = (h) => { const t = document.createElement("template"); t.innerHTML = h.trim(); return t.content.firstElementChild; };
const stars = (n = 5) => "★".repeat(n);
const money = (n) => (window.DEMO.marca.moneda || "S/") + " " + n;
const waLink = (m, msg) => `https://wa.me/${(m.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
let CART = [];

const ICONS = {
  facebook: '<path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.7-1.6 1.5V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z"/>',
  instagram: '<path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>',
  tiktok: '<path d="M16 3c.6 2.3 2.2 4 4.5 4.6V11c-1.8-.1-3.5-.7-4.9-1.7v5.6A5.9 5.9 0 1 1 10 9.1v3a2.9 2.9 0 1 0 2 2.7V3h4z"/>',
  x: '<path d="M3 3h3.5l5 6.7L16.5 3H21l-7.5 9.7L21 21h-3.5l-5-6.7L7.5 21H3l7.5-8.3L3 3z"/>'
};

function boot() {
  const cfg = window.DEMO;
  if (!cfg) { document.body.innerHTML = '<p style="padding:40px;font-family:sans-serif">Falta js/config.js</p>'; return; }
  applyColors(cfg.marca.colores);
  document.title = `${cfg.marca.nombre} · ${cfg.marca.eslogan || ""}`.trim();
  loadCart(cfg.marca);
  buildNav(cfg);
  const main = $("#app");
  (cfg.secciones || []).forEach((s, i) => {
    const node = render(s, cfg);
    if (node) { node.id = s.id || ("s" + i); main.append(node); }
  });
  buildFooter(cfg.marca);
  $("#waFloat").href = waLink(cfg.marca, "Hola! Vi la web y quiero más información 😊");
  if ($("#cartBtn")) drawCart(cfg.marca);
  setupReveal();
}

function applyColors(c) {
  if (!c) return;
  const m = { primario: "--primario", secundario: "--secundario", acento: "--acento", fondo: "--fondo", superficie: "--superficie", texto: "--texto", textoSuave: "--texto-suave" };
  Object.entries(m).forEach(([k, v]) => { if (c[k]) document.documentElement.style.setProperty(v, c[k]); });
}

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
    case "form": return renderForm(s, cfg);
    case "cta": return renderCta(s, cfg);
    default: return null;
  }
}

function renderHero(h, cfg) {
  const notas = (h.notas || []).map(n => `<span>${n}</span>`).join("");
  const p1 = h.ctaPrimario || {}, p2 = h.ctaSecundario || {};
  const l1 = p1.destino ? `#${p1.destino}` : (p1.wa ? waLink(cfg.marca, p1.wa) : "#");
  let visual;
  if (h.slider && h.slider.length) {
    visual = `<div class="hero-visual reveal"><div class="hero-slider">${h.slider.map((s, i) => `<img class="${i === 0 ? "active" : ""}" src="${s}" alt="${cfg.marca.nombre}" loading="${i === 0 ? "eager" : "lazy"}">`).join("")}</div>${h.tarjeta ? `<div class="float-card"><div class="stars">${stars(5)}</div><div><b>${h.tarjeta.titulo}</b><br><small>${h.tarjeta.texto}</small></div></div>` : ""}</div>`;
  } else {
    visual = `<div class="hero-visual reveal"><img src="${h.imagen}" alt="${cfg.marca.nombre}" loading="eager">${h.tarjeta ? `<div class="float-card"><div class="stars">${stars(5)}</div><div><b>${h.tarjeta.titulo}</b><br><small>${h.tarjeta.texto}</small></div></div>` : ""}</div>`;
  }
  const node = el(`<section class="hero" id="top"><div class="container hero-grid">
    <div class="hero-copy reveal">
      <span class="hero-badge">${h.etiqueta || ""}</span>
      <h1>${h.titulo} <span class="grad">${h.resaltado || ""}</span></h1>
      <p class="lead">${h.subtitulo || ""}</p>
      <div class="hero-cta">
        <a href="${l1}" ${p1.wa ? 'target="_blank" rel="noopener"' : ""} class="btn btn-primary">${p1.texto || "Empezar"}</a>
        ${p2.texto ? `<a href="#${p2.destino || 'contacto'}" class="btn btn-ghost">${p2.texto}</a>` : ""}
      </div>
      ${notas ? `<div class="hero-notas">${notas}</div>` : ""}
    </div>${visual}</div></section>`);
  if (h.slider && h.slider.length > 1) {
    const imgs = $$(".hero-slider img", node); let idx = 0;
    setInterval(() => { imgs[idx].classList.remove("active"); idx = (idx + 1) % imgs.length; imgs[idx].classList.add("active"); }, 3500);
  }
  return node;
}

function renderCards(s) {
  const cards = s.items.map(i => `<div class="card reveal"><div class="ico">${i.icono || "✦"}</div><h3>${i.titulo}</h3><p>${i.texto}</p></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="grid-cards" style="--cols:${s.columnas || Math.min(s.items.length, 4)}">${cards}</div>`);
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
  $$(".pf-filtros button", n).forEach(b => b.addEventListener("click", () => {
    $$(".pf-filtros button", n).forEach(x => x.classList.remove("active")); b.classList.add("active");
    const f = b.dataset.f;
    $$(".pf-item", n).forEach(it => it.style.display = (f === "Todos" || it.dataset.cat === f) ? "" : "none");
  }));
  return n;
}

function renderPricing(s, cfg) {
  const planes = s.planes.map(p => `<div class="plan ${p.destacado ? "top" : ""} reveal">${p.destacado ? `<span class="tag">${p.destacado}</span>` : ""}
    <h3>${p.nombre}</h3><div class="price">${p.precio}<span>${p.periodo ? "/" + p.periodo : ""}</span></div>
    <ul>${p.features.map(f => `<li>${f}</li>`).join("")}</ul>
    <a href="${waLink(cfg.marca, "Hola! Me interesa el plan " + p.nombre)}" target="_blank" rel="noopener" class="btn ${p.destacado ? "btn-primary" : "btn-ghost"}">${p.cta || "Elegir"}</a></div>`).join("");
  return sec(s.alt ? "section-alt" : "", `${head(s)}<div class="pricing" style="--cols:${s.planes.length}">${planes}</div>`);
}

function renderProducts(s, cfg) {
  const cats = ["Todos", ...new Set(s.items.map(p => p.cat).filter(Boolean))];
  const toolbar = (s.buscador || (s.categorias && cats.length > 1)) ? `<div class="shop-tools reveal">
      ${s.buscador ? `<input type="search" class="shop-search" placeholder="Buscar producto..." aria-label="Buscar">` : ""}
      ${s.categorias && cats.length > 1 ? `<div class="shop-cats">${cats.map((c, i) => `<button class="${i === 0 ? "active" : ""}" data-c="${c}">${c}</button>`).join("")}</div>` : ""}
    </div>` : "";
  const prods = s.items.map((p, i) => `<div class="prod reveal" data-cat="${p.cat || ""}" data-name="${(p.nombre || "").toLowerCase()}"><div class="ph">${p.tag ? `<span class="badge">${p.tag}</span>` : ""}<img src="${p.img}" alt="${p.nombre}" loading="lazy"></div>
    <div class="info">${p.cat ? `<span class="prod-cat">${p.cat}</span>` : ""}<h3>${p.nombre}</h3><div class="p">${money(p.precio)}</div><button class="btn btn-primary" data-add="${i}">Agregar</button></div></div>`).join("");
  const pagos = s.pagos ? `<div class="pay-row reveal"><span>Pagos:</span>${s.pagos.map(m => `<b>${m}</b>`).join("")}</div>` : "";
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}${toolbar}<div class="prod-grid" style="--cols:${s.columnas || 4}">${prods}</div>${pagos}<p class="shop-empty" style="display:none;text-align:center;color:var(--texto-suave);margin-top:20px">No encontramos productos.</p>`);
  $$("[data-add]", n).forEach(b => b.addEventListener("click", () => addToCart(s.items[+b.dataset.add], cfg.marca)));
  // filtros combinados (buscador + categoría)
  let term = "", cat = "Todos";
  const apply = () => {
    let visibles = 0;
    $$(".prod", n).forEach(card => {
      const okCat = cat === "Todos" || card.dataset.cat === cat;
      const okTerm = !term || card.dataset.name.includes(term);
      const show = okCat && okTerm; card.style.display = show ? "" : "none"; if (show) visibles++;
    });
    const empty = $(".shop-empty", n); if (empty) empty.style.display = visibles ? "none" : "block";
  };
  const search = $(".shop-search", n);
  if (search) search.addEventListener("input", () => { term = search.value.trim().toLowerCase(); apply(); });
  $$(".shop-cats button", n).forEach(b => b.addEventListener("click", () => {
    $$(".shop-cats button", n).forEach(x => x.classList.remove("active")); b.classList.add("active"); cat = b.dataset.c; apply();
  }));
  return n;
}

function renderBlog(s) {
  const per = s.porPagina || s.posts.length;
  const n = sec(s.alt ? "section-alt" : "", `${head(s)}
    ${s.buscador ? `<div class="blog-tools reveal"><input type="search" class="blog-search" placeholder="Buscar artículo..." aria-label="Buscar"></div>` : ""}
    <div class="blog-grid"></div>
    <p class="blog-empty" style="display:none;text-align:center;color:var(--texto-suave)">No hay artículos que coincidan.</p>
    <div class="blog-pager"></div>`);
  const grid = $(".blog-grid", n), pager = $(".blog-pager", n);
  let term = "", page = 1;
  const draw = () => {
    const filtered = s.posts.filter(p => !term || (p.titulo + " " + p.categoria + " " + (p.resumen || "")).toLowerCase().includes(term));
    const pages = Math.max(1, Math.ceil(filtered.length / per));
    if (page > pages) page = pages;
    const slice = filtered.slice((page - 1) * per, page * per);
    grid.innerHTML = slice.map((p) => `<article class="post reveal" data-t="${encodeURIComponent(p.titulo)}"><div class="ph"><img src="${p.img}" alt="${p.titulo}" loading="lazy"></div>
      <div class="info"><span class="cat">${p.categoria}</span><h3>${p.titulo}</h3><p>${p.resumen}</p><div class="meta">${p.fecha || ""}</div></div></article>`).join("");
    $(".blog-empty", n).style.display = filtered.length ? "none" : "block";
    $$(".post", grid).forEach(a => a.addEventListener("click", () => openPost(s.posts.find(p => encodeURIComponent(p.titulo) === a.dataset.t))));
    pager.innerHTML = pages > 1 ? Array.from({ length: pages }, (_, i) => `<button class="${i + 1 === page ? "active" : ""}" data-p="${i + 1}">${i + 1}</button>`).join("") : "";
    $$("button", pager).forEach(b => b.addEventListener("click", () => { page = +b.dataset.p; draw(); window.scrollTo({ top: n.offsetTop - 60, behavior: "smooth" }); }));
    $$(".reveal", grid).forEach(x => x.classList.add("in"));
  };
  const search = $(".blog-search", n);
  if (search) search.addEventListener("input", () => { term = search.value.trim().toLowerCase(); page = 1; draw(); });
  draw();
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
      $$(".faq-item", list).forEach(x => { x.classList.remove("open"); $(".faq-a", x).style.maxHeight = null; });
      if (!open) { item.classList.add("open"); const a = $(".faq-a", item); a.style.maxHeight = a.scrollHeight + "px"; }
    });
    list.append(item);
  });
  return n;
}

function renderForm(s, cfg) {
  const m = cfg.marca;
  const info = `<div class="form-info">
      <h3>${s.infoTitulo || "Hablemos"}</h3>
      <p>${s.infoTexto || "Déjanos tus datos y te respondemos lo antes posible."}</p>
      <ul class="form-contact">
        ${m.email ? `<li>✉️ ${m.email}</li>` : ""}
        ${m.whatsapp ? `<li>📱 +${m.whatsapp.replace(/\D/g, "")}</li>` : ""}
        ${s.direccion ? `<li>📍 ${s.direccion}</li>` : ""}
      </ul>
      ${socialHTML(m.redes, "form-social")}
      ${s.mapa ? `<div class="form-map"><iframe title="Mapa" src="https://www.google.com/maps?q=${encodeURIComponent(s.mapa)}&output=embed" loading="lazy"></iframe></div>` : ""}
    </div>`;
  const form = `<form class="form-box" novalidate>
      <div class="frow"><input required name="nombre" placeholder="Tu nombre"><input required type="email" name="email" placeholder="Tu correo"></div>
      <input name="asunto" placeholder="Asunto (opcional)">
      <textarea required name="mensaje" rows="4" placeholder="Cuéntanos qué necesitas..."></textarea>
      <button type="submit" class="btn btn-primary">${s.boton || "Enviar mensaje"}</button>
      <p class="form-ok" style="display:none">✅ ¡Gracias! Tu mensaje se preparó. Te contactaremos pronto.</p>
    </form>`;
  const n = el(`<section class="section ${s.alt ? "section-alt" : ""}" id="${s.id || "contacto"}"><div class="container">${head(s)}<div class="form-grid reveal">${info}${form}</div></div></section>`);
  const f = $("form", n);
  f.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const d = new FormData(f);
    const msg = `Hola ${m.nombre}! Soy ${d.get("nombre")} (${d.get("email")}).${d.get("asunto") ? " Asunto: " + d.get("asunto") + "." : ""}\n${d.get("mensaje")}`;
    window.open(waLink(m, msg), "_blank");
    $(".form-ok", n).style.display = "block";
    f.reset();
  });
  return n;
}

function renderCta(s, cfg) {
  const link = s.wa ? waLink(cfg.marca, s.wa) : (s.destino ? `#${s.destino}` : "#");
  return el(`<section class="cierre" id="${s.id || 'cierre'}"><div class="container reveal"><h2>${s.titulo}</h2><p>${s.texto || ""}</p>
    <a href="${link}" ${s.wa ? 'target="_blank" rel="noopener"' : ""} class="btn btn-primary">${s.boton || "Contactar"}</a></div></section>`);
}

/* ---------- Redes sociales ---------- */
function socialHTML(redes, cls) {
  if (!redes) return "";
  const items = Object.entries(redes).filter(([k, v]) => v && ICONS[k])
    .map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener" aria-label="${k}"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">${ICONS[k]}</svg></a>`).join("");
  return items ? `<div class="${cls || "socials"}">${items}</div>` : "";
}

/* ---------- Carrito ---------- */
function cartKey() { return "zx_cart_" + (window.DEMO.marca.nombre || "demo"); }
function loadCart(marca) { try { CART = JSON.parse(localStorage.getItem(cartKey())) || []; } catch (e) { CART = []; } }
function saveCart() { try { localStorage.setItem(cartKey(), JSON.stringify(CART)); } catch (e) {} }
function buildCartDrawer(marca) {
  document.body.append(el(`<div class="backdrop" id="backdrop"></div>`));
  document.body.append(el(`<aside class="drawer" id="drawer">
    <header><h3>Tu carrito</h3><button class="x" id="cartX">×</button></header>
    <div class="items" id="cartItems"></div>
    <div class="foot"><div class="tot"><span>Total</span><span id="cartTot">${money(0)}</span></div>
    <a class="btn btn-primary" id="cartCheckout" target="_blank" rel="noopener">Pedir por WhatsApp</a></div></aside>`));
  $("#cartX").addEventListener("click", () => toggleCart(false));
  $("#backdrop").addEventListener("click", () => toggleCart(false));
}
function toggleCart(open) { $("#drawer").classList.toggle("open", open); $("#backdrop").classList.toggle("on", open); }
function addToCart(prod, marca) {
  const found = CART.find(c => c.nombre === prod.nombre);
  if (found) found.qty++; else CART.push({ nombre: prod.nombre, precio: +prod.precio, img: prod.img, qty: 1 });
  saveCart(); drawCart(marca); toggleCart(true);
}
function drawCart(marca) {
  const cont = $("#cartItems"), count = $("#cartCount");
  if (!cont) return;
  let total = 0, qtyTot = 0;
  if (!CART.length) { cont.innerHTML = '<div class="empty">Tu carrito está vacío</div>'; }
  else {
    cont.innerHTML = "";
    CART.forEach((c, i) => {
      total += c.precio * c.qty; qtyTot += c.qty;
      const row = el(`<div class="ci"><img src="${c.img}" alt=""><div class="g"><b>${c.nombre}</b><small>${money(c.precio)}</small></div>
        <div class="qty"><button data-m="${i}">−</button><span>${c.qty}</span><button data-p="${i}">+</button></div></div>`);
      $("[data-m]", row).addEventListener("click", () => { c.qty--; if (c.qty <= 0) CART.splice(i, 1); saveCart(); drawCart(marca); });
      $("[data-p]", row).addEventListener("click", () => { c.qty++; saveCart(); drawCart(marca); });
      cont.append(row);
    });
  }
  $("#cartTot").textContent = money(total);
  if (count) { count.textContent = qtyTot; count.style.display = qtyTot ? "grid" : "none"; }
  const msg = "Hola! Quiero pedir:\n" + CART.map(c => `• ${c.qty}x ${c.nombre} (${money(c.precio * c.qty)})`).join("\n") + `\n\nTotal: ${money(total)}`;
  const co = $("#cartCheckout"); if (co) co.href = waLink(marca, msg);
}

/* ---------- Blog modal ---------- */
function openPost(p) {
  if (!p) return;
  let modal = $("#postModal");
  if (!modal) { modal = el(`<div class="modal" id="postModal"><div class="box"></div></div>`); document.body.append(modal); modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("open"); }); }
  $(".box", modal).innerHTML = `<img src="${p.img}" alt="${p.titulo}"><div class="c"><button class="x" onclick="document.getElementById('postModal').classList.remove('open')">×</button><span class="cat" style="color:var(--acento);font-weight:700">${p.categoria}</span><h2>${p.titulo}</h2><p>${p.contenido || p.resumen}</p><p style="color:var(--texto-suave);font-size:13px">${p.fecha || ""}</p></div>`;
  modal.classList.add("open");
}

function buildFooter(m) {
  $("#footer").innerHTML = `<div class="container footer-inner">
    <a href="#top" class="brand">${m.nombre}<span class="dot">.</span></a>
    ${socialHTML(m.redes, "footer-social")}
    <small>© 2026 ${m.nombre}. ${m.eslogan || ""}</small>
    <span class="made">Demo por <a href="https://zyvexweby.com" target="_blank" rel="noopener">ZyvexWeb</a></span></div>`;
}
function setupReveal() {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
  $$(".reveal").forEach(n => io.observe(n));
}
document.addEventListener("DOMContentLoaded", boot);
