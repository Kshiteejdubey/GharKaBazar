/**
 * GharKaBazar Web Components Runtime (WC_MODE Compliant)
 * Strictly conforms to Web Component standards:
 * - Implements connectedCallback() and disconnectedCallback()
 * - Small single-responsibility functions
 * - Component-scoped DOM traversal
 * - Zero inline CSS, zero embedded CSS, zero id attribute usage
 * - 100% Vanilla JavaScript (no jQuery)
 */

/* -------------------------------------------------------------------------
 * <gkb-quick-add> Component
 * ------------------------------------------------------------------------- */
class GkbQuickAdd extends HTMLElement {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  connectedCallback() {
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    const button = this.getSubmitButton();
    if (button) {
      button.addEventListener('click', this.handleSubmit);
    }
  }

  unbindEvents() {
    const button = this.getSubmitButton();
    if (button) {
      button.removeEventListener('click', this.handleSubmit);
    }
  }

  getSubmitButton() {
    return this.querySelector('.gkb-quick-add__button');
  }

  getVariantId() {
    const button = this.getSubmitButton();
    return button ? button.getAttribute('data-variant-id') : null;
  }

  getQuantity() {
    let input = this.querySelector('input[name="quantity"]');
    if (!input) {
      const container = this.closest('.gkb-product__qty-row, .gkb-product__info, .gkb-product__cta-group, form');
      if (container) {
        input = container.querySelector('input[name="quantity"], .gkb-product__qty-input');
      }
    }
    if (input) {
      const val = parseInt(input.value, 10);
      return !isNaN(val) && val > 0 ? val : 1;
    }
    return 1;
  }

  handleSubmit(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    const variantId = this.getVariantId();
    if (!variantId) return;

    const quantity = this.getQuantity();

    this.setLoading(true);
    this.submitAddToCart(variantId, quantity);
  }

  submitAddToCart(variantId, quantity = 1) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        id: variantId,
        quantity: quantity
      })
    })
      .then((response) => {
        if (!response.ok) throw new Error('Add to cart failed');
        return response.json();
      })
      .then((item) => {
        this.setLoading(false);
        this.dispatchCartUpdated(item);
      })
      .catch((error) => {
        this.setLoading(false);
        this.handleError(error);
      });
  }

  setLoading(isLoading) {
    const button = this.getSubmitButton();
    if (!button) return;

    if (isLoading) {
      button.setAttribute('aria-busy', 'true');
      button.disabled = true;
      const textSpan = button.querySelector('.gkb-quick-add__text');
      if (textSpan) textSpan.dataset.originalText = textSpan.textContent;
      if (textSpan) textSpan.textContent = 'Adding...';
    } else {
      button.removeAttribute('aria-busy');
      button.disabled = false;
      const textSpan = button.querySelector('.gkb-quick-add__text');
      if (textSpan && textSpan.dataset.originalText) {
        textSpan.textContent = textSpan.dataset.originalText;
      }
    }
  }

  dispatchCartUpdated(item) {
    const event = new CustomEvent('gkb:cart-updated', {
      bubbles: true,
      composed: true,
      detail: { item: item }
    });
    document.dispatchEvent(event);
  }

  handleError(error) {
    console.warn('GharKaBazar QuickAdd error:', error);
    const button = this.getSubmitButton();
    if (button) {
      const textSpan = button.querySelector('.gkb-quick-add__text');
      if (textSpan) {
        const original = textSpan.dataset.originalText || textSpan.textContent;
        textSpan.textContent = 'Retry';
        setTimeout(() => {
          textSpan.textContent = original;
        }, 2000);
      }
    }
  }
}

/* -------------------------------------------------------------------------
 * <gkb-cart-drawer> Component
 * ------------------------------------------------------------------------- */
class GkbCartDrawer extends HTMLElement {
  constructor() {
    super();
    this.handleCartUpdate = this.handleCartUpdate.bind(this);
    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleListClick = this.handleListClick.bind(this);
  }

  connectedCallback() {
    this.bindEvents();
    this.refreshCart();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    document.addEventListener('gkb:cart-updated', this.handleCartUpdate);
    document.addEventListener('click', this.handleTriggerClick);

    const closeBtn = this.querySelector('.gkb-drawer__close');
    if (closeBtn) {
      closeBtn.addEventListener('click', this.handleCloseClick);
    }

    const backdrop = this.querySelector('.gkb-drawer__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', this.handleBackdropClick);
    }

    const list = this.querySelector('.gkb-drawer__list');
    if (list) {
      list.addEventListener('click', this.handleListClick);
    }

