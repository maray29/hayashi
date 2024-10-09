import './styles.css';

import barba from '@barba/core';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import ScrollTrigger from 'gsap/ScrollTrigger';

import HeaderAnimator from './HeaderAnimator';
import MenuHandler from './MenuHandler';
import ProductAnimator from './ProductAnimator';
import ScrollControl from './ScrollControl';
import SliderCreator from './SliderCreator';
import VideoHandler from './VideoHandler';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Utility functions
const utils = {
  fadeElement: (element, direction = 'in', duration = 0.5) => {
    return gsap.to(element, {
      autoAlpha: direction === 'in' ? 1 : 0,
      duration: duration,
    });
  },
  scrollToTop: () => {
    lenis.scrollTo('top');
  },
};

// TypeScript-style type definitions (for future conversion)
/**
 * @typedef {Object} WhiskyAppConfig
 * @property {Object} lenis - Lenis smooth scrolling configuration
 * @property {Object} swiper - Swiper slider configuration
 */

/**
 * Main application class for the Whisky website
 */
class WhiskyApp {
  /**
   * @param {WhiskyAppConfig} config - Configuration object for the app
   */
  constructor() {
    this.modules = {
      scrollControl: null,
      headerAnimator: null,
      sliderCreator: null,
      productAnimator: null,
      menuHandler: null,
      videoHandler: null,
    };
  }

  /**
   * Initialize all modules of the application
   * @throws {Error} If a module fails to initialize
   */
  initializeModules() {
    try {
      this.modules.scrollControl = new ScrollControl();
      this.modules.headerAnimator = new HeaderAnimator();
      this.modules.sliderCreator = new SliderCreator();
      this.modules.productAnimator = new ProductAnimator();
      this.modules.menuHandler = new MenuHandler();
      this.modules.videoHandler = new VideoHandler();
    } catch (error) {
      console.error('Failed to initialize modules:', error);
      throw new Error('Application initialization failed');
    }
  }

  /**
   * Initialize the application with the given container
   * @param {HTMLElement} container - The main container element
   */
  init(container) {
    try {
      console.log('Initializing WhiskyApp');
      this.initializeModules();

      this.modules.scrollControl.init();
      this.modules.headerAnimator.animateIntro(container);
      this.modules.sliderCreator.createAllSliders();
      this.modules.productAnimator.init();
      this.modules.menuHandler.init(container);
      this.modules.videoHandler.initVideos();

      this.setupScrollToTop();
      this.animateStoreLocator(container);
    } catch (error) {
      console.error('Failed to initialize WhiskyApp:', error);
      // Here you might want to display an error message to the user
    }
  }

  /**
   * Set up the scroll-to-top functionality
   */
  setupScrollToTop() {
    const button = document.querySelector('[data-element="btn-scroll-top"]');
    if (!button) {
      console.warn('Scroll-to-top button not found');
      return;
    }

    gsap.set(button, { autoAlpha: 0 });
    gsap.to(button, {
      autoAlpha: 1,
      scrollTrigger: {
        trigger: 'body',
        start: '+=1000',
        toggleActions: 'play none none reverse',
      },
    });

    button.addEventListener('click', () => {
      this.modules.scrollControl.scrollToTop();
    });
  }

  /**
   * Animate the store locator section
   * @param {HTMLElement} container - The main container element
   */
  animateStoreLocator(container) {
    const storeLocator = container.querySelector('.store-locator_layout');
    if (!storeLocator) {
      console.warn('Store locator not found');
      return;
    }

    const stores = storeLocator.querySelectorAll('.store_component');
    const storesToAnimate = [...stores].slice(0, 7);
    const storeLocatorNav = storeLocator.querySelectorAll('.store-locator_slider-nav');

    gsap
      .timeline({
        scrollTrigger: {
          trigger: storeLocator,
          start: 'top center',
        },
      })
      .from(storesToAnimate, {
        yPercent: 50,
        opacity: 0,
        stagger: 0.1,
      })
      .from(
        storeLocatorNav,
        {
          opacity: 0,
        },
        '<1.5'
      );
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  const whiskyApp = new WhiskyApp();
  whiskyApp.init(document.body);

  // Barba.js initialization (with error handling)

  // Function to fade out the current page
  const fadeOut = (container) => {
    return gsap.to(container, {
      autoAlpha: 0,
      duration: 0.5,
    });
  };

  // Function to fade in the new page
  const fadeIn = (container) => {
    return gsap.from(container, {
      autoAlpha: 0,
      duration: 1.5,
    });
  };

  try {
    barba.init({
      transitions: [
        {
          name: 'fade-transition',
          async leave(data) {
            await fadeOut(data.current.container);
            data.current.container.remove();
          },
          async enter(data) {
            data.next.container.style.visibility = 'visible';
            await fadeIn(data.next.container);
          },
        },
      ],
      views: [
        {
          afterEnter({ next }) {
            whiskyApp.init(next.container);
          },
        },
      ],
    });

    barba.hooks.enter(() => {
      window.scrollTo(0, 0);
    });

    barba.hooks.beforeEnter(async (data) => {
      await restartWebflow();
      whiskyApp.init(data.next.container);
    });
  } catch (error) {
    console.error('Failed to initialize Barba.js:', error);
    // Fallback to normal page loads if Barba.js fails
  }
});

/**
 * Restart the Webflow JS library
 * @returns {Promise<void>}
 */
const restartWebflow = async () => {
  try {
    window.Webflow?.destroy();
    window.Webflow?.ready();
    window.Webflow?.require('ix2')?.init();
  } catch (error) {
    console.error('Failed to restart Webflow:', error);
    throw new Error('Webflow restart failed');
  }
};
