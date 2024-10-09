import { gsap } from 'gsap';
import Flip from 'gsap/Flip';

export default class ProductAnimator {
  constructor() {
    this.products = [];
    this.productButtons = [];
    this.productsNav = null;
    this.buttonBorders = null;
    this.currentProductIndex = 0;
  }

  init() {
    gsap.registerPlugin(Flip);

    this.styleCMSProductName();
    this.initializeElements();
    if (this.products.length > 0) {
      this.animateProducts();
    }
  }

  styleCMSProductName() {
    const productsSliderComponent = document.querySelector('.products_component');
    if (!productsSliderComponent) return;

    const headings = productsSliderComponent.querySelectorAll('.product_name');
    headings.forEach(this.styleHeading);
  }

  styleHeading(heading) {
    const text = heading.textContent;
    const parts = text.split(' ');

    if (parts.length > 1) {
      const productName = parts.pop();
      const newText = parts.join(' ') + ' ';
      heading.innerHTML = `${newText}<span class="product_name-highlight">${productName}</span>`;
    }
  }

  initializeElements() {
    this.products = document.querySelectorAll('[data-element="product"]');
    this.productButtons = document.querySelectorAll('[data-element="product-button"]');
    this.productsNav = document.querySelector('[data-element="products-nav"]');
    if (this.productsNav) {
      this.buttonBorders = this.productsNav.querySelector('.button-borders');
    }
  }

  animateProducts() {
    this.initializeProductDisplay();
    this.setupEventListeners();
    this.updateActiveButton(0);
  }

  initializeProductDisplay() {
    this.products.forEach((product, index) => {
      product.style.position = 'absolute';
      product.style.display = index === 0 ? 'block' : 'none';
      product.style.opacity = index === 0 ? 1 : 0;
    });
  }

  setupEventListeners() {
    this.productButtons.forEach((button, index) => {
      button.addEventListener('click', () => this.handleButtonClick(index));
      button.addEventListener('mouseenter', () => this.handleButtonHover(button));
      button.addEventListener('mouseleave', () => this.handleButtonLeave(button));
    });
  }

  handleButtonClick(index) {
    this.updateActiveButton(index);
    this.fadeProducts(index);
  }

  handleButtonHover(button) {
    this.animateButtonBorders(button);
    if (!button.classList.contains('is-active')) {
      gsap.to(button, { opacity: 0.75, duration: 0.3 });
    }
  }

  handleButtonLeave(button) {
    const activeButton = this.productsNav.querySelector('.button.is-active');
    if (activeButton) {
      this.animateButtonBorders(activeButton);
    } else {
      this.productsNav.appendChild(this.buttonBorders);
    }
    if (!button.classList.contains('is-active')) {
      gsap.to(button, { opacity: 0.5, duration: 0.3 });
    }
  }

  animateButtonBorders(targetButton) {
    const state = Flip.getState(this.buttonBorders);
    targetButton.appendChild(this.buttonBorders);
    Flip.from(state, {
      duration: 0.4,
      ease: 'power1.inOut',
      absolute: true,
    });
  }

  updateActiveButton(index) {
    this.productButtons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      button.style.opacity = i === index ? 1 : 0.5;
    });
    this.animateButtonBorders(this.productButtons[index]);
  }

  fadeProducts(newIndex) {
    if (newIndex === this.currentProductIndex) return;

    gsap.to(this.products[this.currentProductIndex], {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        this.products[this.currentProductIndex].style.display = 'none';
        this.products[newIndex].style.display = 'block';
        gsap.fromTo(this.products[newIndex], { opacity: 0 }, { opacity: 1, duration: 0.5 });
      },
    });

    this.currentProductIndex = newIndex;
  }
}