    window.addEventListener('keydown', this.handleKeyDown);
  }

  unbindEvents() {
    document.removeEventListener('gkb:cart-updated', this.handleCartUpdate);
    document.removeEventListener('click', this.handleTriggerClick);

    const closeBtn = this.querySelector('.gkb-drawer__close');
    if (closeBtn) {
      closeBtn.removeEventListener('click', this.handleCloseClick);
    }

    const backdrop = this.querySelector('.gkb-drawer__backdrop');
    if (backdrop) {
      backdrop.removeEventListener('click', this.handleBackdropClick);
    }

    const list = this.querySelector('.gkb-drawer__list');
    if (list) {
      list.removeEventListener('click', this.handleListClick);
    }

    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleCartUpdate() {
    this.refreshCart(() => {
      this.open();
    });
  }

  handleTriggerClick(event) {
    const trigger = event.target.closest('.gkb-cart-trigger');
    if (trigger) {
      event.preventDefault();
      this.open();
    }
  }

  handleCloseClick(event) {
    if (event) event.preventDefault();
    this.close();
  }

  handleBackdropClick(event) {
    if (event) event.preventDefault();
    this.close();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  isOpen() {
    return this.classList.contains('is-open');
  }

  open() {
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gkb-drawer-active');
    const closeBtn = this.querySelector('.gkb-drawer__close');
    if (closeBtn) closeBtn.focus();
  }

  close() {
    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gkb-drawer-active');
  }

  refreshCart(callback) {
    fetch('/cart.js', {
      headers: { 'Accept': 'application/json' }
    })
      .then((res) => res.json())
      .then((cart) => {
        this.renderCart(cart);
        this.updateHeaderCount(cart.item_count);
        if (typeof callback === 'function') callback();
      })
      .catch((err) => console.warn('Cart refresh failed:', err));
  }

  updateHeaderCount(count) {
    const countElements = document.querySelectorAll('.gkb-cart-count');
    countElements.forEach((el) => {
      el.textContent = count;
      if (count > 0) {
        el.classList.remove('is-hidden');
      } else {
        el.classList.add('is-hidden');
      }
    });
  }

  renderCart(cart) {
    const list = this.querySelector('.gkb-drawer__list');
    const subtotalEl = this.querySelector('.gkb-drawer__subtotal-value');
    const emptyState = this.querySelector('.gkb-drawer__empty');
    const footer = this.querySelector('.gkb-drawer__footer');

    if (!list) return;

    if (cart.item_count === 0) {
      list.innerHTML = '';
      if (emptyState) emptyState.classList.remove('is-hidden');
      if (footer) footer.classList.add('is-hidden');
      return;
    }

    if (emptyState) emptyState.classList.add('is-hidden');
    if (footer) footer.classList.remove('is-hidden');

    let html = '';
    cart.items.forEach((item, index) => {
      const lineNum = index + 1;
      const formattedPrice = this.formatMoney(item.final_line_price);
      const imgHtml = item.image
        ? `<img class="gkb-drawer__item-img" src="${item.image}" alt="${item.title.replace(/"/g, '&quot;')}" width="72" height="72" loading="lazy">`
        : '';

      html += `
        <article class="gkb-drawer__item" data-line="${lineNum}">
          <figure class="gkb-drawer__item-media">${imgHtml}</figure>
          <div class="gkb-drawer__item-details">
            <h4 class="gkb-drawer__item-title">${item.product_title}</h4>
            ${item.variant_title ? `<p class="gkb-drawer__item-variant">${item.variant_title}</p>` : ''}
            <div class="gkb-drawer__item-row">
              <div class="gkb-drawer__qty-group">
                <button type="button" class="gkb-drawer__qty-btn" data-action="minus" data-line="${lineNum}" data-qty="${item.quantity - 1}" aria-label="Decrease quantity">−</button>
                <span class="gkb-drawer__qty-val">${item.quantity}</span>
                <button type="button" class="gkb-drawer__qty-btn" data-action="plus" data-line="${lineNum}" data-qty="${item.quantity + 1}" aria-label="Increase quantity">+</button>
              </div>
              <span class="gkb-drawer__item-price">${formattedPrice}</span>
            </div>
            <button type="button" class="gkb-drawer__remove-btn" data-action="remove" data-line="${lineNum}">Remove</button>
          </div>
        </article>
      `;
    });

    list.innerHTML = html;

    if (subtotalEl) {
      subtotalEl.textContent = this.formatMoney(cart.total_price);
    }
  }

  handleListClick(event) {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;

    event.preventDefault();
    const action = btn.getAttribute('data-action');
    const line = btn.getAttribute('data-line');
    let qty = parseInt(btn.getAttribute('data-qty'), 10);

    if (action === 'remove') {
      qty = 0;
    }

    if (!isNaN(qty) && line) {
      this.updateLineQuantity(line, qty);
    }
  }

  updateLineQuantity(line, quantity) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        line: parseInt(line, 10),
        quantity: quantity
      })
    })
      .then((res) => res.json())
      .then((cart) => {
        this.renderCart(cart);
        this.updateHeaderCount(cart.item_count);
      })
      .catch((err) => console.warn('Line update failed:', err));
  }

  formatMoney(cents) {
    const dollars = (cents / 100).toFixed(2);
    return `$${dollars}`;
  }
}

/* -------------------------------------------------------------------------
 * <gkb-variant-selector> Component
 * ------------------------------------------------------------------------- */
class GkbVariantSelector extends HTMLElement {
  constructor() {
    super();
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.handleQuantityClick = this.handleQuantityClick.bind(this);
  }

  connectedCallback() {
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    this.addEventListener('change', this.handleOptionChange);
    this.addEventListener('click', this.handleQuantityClick);
  }

  unbindEvents() {
    this.removeEventListener('change', this.handleOptionChange);
    this.removeEventListener('click', this.handleQuantityClick);
  }

  handleQuantityClick(event) {
    const btn = event.target.closest('.gkb-product__qty-btn');
    if (!btn) return;
    event.preventDefault();
    const selector = btn.closest('.gkb-product__qty-selector');
    if (!selector) return;
    const input = selector.querySelector('input');
    if (!input) return;
    let val = parseInt(input.value, 10) || 1;
    const action = btn.getAttribute('data-action');
    if (action === 'plus') {
      val += 1;
    } else if (action === 'minus' && val > 1) {
      val -= 1;
    }
    input.value = val;
  }

  getProductData() {
    const script = this.querySelector('.gkb-product-data');
    if (!script) return null;
    try {
      return JSON.parse(script.textContent);
    } catch (e) {
      return null;
    }
  }

  getSelectedOptions() {
    const inputs = this.querySelectorAll('input:checked, select');
    return Array.from(inputs).map((input) => input.value);
  }

  handleOptionChange() {
    const product = this.getProductData();
    if (!product || !product.variants) return;

    const selectedOptions = this.getSelectedOptions();
    const matchedVariant = product.variants.find((variant) => {
      return variant.options.every((opt, index) => opt === selectedOptions[index]);
    });

    if (matchedVariant) {
      this.updateVariantState(matchedVariant);
    }
  }

  updateVariantState(variant) {
    const quickAdd = this.querySelector('.gkb-quick-add__button');
    if (quickAdd) {
      quickAdd.setAttribute('data-variant-id', variant.id);
      quickAdd.disabled = !variant.available;
      const textSpan = quickAdd.querySelector('.gkb-quick-add__text');
      if (textSpan) {
        textSpan.textContent = variant.available ? 'Add to Cart' : 'Sold Out';
      }
    }

    const idInput = this.querySelector('input[name="id"]');
    if (idInput) {
      idInput.value = variant.id;
    }

    const priceEl = this.querySelector('.gkb-price-current');
    if (priceEl && variant.price) {
      priceEl.textContent = `$${(variant.price / 100).toFixed(2)}`;
    }

    document.dispatchEvent(new CustomEvent('gkb:variant-changed', {
      bubbles: true,
      detail: { variant: variant }
    }));
  }
}

