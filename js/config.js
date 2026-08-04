/* CONTENIDO DE LA DEMO — edita solo este archivo. */
window.DEMO = {
  marca: {
    nombre: "UrbanKicks", eslogan: "Sneakers & streetwear", whatsapp: "51999777888", moneda: "S/",
    colores: { primario: "#c2f542", secundario: "#42f5c8", acento: "#f542a1", fondo: "#0b0b0d", superficie: "#16161a", texto: "#f5f6f2", textoSuave: "#adaeb5" }
  },
  secciones: [
    { tipo: "hero", etiqueta: "🔥 Nueva temporada", titulo: "Camina distinto,", resaltado: "destaca siempre",
      subtitulo: "Las mejores zapatillas y streetwear originales. Stock real, envío rápido y pagos seguros. Encuentra tu par perfecto.",
      ctaPrimario: { texto: "Comprar ahora", destino: "tienda" }, ctaSecundario: { texto: "Ver ofertas", destino: "tienda" },
      imagen: "https://picsum.photos/seed/urbankicks/900/1100", tarjeta: { titulo: "+15,000", texto: "clientes streetwear" },
      notas: ["100% originales", "Envío 24-48h", "Pago contra entrega"] },
    { tipo: "logos", titulo: "Las marcas que amas", marcas: ["Nova", "StreetLab", "Kixx", "Fresh", "MoveOn", "Prime"] },
    { tipo: "products", id: "tienda", menu: "Tienda", etiqueta: "Lo más vendido", titulo: "Encuentra tu par", columnas: 4,
      items: [
        { nombre: "Runner Neo", precio: 249, tag: "-20%", img: "https://loremflickr.com/500/500/sneakers?lock=11" },
        { nombre: "Street Air Max", precio: 329, tag: "Top", img: "https://loremflickr.com/500/500/sneaker,shoe?lock=12" },
        { nombre: "Classic Retro", precio: 199, img: "https://loremflickr.com/500/500/shoes?lock=13" },
        { nombre: "Hoodie Oversize", precio: 129, tag: "Nuevo", img: "https://loremflickr.com/500/500/hoodie?lock=14" },
        { nombre: "Court Low", precio: 219, img: "https://loremflickr.com/500/500/sneakers,white?lock=15" },
        { nombre: "Cargo Pants", precio: 149, img: "https://loremflickr.com/500/500/streetwear,pants?lock=16" },
        { nombre: "Skate Deluxe", precio: 189, tag: "Hot", img: "https://loremflickr.com/500/500/skate,shoes?lock=17" },
        { nombre: "Gorra Urban", precio: 59, img: "https://loremflickr.com/500/500/cap,streetwear?lock=18" }
      ] },
    { tipo: "stats", items: [ { numero: "+15K", texto: "Clientes" }, { numero: "24h", texto: "Envío Lima" }, { numero: "100%", texto: "Originales" }, { numero: "4.8★", texto: "Valoración" } ] },
    { tipo: "split", etiqueta: "Compra sin miedo", titulo: "Envíos rápidos y pagos seguros", alt: true,
      texto: "Recibe tu pedido en 24-48h y paga como prefieras: tarjeta, Yape, Plin o contra entrega. Cambios gratis si no te queda.",
      imagen: "https://picsum.photos/seed/ukship/800/640",
      puntos: ["Envío gratis desde S/ 199", "Pago seguro con tarjeta, Yape y Plin", "Cambios y devoluciones fáciles"] },
    { tipo: "testimonios", etiqueta: "La comunidad", titulo: "Lo que dice la banda", alt: true,
      items: [
        { nombre: "Kevin R.", rol: "Comprador", texto: "Llegaron en un día y son 100% originales. Ya soy cliente fijo.", avatar: "https://i.pravatar.cc/120?img=68" },
        { nombre: "Dayana S.", rol: "Compradora", texto: "El proceso de compra fue facilísimo y el carrito por WhatsApp genial.", avatar: "https://i.pravatar.cc/120?img=49" },
        { nombre: "Bruno T.", rol: "Sneakerhead", texto: "Buenos precios y stock real. Difícil de encontrar hoy en día.", avatar: "https://i.pravatar.cc/120?img=60" }
      ] },
    { tipo: "faq", menu: "FAQ", etiqueta: "Dudas", titulo: "Preguntas frecuentes",
      items: [
        { q: "¿Los productos son originales?", a: "Sí, 100% originales con garantía. Trabajamos solo con proveedores oficiales." },
        { q: "¿Qué métodos de pago aceptan?", a: "Tarjeta, Yape, Plin, transferencia y pago contra entrega en Lima." },
        { q: "¿Puedo cambiar la talla?", a: "Claro, tienes cambios gratis dentro de los primeros 7 días." }
      ] },
    { tipo: "cta", titulo: "Arma tu outfit hoy", texto: "Agrega al carrito y envíanos tu pedido por WhatsApp. Stock limitado.", boton: "Pedir por WhatsApp", wa: "Hola UrbanKicks! Quiero comprar 🔥" }
  ]
};
