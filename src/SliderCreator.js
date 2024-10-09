import { gsap } from 'gsap';
import Swiper from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

export default class SliderCreator {
  constructor() {
    this.sliders = {};
  }

  createAllSliders() {
    this.createGallerySlider();
    this.createStoreLocatorSlider();
    this.createProcessSlider();
    this.createProductDetailGallerySlider();
  }

  createGallerySlider() {
    const container = document.querySelector('.gallery_slider-container');
    if (!container) return;

    this.sliders.gallery = new Swiper('.gallery_slider-container.swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 200,
      speed: 750,
      direction: 'horizontal',
      navigation: {
        prevEl: '.gallery_slider-container [data-element="swiper-prev"]',
        nextEl: '.gallery_slider-container [data-element="swiper-next"]',
      },
      centeredSlides: true,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
      },
      breakpoints: {
        0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 0 },
        480: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 24 },
        767: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 32 },
        992: { slidesPerGroup: 1 },
      },
    });

    this.animateGallerySlides();
  }

  animateGallerySlides() {
    const gallerySlides = document.querySelectorAll('.gallery_slide');

    gsap.from(gallerySlides, {
      x: 400,
      duration: 1,
      scrollTrigger: {
        trigger: gallerySlides[0],
        start: 'top bottom',
        end: 'center 60%',
        scrub: 1.5,
      },
    });

    this.sliders.gallery.on('slideChangeTransitionStart', this.updateSlideOpacity);
  }

  updateSlideOpacity() {
    const slides = document.querySelectorAll('.gallery_slider-container .swiper-slide');
    slides.forEach((slide) => {
      const opacity = slide.classList.contains('swiper-slide-active') ? 1 : 0.5;
      const filter = slide.classList.contains('swiper-slide-active')
        ? 'saturate(100%)'
        : 'saturate(0%)';
      gsap.to(slide, { opacity, filter, duration: 1.5 });
    });
  }

  createStoreLocatorSlider() {
    const container = document.querySelector('.store-locator_slider-container');
    if (!container) return;

    this.sliders.storeLocator = new Swiper('.store-locator_slider-container', {
      modules: [Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 0,
      grabCursor: true,
      speed: 250,
      direction: 'vertical',
      allowTouchMove: true,
      navigation: {
        prevEl: '.store-locator_slider-nav [data-element="swiper-prev"]',
        nextEl: '.store-locator_slider-nav [data-element="swiper-next"]',
      },
      parallax: true,
      freeMode: true,
      breakpoints: {
        0: { slidesPerGroup: 6 },
        480: { slidesPerGroup: 6 },
        767: { slidesPerGroup: 6 },
        992: { slidesPerGroup: 6 },
      },
    });
  }

  createProcessSlider() {
    const container = document.querySelector('.process_slider-container');
    if (!container) return;

    this.sliders.process = new Swiper('.process_slider-container.swiper', {
      modules: [Autoplay, Navigation, Pagination],
      slidesPerView: 'auto',
      spaceBetween: 4,
      grabCursor: true,
      speed: 750,
      direction: 'horizontal',
      centeredSlides: true,
      pagination: {
        el: '.process_slider-pagination',
        bulletClass: 'pagination-bullet',
        bulletActiveClass: 'pagination-bullet-active',
        clickable: true,
        type: 'fraction',
      },
      autoplay: {
        delay: 3000,
      },
      allowTouchMove: true,
      navigation: {
        prevEl: '.process_slider-container [data-element="swiper-prev"]',
        nextEl: '.process_slider-container [data-element="swiper-next"]',
      },
      parallax: true,
      breakpoints: {
        0: { slidesPerGroup: 1 },
        480: { slidesPerGroup: 1 },
        767: { slidesPerGroup: 1 },
        992: { slidesPerGroup: 1 },
      },
    });
  }

  createProductDetailGallerySlider() {
    const container = document.querySelector('.product-gallery_list-wrap');
    if (!container) return;

    this.sliders.productDetailGallery = new Swiper('.product-gallery_list-wrap.swiper', {
      modules: [Navigation, Pagination],
      slidesPerView: 1,
      spaceBetween: 4,
      grabCursor: true,
      speed: 500,
      direction: 'horizontal',
      centeredSlides: true,
      loop: true,
      allowTouchMove: true,
      resistanceRatio: 0,
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        prevEl: '.product-gallery_nav [data-element="swiper-prev"]',
        nextEl: '.product-gallery_nav [data-element="swiper-next"]',
      },
    });
  }
}