/* -------------------------------------------------------------------------
 * <gkb-slider> Component
 * ------------------------------------------------------------------------- */
class GkbSlider extends HTMLElement {
  constructor() {
    super();
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  connectedCallback() {
    this.bindEvents();
    this.updateButtons();
    window.addEventListener('resize', this.handleResize);
  }

  disconnectedCallback() {
    this.unbindEvents();
    window.removeEventListener('resize', this.handleResize);
  }

  getTrack() {
    return this.querySelector('.gkb-slider__track');
  }

  getPrevBtn() {
    return this.querySelector('.gkb-slider__btn--prev')
      || this.closest('.gkb-section, section')?.querySelector('.gkb-slider__btn--prev')
      || this.parentElement?.querySelector('.gkb-slider__btn--prev');
  }

  getNextBtn() {
    return this.querySelector('.gkb-slider__btn--next')
      || this.closest('.gkb-section, section')?.querySelector('.gkb-slider__btn--next')
      || this.parentElement?.querySelector('.gkb-slider__btn--next');
  }

  bindEvents() {
    this.unbindEvents();
    const prevBtn = this.getPrevBtn();
    const nextBtn = this.getNextBtn();
    const track = this.getTrack();

    if (prevBtn) prevBtn.addEventListener('click', this.handlePrev);
    if (nextBtn) nextBtn.addEventListener('click', this.handleNext);
    if (track) track.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  unbindEvents() {
    const prevBtn = this.getPrevBtn();
    const nextBtn = this.getNextBtn();
    const track = this.getTrack();

    if (prevBtn) prevBtn.removeEventListener('click', this.handlePrev);
    if (nextBtn) nextBtn.removeEventListener('click', this.handleNext);
    if (track) track.removeEventListener('scroll', this.handleScroll);
  }

  handleResize() {
    this.updateButtons();
  }

  handlePrev(event) {
    if (event) event.preventDefault();
    const track = this.getTrack();
    if (!track) return;
    const items = Array.from(this.querySelectorAll('.gkb-slider__item'));
    if (!items.length) return;

    const currentScroll = track.scrollLeft;
    const prevItems = items.filter((item) => item.offsetLeft < currentScroll - 15);
    if (prevItems.length > 0) {
      const target = prevItems[prevItems.length - 1];
      track.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    } else {
      const lastItem = items[items.length - 1];
      track.scrollTo({ left: lastItem.offsetLeft, behavior: 'smooth' });
    }
  }

  handleNext(event) {
    if (event) event.preventDefault();
    const track = this.getTrack();
    if (!track) return;
    const items = Array.from(this.querySelectorAll('.gkb-slider__item'));
    if (!items.length) return;

    const currentScroll = track.scrollLeft;
    const nextItem = items.find((item) => item.offsetLeft > currentScroll + 15);
    if (nextItem) {
      track.scrollTo({ left: nextItem.offsetLeft, behavior: 'smooth' });
    } else {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  handleScroll() {
    this.updateButtons();
  }

  updateButtons() {
    const track = this.getTrack();
    const prevBtn = this.getPrevBtn();
    const nextBtn = this.getNextBtn();
    if (!track) return;

    const canScroll = track.scrollWidth > track.clientWidth + 10;
    if (prevBtn) {
      prevBtn.disabled = !canScroll;
    }
    if (nextBtn) {
      nextBtn.disabled = !canScroll;
    }
  }
}

/* -------------------------------------------------------------------------
 * <gkb-recommendations> Component
 * ------------------------------------------------------------------------- */
class GkbRecommendations extends HTMLElement {
  constructor() {
    super();
    this.abortController = null;
  }

  connectedCallback() {
    this.loadRecommendations();
  }

  disconnectedCallback() {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  getUrl() {
    return this.getAttribute('data-url');
  }

  hasExistingCards() {
    return Boolean(this.querySelector('.gkb-card'));
  }

  loadRecommendations() {
    const url = this.getUrl();
    if (!url) return;

    this.abortController = new AbortController();
    fetch(url, { signal: this.abortController.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch recommendations');
        return res.text();
      })
      .then((html) => {
        this.processResponse(html);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.warn('GharKaBazar Recommendations error:', err);
        }
      });
  }

  processResponse(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const incomingBody = doc.querySelector('.gkb-recommendations__body');

    if (incomingBody && incomingBody.querySelector('.gkb-card')) {
      this.innerHTML = incomingBody.innerHTML;
      this.initSlider();
    }
  }

  initSlider() {
    requestAnimationFrame(() => {
      const slider = this.querySelector('gkb-slider');
      if (slider) {
        if (typeof slider.bindEvents === 'function') slider.bindEvents();
        if (typeof slider.updateButtons === 'function') slider.updateButtons();
      }
    });
  }
}

/* -------------------------------------------------------------------------
 * <gkb-recently-viewed> Component
 * ------------------------------------------------------------------------- */
class GkbRecentlyViewed extends HTMLElement {
  static STORAGE_KEY = 'gkb_recently_viewed';

  constructor() {
    super();
    this.handleClearHistory = this.handleClearHistory.bind(this);
  }

  connectedCallback() {
    this.recordCurrentProduct();
    this.renderHistory();
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    const section = this.closest('.gkb-recently-viewed');
    if (section) {
      const clearBtn = section.querySelector('.gkb-recently-viewed__clear-btn');
      if (clearBtn) {
        clearBtn.addEventListener('click', this.handleClearHistory);
      }
    }
  }

  unbindEvents() {
    const section = this.closest('.gkb-recently-viewed');
    if (section) {
      const clearBtn = section.querySelector('.gkb-recently-viewed__clear-btn');
      if (clearBtn) {
        clearBtn.removeEventListener('click', this.handleClearHistory);
      }
    }
  }

  recordCurrentProduct() {
    let dataScript = this.closest('.gkb-recently-viewed')?.querySelector('.gkb-recently-viewed-data');
    if (!dataScript) {
      dataScript = document.querySelector('.gkb-recently-viewed-data');
    }
    if (!dataScript || !dataScript.textContent) return;

    try {
      const product = JSON.parse(dataScript.textContent);
      if (!product || !product.id) return;

      const items = this.getStoredItems();
      const filtered = items.filter((item) => String(item.id) !== String(product.id));
      filtered.unshift(product);
      const capped = filtered.slice(0, 12);
      localStorage.setItem(GkbRecentlyViewed.STORAGE_KEY, JSON.stringify(capped));
    } catch (e) {
      console.warn('Error recording recently viewed item:', e);
    }
  }

  getStoredItems() {
    try {
      const raw = localStorage.getItem(GkbRecentlyViewed.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  getCurrentProductId() {
    return this.getAttribute('data-current-product-id');
  }

  getMaxItems() {
    return parseInt(this.getAttribute('data-max-items'), 10) || 8;
  }

  isSlider() {
    return this.getAttribute('data-layout') === 'slider';
  }

  shouldShowQuickAdd() {
    return this.getAttribute('data-show-quick-add') !== 'false';
  }

  shouldShowVendor() {
    return this.getAttribute('data-show-vendor') === 'true';
  }

  renderHistory() {
    const currentId = this.getCurrentProductId();
    const maxItems = this.getMaxItems();
    const stored = this.getStoredItems();
    let validItems = stored.filter((item) => !currentId || String(item.id) !== String(currentId));
    if (validItems.length === 0 && stored.length > 0) {
      validItems = stored;
    }
    validItems = validItems.slice(0, maxItems);

    const track = this.querySelector('.gkb-slider__track') || this.querySelector('.gkb-grid');
    const emptyState = this.querySelector('.gkb-recently-viewed__empty');
    const section = this.closest('.gkb-recently-viewed');

    if (!track) return;

    if (validItems.length > 0) {
      if (section) section.hidden = false;
      if (emptyState) emptyState.hidden = true;

      const isSlider = this.isSlider();
      const showQuickAdd = this.shouldShowQuickAdd();
      const showVendor = this.shouldShowVendor();

      const existingCards = track.querySelectorAll('.gkb-card');
      const serverRenderedCount = existingCards.length;

      if (serverRenderedCount === 0 || validItems.length >= serverRenderedCount) {
        track.innerHTML = validItems
          .map((item) => this.buildCardMarkup(item, isSlider, showQuickAdd, showVendor))
          .join('');
      }

      this.initSlider();
      return;
    }

    const existingCards = track.querySelectorAll('.gkb-card');
    if (existingCards.length > 0) {
      if (emptyState) emptyState.hidden = true;
      if (section) section.hidden = false;
      this.initSlider();
    } else {
      if (emptyState) emptyState.hidden = false;
    }
  }

  initSlider() {
    if (this.isSlider()) {
      requestAnimationFrame(() => {
        const slider = this.querySelector('gkb-slider');
        if (slider) {
          if (typeof slider.bindEvents === 'function') slider.bindEvents();
          if (typeof slider.updateButtons === 'function') slider.updateButtons();
        }
      });
    }
  }

  buildCardMarkup(item, isSlider, showQuickAdd, showVendor) {
    const isOnSale = item.compare_at_price > item.price;
    const discountPercent = isOnSale
      ? Math.round(((item.compare_at_price - item.price) * 100) / item.compare_at_price)
      : 0;
    const formattedPrice = `$${(item.price / 100).toFixed(2)}`;
    const formattedComparePrice = isOnSale ? `$${(item.compare_at_price / 100).toFixed(2)}` : '';

    const slideClass = isSlider ? ' gkb-slider__item' : '';
    const vendorMarkup = showVendor && item.vendor
      ? `<span class="gkb-card__vendor">${this.escapeHtml(item.vendor)}</span>`
      : '';

    const saleBadge = isOnSale
      ? `<span class="gkb-pill gkb-pill--sale">-${discountPercent}%</span>`
      : '';
    const soldOutBadge = !item.available
      ? `<span class="gkb-pill gkb-pill--soldout">Sold Out</span>`
      : '';
    const inStockBadge = item.available
      ? `<span class="gkb-pill gkb-pill--instock"><span class="gkb-pill__dot" aria-hidden="true"></span><span class="gkb-pill__text">In Stock</span></span>`
      : '';

    const quickAddMarkup = showQuickAdd && item.available && item.variant_id
      ? `<div class="gkb-card__quick-add">
           <product-form-component data-section-id="js-rendered" on:submit="/handleSubmit">
             <div class="visually-hidden" aria-live="polite" aria-hidden="true" role="status" ref="liveRegion"></div>
             <form method="post" action="/cart/add" id="quick-add-${item.id}" accept-charset="UTF-8" class="form" novalidate="novalidate" data-type="add-to-cart-form">
               <input type="hidden" name="form_type" value="product">
               <input type="hidden" name="utf8" value="✓">
               <input type="hidden" name="id" value="${item.variant_id}" class="product-variant-id" ref="variantId">
               <add-to-cart-component>
                 <button
                   type="submit"
                   name="add"
                   class="gkb-quick-add__button"
                   aria-label="Add ${this.escapeHtml(item.title)} to cart"
                   ref="addToCartButton"
                   on:click="/handleClick"
                 >
                   <span class="gkb-quick-add__icon" aria-hidden="true">
                     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                     </svg>
                   </span>
                   <span class="gkb-quick-add__text">ADD TO CART</span>
                 </button>
               </add-to-cart-component>
             </form>
           </product-form-component>
         </div>`
      : '';

    const hoverImgMarkup = item.secondary_image
      ? `<img src="${item.secondary_image}" class="gkb-card__img gkb-card__img--hover" alt="${this.escapeHtml(item.title)}" loading="lazy">`
      : '';

    const primaryImgMarkup = item.image
      ? `<img src="${item.image}" class="gkb-card__img gkb-card__img--primary" alt="${this.escapeHtml(item.title)}" loading="lazy">`
      : `<div class="gkb-card__placeholder"><svg viewBox="0 0 20 20" fill="currentColor" class="gkb-card__svg"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"></path></svg></div>`;

    const variantsHint = item.variants_count > 1
      ? `<span class="gkb-card__variants-hint">${item.variants_count} options</span>`
      : '';

    return `
      <article class="gkb-card${slideClass}">
        <div class="gkb-card__media-wrap">
          <a href="${item.url}" class="gkb-card__media-link" aria-label="${this.escapeHtml(item.title)}">
            <figure class="gkb-card__figure">
              ${primaryImgMarkup}
              ${hoverImgMarkup}
            </figure>
          </a>
          <div class="gkb-card__badges">
            <div class="gkb-card__badges-left">
              ${saleBadge}
              ${soldOutBadge}
            </div>
            <div class="gkb-card__badges-right">
              ${inStockBadge}
            </div>
          </div>

        </div>
        <div class="gkb-card__content">
          ${vendorMarkup}
          <h3 class="gkb-card__title">
            <a href="${item.url}" class="gkb-card__title-link">${this.escapeHtml(item.title)}</a>
          </h3>
          <div class="gkb-card__footer">
            <div class="gkb-card__price">
              <span class="gkb-price gkb-price--current">${formattedPrice}</span>
              ${isOnSale ? `<s class="gkb-price gkb-price--compare">${formattedComparePrice}</s>
              <span class="gkb-price gkb-price--discount">${discountPercent}% off</span>` : ''}
            </div>
            ${variantsHint}
          </div>
          ${quickAddMarkup}
        </div>
      </article>
    `;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  handleClearHistory() {
    try {
      localStorage.removeItem(GkbRecentlyViewed.STORAGE_KEY);
      this.renderHistory();
    } catch (e) {
      console.warn('Could not clear recently viewed:', e);
    }
  }
}

/* -------------------------------------------------------------------------
 * <gkb-product-gallery> Component
 * ------------------------------------------------------------------------- */
class GkbProductGallery extends HTMLElement {
  constructor() {
    super();
    this.handleThumbClick = this.handleThumbClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleVariantChange = this.handleVariantChange.bind(this);
    this.scrollTimeout = null;
  }

  connectedCallback() {
    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  getScrollTrack() {
    return this.querySelector('.gkb-product__main-scroll');
  }

  getSlides() {
    return this.querySelectorAll('.gkb-product__main-slide');
  }

  getThumbButtons() {
    return this.querySelectorAll('.gkb-product__thumb-btn');
  }

  getPrevBtn() {
    return this.querySelector('.gkb-product__main-nav-btn--prev');
  }

  getNextBtn() {
    return this.querySelector('.gkb-product__main-nav-btn--next');
  }

  bindEvents() {
    const thumbsContainer = this.querySelector('.gkb-product__thumbs');
    if (thumbsContainer) {
      thumbsContainer.addEventListener('click', this.handleThumbClick);
    }

    const track = this.getScrollTrack();
    if (track) {
      track.addEventListener('scroll', this.handleScroll, { passive: true });
    }

    const prevBtn = this.getPrevBtn();
    const nextBtn = this.getNextBtn();
    if (prevBtn) prevBtn.addEventListener('click', this.handlePrevClick);
    if (nextBtn) nextBtn.addEventListener('click', this.handleNextClick);

    document.addEventListener('gkb:variant-changed', this.handleVariantChange);
  }

  unbindEvents() {
    const thumbsContainer = this.querySelector('.gkb-product__thumbs');
    if (thumbsContainer) {
      thumbsContainer.removeEventListener('click', this.handleThumbClick);
    }

    const track = this.getScrollTrack();
    if (track) {
      track.removeEventListener('scroll', this.handleScroll);
    }

    const prevBtn = this.getPrevBtn();
    const nextBtn = this.getNextBtn();
    if (prevBtn) prevBtn.removeEventListener('click', this.handlePrevClick);
    if (nextBtn) nextBtn.removeEventListener('click', this.handleNextClick);

    document.removeEventListener('gkb:variant-changed', this.handleVariantChange);
  }

  handleThumbClick(event) {
    const btn = event.target.closest('.gkb-product__thumb-btn');
    if (!btn) return;

    event.preventDefault();
    const index = parseInt(btn.getAttribute('data-index'), 10);
    const mediaId = btn.getAttribute('data-media-id');

    this.scrollToIndex(index, mediaId);
  }

  scrollToIndex(index, mediaId) {
    const track = this.getScrollTrack();
    const slides = this.getSlides();
    if (!track || slides.length === 0) return;

    let targetSlide = null;
    if (typeof index === 'number' && !isNaN(index) && slides[index]) {
      targetSlide = slides[index];
    } else if (mediaId) {
      targetSlide = Array.from(slides).find((s) => s.getAttribute('data-media-id') === String(mediaId));
    }

    if (targetSlide) {
      const targetLeft = targetSlide.offsetLeft;
      track.scrollTo({ left: targetLeft, behavior: 'smooth' });
      this.setActiveThumb(index >= 0 ? index : Array.from(slides).indexOf(targetSlide));
    }
  }

  handleScroll() {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout(() => {
      const track = this.getScrollTrack();
      const slides = this.getSlides();
      if (!track || slides.length === 0) return;

      const trackWidth = track.clientWidth || 1;
      const activeIndex = Math.round(track.scrollLeft / trackWidth);
      if (activeIndex >= 0 && activeIndex < slides.length) {
        this.setActiveThumb(activeIndex);
      }
    }, 50);
  }

  setActiveThumb(index) {
    const thumbs = this.getThumbButtons();
    thumbs.forEach((btn, idx) => {
      if (idx === index) {
        btn.classList.add('is-active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('is-active');
      }
    });
  }

  handlePrevClick(event) {
    if (event) event.preventDefault();
    const track = this.getScrollTrack();
    if (!track) return;
    track.scrollBy({ left: -track.clientWidth, behavior: 'smooth' });
  }

  handleNextClick(event) {
    if (event) event.preventDefault();
    const track = this.getScrollTrack();
    if (!track) return;
    track.scrollBy({ left: track.clientWidth, behavior: 'smooth' });
  }

  handleVariantChange(event) {
    const variant = event.detail && event.detail.variant;
    if (!variant || !variant.featured_media) return;
    const mediaId = variant.featured_media.id;
    if (mediaId) {
      this.scrollToIndex(null, mediaId);
    }
  }
}

/* -------------------------------------------------------------------------
 * <gkb-quickview> Component
 * ------------------------------------------------------------------------- */
class GkbQuickview extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.selectedVariant = null;
    this.quantity = 1;
    this.triggerEl = null;
    this.touchStartY = 0;

    this.handleTriggerClick = this.handleTriggerClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleContentClick = this.handleContentClick.bind(this);
  }

  connectedCallback() {
    this.sheet = this.querySelector('.gkb-quickview__sheet');
    this.bodyEl = this.querySelector('.gkb-quickview__body');
    this.closeBtn = this.querySelector('.gkb-quickview__close');
    this.backdrop = this.querySelector('.gkb-quickview__backdrop');
    this.dragHandle = this.querySelector('.gkb-quickview__drag-handle');

    this.bindEvents();
  }

  disconnectedCallback() {
    this.unbindEvents();
  }

  bindEvents() {
    document.addEventListener('click', this.handleTriggerClick);

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', this.handleCloseClick);
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', this.handleBackdropClick);
    }
    if (this.dragHandle) {
      this.dragHandle.addEventListener('click', this.handleCloseClick);
    }
    if (this.bodyEl) {
      this.bodyEl.addEventListener('click', this.handleContentClick);
    }

    if (this.sheet) {
      this.sheet.addEventListener('touchstart', this.handleTouchStart, { passive: true });
      this.sheet.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    }

    window.addEventListener('keydown', this.handleKeyDown);
  }

  unbindEvents() {
    document.removeEventListener('click', this.handleTriggerClick);

    if (this.closeBtn) {
      this.closeBtn.removeEventListener('click', this.handleCloseClick);
    }
    if (this.backdrop) {
      this.backdrop.removeEventListener('click', this.handleBackdropClick);
    }
    if (this.dragHandle) {
      this.dragHandle.removeEventListener('click', this.handleCloseClick);
    }
    if (this.bodyEl) {
      this.bodyEl.removeEventListener('click', this.handleContentClick);
    }

    if (this.sheet) {
      this.sheet.removeEventListener('touchstart', this.handleTouchStart);
      this.sheet.removeEventListener('touchend', this.handleTouchEnd);
    }

    window.removeEventListener('keydown', this.handleKeyDown);
  }

  handleTriggerClick(event) {
    const trigger = event.target.closest('[data-quickview-handle]');
    if (!trigger) return;

    event.preventDefault();
    const handle = trigger.getAttribute('data-quickview-handle');
    if (!handle) return;

    this.triggerEl = trigger;
    this.open(handle);
  }

  handleCloseClick(event) {
    if (event) event.preventDefault();
    this.close();
  }

  handleBackdropClick(event) {
    if (event) event.preventDefault();
    this.close();
  }

  handleKeyDown(event) {
    if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  handleTouchStart(event) {
    if (event.touches && event.touches.length > 0) {
      this.touchStartY = event.touches[0].clientY;
    }
  }

  handleTouchEnd(event) {
    if (event.changedTouches && event.changedTouches.length > 0) {
      const touchEndY = event.changedTouches[0].clientY;
      const deltaY = touchEndY - this.touchStartY;
      const isScrolledToTop = this.bodyEl ? this.bodyEl.scrollTop <= 5 : true;
      if (deltaY > 60 && isScrolledToTop) {
        this.close();
      }
    }
  }

  isOpen() {
    return this.classList.contains('is-open');
  }

  open(handle) {
    this.classList.add('is-open');
    this.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gkb-quickview-active');

    this.showLoading();
    if (this.closeBtn) this.closeBtn.focus();

    this.fetchProduct(handle);
  }

  close() {
    if (!this.isOpen()) return;

    this.classList.remove('is-open');
    this.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gkb-quickview-active');

    if (this.triggerEl) {
      this.triggerEl.focus();
      this.triggerEl = null;
    }
  }

  showLoading() {
    if (!this.bodyEl) return;
    this.bodyEl.innerHTML = `
      <div class="gkb-quickview__loading">
        <div class="gkb-quickview__spinner" aria-hidden="true"></div>
        <span class="visually-hidden">Loading product details</span>
      </div>
    `;
  }

  async fetchProduct(handle) {
    try {
      const response = await fetch(`/products/${encodeURIComponent(handle)}.js`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load product`);
      }
      const product = await response.json();
      this.product = product;
      this.selectedVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
      this.quantity = 1;
      this.render();
    } catch (error) {
      console.error('Error fetching product for quickview:', error);
      this.renderError();
    }
  }

  renderError() {
    if (!this.bodyEl) return;
    this.bodyEl.innerHTML = `
      <div class="gkb-quickview__error">
        <p class="gkb-quickview__error-text">Unable to load product details. Please try again.</p>
        <button type="button" class="gkb-quickview__error-close">Close</button>
      </div>
    `;
    const btn = this.bodyEl.querySelector('.gkb-quickview__error-close');
    if (btn) {
      btn.addEventListener('click', () => this.close());
    }
  }

  render() {
    if (!this.bodyEl || !this.product) return;

    const product = this.product;
    const variant = this.selectedVariant;
    const isAvailable = variant ? variant.available : false;
    const priceFormatted = variant ? this.formatMoney(variant.price) : '';
    const comparePriceFormatted = variant && variant.compare_at_price > variant.price
      ? this.formatMoney(variant.compare_at_price)
      : '';
    const isSale = Boolean(comparePriceFormatted);
    const discountPercent = isSale
      ? Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)
      : 0;
    const isBestseller = (product.tags && Array.isArray(product.tags) && product.tags.some((t) => {
      const td = t.toLowerCase().trim();
      return td === 'bestseller' || td === 'best-seller' || td === 'best seller' || td === 'popular' || td === 'top-seller' || td === 'trending';
    })) || false;

    const images = product.images && product.images.length > 0
      ? product.images
      : (product.featured_image ? [product.featured_image] : []);
    const currentImg = variant && variant.featured_image && variant.featured_image.src
      ? variant.featured_image.src
      : (images[0] || '');

    const galleryHtml = `
      <figure class="gkb-quickview__gallery">
        <div class="gkb-quickview__main-img-wrap">
          ${currentImg
            ? `<img class="gkb-quickview__main-img" src="${currentImg}" alt="${this.escapeHtml(product.title)}" loading="lazy">`
            : `<div class="gkb-quickview__placeholder">No image available</div>`}
          <div class="gkb-card__badges">
            <div class="gkb-card__badges-left">
              ${isBestseller && isAvailable ? `<span class="gkb-pill gkb-pill--bestseller"><span class="gkb-pill__icon" aria-hidden="true"><svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 1l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L1.5 7.2l5.9-.9L10 1z"/></svg></span><span class="gkb-pill__text">Best Seller</span></span>` : ''}
              ${isSale ? `<span class="gkb-pill gkb-pill--sale">-${discountPercent}%</span>` : ''}
              ${!isAvailable ? `<span class="gkb-pill gkb-pill--soldout">Sold Out</span>` : ''}
            </div>
            <div class="gkb-card__badges-right">
              ${isAvailable ? `<span class="gkb-pill gkb-pill--instock"><span class="gkb-pill__dot" aria-hidden="true"></span><span class="gkb-pill__text">In Stock</span></span>` : ''}
            </div>
          </div>
        </div>
        ${images.length > 1 ? `
          <div class="gkb-quickview__thumbs">
            ${images.map((img, idx) => `
              <button
                type="button"
                class="gkb-quickview__thumb-btn${img === currentImg ? ' is-active' : ''}"
                data-img-src="${img}"
                aria-label="View image ${idx + 1}"
              >
                <img src="${img}" alt="" width="56" height="56" loading="lazy">
              </button>
            `).join('')}
          </div>
        ` : ''}
      </figure>
    `;

    const optionsHtml = (product.options && product.options.length > 0 && product.options[0].name !== 'Title')
      ? product.options.map((option, optIdx) => {
          const selectedVal = variant ? variant.options[optIdx] : option.values[0];
          return `
            <fieldset class="gkb-quickview__option-group" data-option-index="${optIdx}">
              <legend class="gkb-quickview__option-legend">
                <span class="gkb-quickview__option-name">${this.escapeHtml(option.name)}:</span>
                <span class="gkb-quickview__option-val" data-option-val-label="${optIdx}">${this.escapeHtml(selectedVal)}</span>
              </legend>
              <div class="gkb-quickview__pills">
                ${option.values.map((val) => {
                  const isSelected = val === selectedVal;
                  return `
                    <button
                      type="button"
                      class="gkb-quickview__pill${isSelected ? ' is-selected' : ''}"
                      data-option-index="${optIdx}"
                      data-option-value="${this.escapeHtml(val)}"
                    >
                      ${this.escapeHtml(val)}
                    </button>
                  `;
                }).join('')}
              </div>
            </fieldset>
          `;
        }).join('')
      : '';

    const contentHtml = `
      <article class="gkb-quickview__product">
        ${galleryHtml}
        <section class="gkb-quickview__info">
          <header class="gkb-quickview__header">
            ${product.vendor ? `<span class="gkb-quickview__vendor">${this.escapeHtml(product.vendor)}</span>` : ''}
            <h2 class="gkb-quickview__title">
              <a href="${product.url}" class="gkb-quickview__title-link">${this.escapeHtml(product.title)}</a>
            </h2>
            <div class="gkb-quickview__price-wrap">
              <span class="gkb-price gkb-price--current gkb-quickview__price">${priceFormatted}</span>
              ${isSale ? `<s class="gkb-price gkb-price--compare gkb-quickview__compare-price">${comparePriceFormatted}</s>` : ''}
              ${isSale ? `<span class="gkb-price gkb-price--discount gkb-quickview__discount">${discountPercent}% off</span>` : ''}
              ${isAvailable ? `<span class="gkb-pill gkb-pill--instock"><span class="gkb-pill__dot" aria-hidden="true"></span>In Stock</span>` : `<span class="gkb-pill gkb-pill--soldout">Sold Out</span>`}
            </div>
          </header>

          <form class="gkb-quickview__form" onsubmit="return false;">
            ${optionsHtml}

            <div class="gkb-quickview__actions">
              <div class="gkb-quickview__qty-wrap">
                <button type="button" class="gkb-quickview__qty-btn" data-action="minus" aria-label="Decrease quantity">−</button>
                <span class="gkb-quickview__qty-value">${this.quantity}</span>
                <button type="button" class="gkb-quickview__qty-btn" data-action="plus" aria-label="Increase quantity">+</button>
              </div>

              <button
                type="button"
                class="gkb-quickview__atc-btn"
                ${!isAvailable ? 'disabled' : ''}
              >
                ${isAvailable ? 'ADD TO CART' : 'SOLD OUT'}
              </button>
            </div>
          </form>

          <footer class="gkb-quickview__footer">
            <a href="${product.url}" class="gkb-quickview__details-link">View Full Product Details →</a>
          </footer>
        </section>
      </article>
    `;

    this.bodyEl.innerHTML = contentHtml;
  }

  handleContentClick(event) {
    const thumbBtn = event.target.closest('.gkb-quickview__thumb-btn');
    if (thumbBtn) {
      event.preventDefault();
      const newSrc = thumbBtn.getAttribute('data-img-src');
      if (newSrc) {
        const mainImg = this.bodyEl.querySelector('.gkb-quickview__main-img');
        if (mainImg) mainImg.src = newSrc;
        this.bodyEl.querySelectorAll('.gkb-quickview__thumb-btn').forEach((btn) => btn.classList.remove('is-active'));
        thumbBtn.classList.add('is-active');
      }
      return;
    }

    const pill = event.target.closest('.gkb-quickview__pill');
    if (pill) {
      event.preventDefault();
      const optIdx = parseInt(pill.getAttribute('data-option-index'), 10);
      const optVal = pill.getAttribute('data-option-value');
      this.handleOptionSelect(optIdx, optVal);
      return;
    }

    const qtyBtn = event.target.closest('.gkb-quickview__qty-btn');
    if (qtyBtn) {
      event.preventDefault();
      const action = qtyBtn.getAttribute('data-action');
      if (action === 'plus') {
        this.quantity += 1;
      } else if (action === 'minus' && this.quantity > 1) {
        this.quantity -= 1;
      }
      const qtyValEl = this.bodyEl.querySelector('.gkb-quickview__qty-value');
      if (qtyValEl) qtyValEl.textContent = this.quantity;
      return;
    }

    const atcBtn = event.target.closest('.gkb-quickview__atc-btn');
    if (atcBtn) {
      event.preventDefault();
      this.handleAddToCart(atcBtn);
      return;
    }
  }

  handleOptionSelect(optIdx, optVal) {
    if (!this.product || !this.selectedVariant) return;

    const currentOptions = [...this.selectedVariant.options];
    currentOptions[optIdx] = optVal;

    let matchedVariant = this.product.variants.find((v) =>
      v.options.every((val, idx) => val === currentOptions[idx])
    );

    if (!matchedVariant) {
      matchedVariant = this.product.variants.find((v) => v.options[optIdx] === optVal) || this.product.variants[0];
    }

    this.selectedVariant = matchedVariant;
    this.render();
  }

  async handleAddToCart(btn) {
    if (!this.selectedVariant || !this.selectedVariant.available) return;

    btn.disabled = true;
    const originalText = btn.textContent;
    btn.textContent = 'ADDING...';

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          id: this.selectedVariant.id,
          quantity: this.quantity
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add to cart: ${response.status}`);
      }

      btn.textContent = '✓ ADDED!';
      document.dispatchEvent(new CustomEvent('gkb:cart-updated', { bubbles: true }));

      setTimeout(() => {
        this.close();
      }, 500);
    } catch (error) {
      console.error('Error adding to cart from quickview:', error);
      btn.textContent = 'ERROR - TRY AGAIN';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = originalText;
      }, 1500);
    }
  }

  formatMoney(cents) {
    if (cents == null || isNaN(cents)) return '';
    const currency = this.getAttribute('data-currency') || '₹';
    return `${currency}${(cents / 100).toFixed(2)}`;
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}

/* Register Custom Elements Safely */
if (!customElements.get('gkb-quickview')) {
  customElements.define('gkb-quickview', GkbQuickview);
}
if (!customElements.get('gkb-quick-add')) {
  customElements.define('gkb-quick-add', GkbQuickAdd);
}
if (!customElements.get('gkb-cart-drawer')) {
  customElements.define('gkb-cart-drawer', GkbCartDrawer);
}
if (!customElements.get('gkb-variant-selector')) {
  customElements.define('gkb-variant-selector', GkbVariantSelector);
}
if (!customElements.get('gkb-slider')) {
  customElements.define('gkb-slider', GkbSlider);
}
if (!customElements.get('gkb-recommendations')) {
  customElements.define('gkb-recommendations', GkbRecommendations);
}
if (!customElements.get('gkb-recently-viewed')) {
  customElements.define('gkb-recently-viewed', GkbRecentlyViewed);
}
if (!customElements.get('gkb-product-gallery')) {
  customElements.define('gkb-product-gallery', GkbProductGallery);
}

/* -------------------------------------------------------------------------
 * Section-Level Custom Elements (Presentational Wrappers)
 * ------------------------------------------------------------------------- */
class GkbHeroSection extends HTMLElement {}
class GkbBenefitsSection extends HTMLElement {}
class GkbCategoriesSection extends HTMLElement {}
class GkbFeaturedSection extends HTMLElement {}
class GkbStorySection extends HTMLElement {}
class GkbReviewsSection extends HTMLElement {}
class GkbFaqSection extends HTMLElement {}
class GkbCtaSection extends HTMLElement {}
class GkbMainProductSection extends HTMLElement {}
class GkbMainCollectionSection extends HTMLElement {
  connectedCallback() {
    this.initInfiniteScroll();
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  initInfiniteScroll() {
    const sentinel = this.querySelector('[data-infinite-scroll]');
    if (!sentinel) return;

    this.isLoading = false;
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.isLoading) {
          this.loadMoreProducts();
        }
      });
    }, {
      rootMargin: '250px 0px'
    });

    this.observer.observe(sentinel);
  }

  async loadMoreProducts() {
    const sentinel = this.querySelector('[data-infinite-scroll]');
    if (!sentinel) return;

    const nextUrl = sentinel.getAttribute('data-next-url');
    if (!nextUrl) {
      if (this.observer) this.observer.disconnect();
      sentinel.remove();
      return;
    }

    this.isLoading = true;
    sentinel.classList.add('is-loading');

    try {
      const response = await fetch(nextUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');

      const grid = this.querySelector('[data-products-grid]');
      const newCards = doc.querySelectorAll('[data-products-grid] > .gkb-card');

      if (grid && newCards.length > 0) {
        newCards.forEach((card) => {
          grid.appendChild(card);
        });
      }

      const nextSentinel = doc.querySelector('[data-infinite-scroll]');
      const nextNextUrl = nextSentinel ? nextSentinel.getAttribute('data-next-url') : null;

      if (nextNextUrl) {
        sentinel.setAttribute('data-next-url', nextNextUrl);
      } else {
        if (this.observer) this.observer.disconnect();
        sentinel.remove();
      }

      window.history.replaceState({}, '', nextUrl);
    } catch (error) {
      console.error('Error loading more collection products:', error);
      sentinel.classList.remove('is-loading');
    } finally {
      this.isLoading = false;
      sentinel.classList.remove('is-loading');
    }
  }
}
class GkbRecommendationsSectionEl extends HTMLElement {}
class GkbRecentlyViewedSectionEl extends HTMLElement {}

if (!customElements.get('gkb-hero')) {
  customElements.define('gkb-hero', GkbHeroSection);
}
if (!customElements.get('gkb-benefits')) {
  customElements.define('gkb-benefits', GkbBenefitsSection);
}
if (!customElements.get('gkb-categories')) {
  customElements.define('gkb-categories', GkbCategoriesSection);
}
if (!customElements.get('gkb-featured')) {
  customElements.define('gkb-featured', GkbFeaturedSection);
}
if (!customElements.get('gkb-story')) {
  customElements.define('gkb-story', GkbStorySection);
}
if (!customElements.get('gkb-reviews')) {
  customElements.define('gkb-reviews', GkbReviewsSection);
}
if (!customElements.get('gkb-faq')) {
  customElements.define('gkb-faq', GkbFaqSection);
}
if (!customElements.get('gkb-cta')) {
  customElements.define('gkb-cta', GkbCtaSection);
}
if (!customElements.get('gkb-main-product')) {
  customElements.define('gkb-main-product', GkbMainProductSection);
}
if (!customElements.get('gkb-main-collection')) {
  customElements.define('gkb-main-collection', GkbMainCollectionSection);
}
if (!customElements.get('gkb-recommendations-section')) {
  customElements.define('gkb-recommendations-section', GkbRecommendationsSectionEl);
}
if (!customElements.get('gkb-recently-viewed-section')) {
  customElements.define('gkb-recently-viewed-section', GkbRecentlyViewedSectionEl);
}

