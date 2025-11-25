(function () {
  const STORAGE_KEY = 'quantumcommerce_cart_v1';

  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartPanel = document.getElementById('cartPanel');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartSubtotalEl = document.getElementById('cartSubtotal');
  const cartShippingEl = document.getElementById('cartShipping');
  const cartTotalEl = document.getElementById('cartTotal');
  const cartCountEl = document.getElementById('cartCount');
  const goCheckout = document.getElementById('goCheckout');
  const cartWhatsapp = document.getElementById('cartWhatsapp');

  const productGrid = document.getElementById('productGrid');
  const categoryFilter = document.getElementById('categoryFilter');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');
  const activeDeals = document.getElementById('activeDeals');
  const offersGrid = document.getElementById('offersGrid');

  const checkoutForm = document.getElementById('checkoutForm');
  const shippingDistrict = document.getElementById('shippingDistrict');
  const orderSummary = document.getElementById('orderSummary');
  const summaryTotal = document.getElementById('summaryTotal');
  const checkoutMessage = document.getElementById('checkoutMessage');

  const subscribeButton = document.getElementById('subscribeButton');
  const newsletterDialog = document.getElementById('newsletterDialog');
  const dialogClose = document.getElementById('dialogClose');
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterMessage = document.getElementById('newsletterMessage');

  if (typeof PRODUCTS === 'undefined') {
    console.error('No se encontraron productos. Revisa assets/products.js');
    return;
  }

  const SHIPPING_RATES = [
    { district: 'Miraflores', price: 15.9 },
    { district: 'San Isidro', price: 14.5 },
    { district: 'Barranco', price: 16.0 },
    { district: 'Pueblo Libre', price: 13.5 },
    { district: 'La Molina', price: 18.4 },
    { district: 'Surco', price: 17.2 }
  ];

  const state = {
    filters: {
      category: 'all',
      search: '',
      sort: 'default'
    },
    cart: [],
    init() {
      this.cart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      populateCategories();
      populateShipping();
      renderDeals();
      renderOffers();
      renderProducts();
      this.renderCart();
    },
    saveCart() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cart));
    },
    addToCart(productId, quantity) {
      const product = PRODUCTS.find((item) => item.id === productId);
      if (!product) return;

      const existing = this.cart.find((item) => item.id === productId);
      const qty = Math.min(quantity, product.stock);

      if (existing) {
        existing.quantity = Math.min(existing.quantity + qty, product.stock);
      } else {
        this.cart.push({
          id: product.id,
          name: product.name,
          price: product.promoPrice || product.price,
          image: product.image,
          stock: product.stock,
          quantity: qty
        });
      }

      this.saveCart();
      this.renderCart();
      toggleCart(true);
    },
    updateQuantity(productId, delta) {
      this.cart = this.cart
        .map((item) => {
          if (item.id === productId) {
            const nextQty = Math.min(Math.max(item.quantity + delta, 1), item.stock);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
      this.saveCart();
      this.renderCart();
    },
    removeItem(productId) {
      this.cart = this.cart.filter((item) => item.id !== productId);
      this.saveCart();
      this.renderCart();
    },
    getTotals(shipping = 0) {
      const subtotal = this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return {
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        total: (subtotal + shipping).toFixed(2),
        count: this.cart.reduce((acc, item) => acc + item.quantity, 0)
      };
    },
    renderCart() {
      if (!cartItemsContainer) return;

      cartItemsContainer.innerHTML = '';
      if (!this.cart.length) {
        cartItemsContainer.innerHTML = '<p class="empty-state">Tu carrito está vacío. Agrega productos para continuar.</p>';
      } else {
        this.cart.forEach((item) => {
          const row = document.createElement('article');
          row.className = 'cart-item';
          row.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
              <h4>${item.name}</h4>
              <p class="meta">S/ ${item.price.toFixed(2)} &middot; Stock: ${item.stock}</p>
              <div class="cart-item-controls">
                <div class="qty-controls" data-id="${item.id}">
                  <button type="button" class="qty-minus" aria-label="Reducir">-</button>
                  <span class="qty-value">${item.quantity}</span>
                  <button type="button" class="qty-plus" aria-label="Aumentar">+</button>
                </div>
                <button type="button" class="cart-item-remove" data-id="${item.id}">Eliminar</button>
              </div>
            </div>
          `;
          cartItemsContainer.appendChild(row);
        });
      }

      const totals = this.getTotals();
      if (cartSubtotalEl) cartSubtotalEl.textContent = totals.subtotal;
      if (cartShippingEl) cartShippingEl.textContent = totals.shipping;
      if (cartTotalEl) cartTotalEl.textContent = totals.total;
      if (cartCountEl) cartCountEl.textContent = totals.count;
      updateCheckoutSummary();
    }
  };

  function populateCategories() {
    if (!categoryFilter) return;
    categoryFilter.innerHTML = '';

    const buttonAll = document.createElement('button');
    buttonAll.textContent = 'Todos';
    buttonAll.className = 'active';
    buttonAll.dataset.category = 'all';
    categoryFilter.appendChild(buttonAll);

    const categories = [...new Set(PRODUCTS.map((product) => product.category))];
    categories.forEach((category) => {
      const button = document.createElement('button');
      button.textContent = category;
      button.dataset.category = category;
      categoryFilter.appendChild(button);
    });
  }

  function renderDeals() {
    if (!activeDeals || typeof ACTIVE_DEALS === 'undefined') return;
    activeDeals.innerHTML = '';
    ACTIVE_DEALS.forEach((deal) => {
      const pill = document.createElement('div');
      pill.className = 'deal-pill';
      pill.textContent = `${deal.label} · ${deal.discountLabel}`;
      activeDeals.appendChild(pill);
    });
  }

  function renderOffers() {
    if (!offersGrid || typeof ACTIVE_DEALS === 'undefined') return;
    offersGrid.innerHTML = '';
    ACTIVE_DEALS.forEach((deal) => {
      const card = document.createElement('article');
      card.className = 'offer-card';
      card.innerHTML = `
        <strong>${deal.label}</strong>
        <span>${deal.description}</span>
        <small>${deal.discountLabel}</small>
        <button class="btn btn-outline" data-offer="${deal.id}">Aplicar oferta</button>
      `;
      offersGrid.appendChild(card);
    });
  }

  function populateShipping() {
    if (!shippingDistrict) return;
    shippingDistrict.innerHTML = '<option value="">Selecciona un distrito</option>';
    SHIPPING_RATES.forEach((rate) => {
      const option = document.createElement('option');
      option.value = rate.district;
      option.textContent = `${rate.district} - S/ ${rate.price.toFixed(2)}`;
      shippingDistrict.appendChild(option);
    });
  }

  function applyFilters() {
    let filtered = [...PRODUCTS];
    const { category, search, sort } = state.filters;

    if (category !== 'all') {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter((product) => {
        const haystack = `${product.name} ${product.description} ${product.brand} ${product.tags.join(' ')} ${product.sku}`.toLowerCase();
        return haystack.includes(query);
      });
    }

    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => (a.promoPrice || a.price) - (b.promoPrice || b.price));
        break;
      case 'price-desc':
        filtered.sort((a, b) => (b.promoPrice || b.price) - (a.promoPrice || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }

  function renderProducts() {
    if (!productGrid) return;
    const list = applyFilters();
    productGrid.innerHTML = '';

    if (!list.length) {
      productGrid.innerHTML = '<p class="empty-state">No se encontraron productos con los filtros actuales.</p>';
      return;
    }

    list.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'product-card';
      const price = product.promoPrice || product.price;

      card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-card__body">
          <div class="product-meta">
            <span>${product.brand}</span>
            <span class="product-rating"><i class="fas fa-star"></i> ${product.rating.toFixed(1)}</span>
          </div>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-price">S/ ${price.toFixed(2)} ${product.promoPrice ? `<del>S/ ${product.price.toFixed(2)}</del>` : ''}</div>
          <div class="tag-list">${product.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
          <div class="product-actions">
            <div class="qty-controls" data-id="${product.id}">
              <button type="button" class="qty-minus" aria-label="Reducir">-</button>
              <span class="qty-value">1</span>
              <button type="button" class="qty-plus" aria-label="Aumentar">+</button>
            </div>
            <button type="button" class="add-cart" data-id="${product.id}">Agregar</button>
          </div>
        </div>
      `;
      productGrid.appendChild(card);
    });
  }

  function toggleCart(forceOpen) {
    if (!cartPanel || !cartBackdrop) return;
    const isOpen = typeof forceOpen === 'boolean' ? forceOpen : !cartPanel.classList.contains('open');
    cartPanel.classList.toggle('open', isOpen);
    cartBackdrop.classList.toggle('show', isOpen);
    cartPanel.setAttribute('aria-hidden', (!isOpen).toString());
    cartBackdrop.setAttribute('aria-hidden', (!isOpen).toString());
  }

  function updateCheckoutSummary() {
    if (!orderSummary || !summaryTotal) return;

    orderSummary.innerHTML = '';
    if (!state.cart.length) {
      orderSummary.innerHTML = '<p class="empty-state">No hay productos en el carrito.</p>';
      summaryTotal.textContent = '0.00';
      return;
    }

    state.cart.forEach((item) => {
      const row = document.createElement('div');
      row.innerHTML = `<strong>${item.name}</strong> <span>S/ ${(item.price * item.quantity).toFixed(2)} · x${item.quantity}</span>`;
      orderSummary.appendChild(row);
    });

    const shippingValue = getShippingValue();
    const totals = state.getTotals(shippingValue);
    summaryTotal.textContent = totals.total;
  }

  function getShippingValue() {
    if (!shippingDistrict || !shippingDistrict.value) return 0;
    const rate = SHIPPING_RATES.find((item) => item.district === shippingDistrict.value);
    return rate ? rate.price : 0;
  }

  function formatWhatsappMessage() {
    if (!state.cart.length) return '';
    const lines = state.cart.map((item, index) => `${index + 1}. ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`);
    const totals = state.getTotals(getShippingValue());

    return encodeURIComponent(
      `Hola QuantumCommerce, quiero confirmar mi pedido:\n\n${lines.join('\n')}\n\nSubtotal: S/ ${totals.subtotal}\nEnvío estimado: S/ ${totals.shipping}\nTotal: S/ ${totals.total}\n\nMétodo de pago preferido: ______\nDirección completa: __________________`
    );
  }

  function bindEvents() {
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', (!expanded).toString());
        navMenu.classList.toggle('active');
      });

      navMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    if (cartToggle) cartToggle.addEventListener('click', () => toggleCart());
    if (cartClose) cartClose.addEventListener('click', () => toggleCart(false));
    if (cartBackdrop) cartBackdrop.addEventListener('click', () => toggleCart(false));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') toggleCart(false);
    });

    if (categoryFilter) {
      categoryFilter.addEventListener('click', (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        state.filters.category = button.dataset.category;
        categoryFilter.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        renderProducts();
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (event) => {
        state.filters.search = event.target.value;
        renderProducts();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', (event) => {
        state.filters.sort = event.target.value;
        renderProducts();
      });
    }

    if (productGrid) {
      productGrid.addEventListener('click', (event) => {
        const target = event.target;
        const qtyButton = target.closest('.qty-controls button');
        const addButton = target.closest('.add-cart');

        if (qtyButton) {
          const controls = qtyButton.closest('.qty-controls');
          const valueEl = controls.querySelector('.qty-value');
          let value = parseInt(valueEl.textContent, 10) || 1;
          if (qtyButton.classList.contains('qty-minus')) {
            value = Math.max(value - 1, 1);
          } else {
            value = Math.min(value + 1, 10);
          }
          valueEl.textContent = value;
        }

        if (addButton) {
          const controls = addButton.parentElement.querySelector('.qty-controls');
          const qty = parseInt(controls.querySelector('.qty-value').textContent, 10) || 1;
          state.addToCart(addButton.dataset.id, qty);
        }
      });
    }

    if (offersGrid) {
      offersGrid.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-offer]');
        if (!button) return;
        const offer = ACTIVE_DEALS.find((deal) => deal.id === button.dataset.offer);
        if (!offer) return;
        offer.products.forEach((productId) => state.addToCart(productId, 1));
      });
    }

    if (cartItemsContainer) {
      cartItemsContainer.addEventListener('click', (event) => {
        const minus = event.target.closest('.qty-minus');
        const plus = event.target.closest('.qty-plus');
        const remove = event.target.closest('.cart-item-remove');

        if (minus) {
          const id = minus.closest('.qty-controls').dataset.id;
          state.updateQuantity(id, -1);
        }
        if (plus) {
          const id = plus.closest('.qty-controls').dataset.id;
          state.updateQuantity(id, 1);
        }
        if (remove) {
          state.removeItem(remove.dataset.id);
        }
      });
    }

    if (shippingDistrict) {
      shippingDistrict.addEventListener('change', () => {
        const shippingValue = getShippingValue();
        const totals = state.getTotals(shippingValue);
        if (cartShippingEl) cartShippingEl.textContent = shippingValue.toFixed(2);
        if (cartTotalEl) cartTotalEl.textContent = totals.total;
        updateCheckoutSummary();
      });
    }

    if (goCheckout) {
      goCheckout.addEventListener('click', () => {
        toggleCart(false);
        document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (cartWhatsapp) {
      cartWhatsapp.addEventListener('click', () => {
        if (!state.cart.length) {
          alert('Agrega productos antes de compartir por WhatsApp.');
          return;
        }
        const message = formatWhatsappMessage();
        window.open(`https://wa.me/51944231780?text=${message}`, '_blank');
      });
    }

    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!state.cart.length) {
          checkoutMessage.textContent = 'Tu carrito está vacío. Agrega productos antes de procesar.';
          return;
        }
        if (!shippingDistrict.value) {
          checkoutMessage.textContent = 'Selecciona un distrito de envío.';
          shippingDistrict.focus();
          return;
        }

        checkoutMessage.textContent = 'Procesando pago demo...';
        checkoutMessage.style.color = '#475569';

        setTimeout(() => {
          checkoutMessage.textContent = 'Pago simulado completado. Revisa tu correo para el resumen (ficticio).';
          checkoutMessage.style.color = '#16a34a';
        }, 1400);
      });
    }

    if (subscribeButton && newsletterDialog) {
      subscribeButton.addEventListener('click', () => {
        newsletterDialog.classList.add('show');
        newsletterDialog.setAttribute('aria-hidden', 'false');
      });
    }

    if (dialogClose && newsletterDialog) {
      dialogClose.addEventListener('click', () => {
        newsletterDialog.classList.remove('show');
        newsletterDialog.setAttribute('aria-hidden', 'true');
      });
    }

    if (newsletterDialog) {
      newsletterDialog.addEventListener('click', (event) => {
        if (event.target === newsletterDialog) {
          newsletterDialog.classList.remove('show');
          newsletterDialog.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (newsletterForm && newsletterMessage) {
      newsletterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        newsletterMessage.textContent = 'Enviando solicitud...';
        newsletterMessage.style.color = '#475569';

        fetch('https://api.quantumcommerce.fake/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('newsletterName').value,
            email: document.getElementById('newsletterEmail').value
          })
        })
          .then(() => new Promise((resolve) => setTimeout(resolve, 1200)))
          .then(() => {
            newsletterMessage.textContent = '¡Listo! Recibirás las próximas ediciones en tu correo.';
            newsletterMessage.style.color = '#16a34a';
            newsletterForm.reset();
          })
          .catch(() => {
            newsletterMessage.textContent = 'No se pudo conectar al servicio ficticio. Intenta nuevamente.';
            newsletterMessage.style.color = '#dc2626';
          });
      });
    }
  }

  state.init();
  bindEvents();
})();
