import { gsap } from 'gsap';

export default class MenuHandler {
  constructor() {
    this.elements = {};
    this.isMenuOpen = false;
    this.isAnimating = false;
  }

  init(container, lenis) {
    this.lenis = lenis;
    this.initializeElements(container);
    this.addEventListeners();
  }

  initializeElements(container) {
    this.elements = {
      nav: container.querySelector('[data-element="nav"]'),
      navButton: container.querySelector('[data-element="nav-menu-button"]'),
      navButtonText: container.querySelector('[data-element="nav-menu-button-text"]'),
      menu: container.querySelector('[data-element="nav-menu"]'),
      menuLinks: container.querySelectorAll('[data-element="nav-link"]'),
      menuSocialLinks: container.querySelector('[data-element="nav-social-links"]'),
      navLine: container.querySelector('[data-element="nav-line"]'),
    };
  }

  addEventListeners() {
    this.elements.navButton.addEventListener('click', () => this.toggleMenu());

    this.elements.menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        this.lenis.start();
        // this.menuClose();
      });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isMenuOpen && !this.isAnimating) {
        this.menuClose();
      }
    });
    window.addEventListener('resize', () => {
      if (this.isMenuOpen && !this.isAnimating) {
        this.menuClose();
      }
    });
  }

  toggleMenu() {
    if (this.isAnimating) return;

    if (this.isMenuOpen) {
      this.menuClose();
    } else {
      this.menuOpen();
    }
  }

  menuOpen() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    gsap
      .timeline({
        willChange: 'transform',
        onStart: () => {
          this.elements.menu.style.display = 'flex';
          this.lenis.stop();
        },
        onComplete: () => {
          this.isAnimating = false;
          this.isMenuOpen = true;
        },
      })
      .fromTo(this.elements.menu, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: 'sine.out' })
      .to(
        this.elements.navButtonText,
        {
          opacity: 0,
          duration: 0.1,
          onComplete: () => {
            this.elements.navButtonText.textContent = 'Close';
          },
        },
        '<'
      )
      .to(this.elements.navButtonText, {
        opacity: 1,
        duration: 0.1,
      })
      .fromTo(
        this.elements.menuLinks,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power2.out' },
        '>-0.25'
      )
      .fromTo(this.elements.navLine, { scaleY: 0 }, { scaleY: 1 }, '<0.25')
      .fromTo(
        this.elements.menuSocialLinks,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' },
        '>-0.5'
      );
  }

  menuClose() {
    if (this.isAnimating) return;

    this.isAnimating = true;
    gsap
      .timeline({
        onComplete: () => {
          this.elements.menu.style.display = 'none';
          this.lenis.start();
          this.isAnimating = false;
          this.isMenuOpen = false;
        },
      })
      .to(this.elements.menuSocialLinks, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      })
      .to(this.elements.menuLinks, { opacity: 0, duration: 0.3, ease: 'power2.in' }, '>-0.25')
      .to(this.elements.menu, { opacity: 0, duration: 0.5, ease: 'sine.in' }, '>-0.25')
      .to(
        this.elements.navButtonText,
        {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            this.elements.navButtonText.textContent = 'Menu';
          },
        },
        '<'
      )
      .to(this.elements.navButtonText, {
        opacity: 1,
        duration: 0.2,
      });
  }
}
