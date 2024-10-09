import { gsap } from 'gsap';
import SplitType from 'split-type';
import VideoHandler from './VideoHandler';
export default class HeaderAnimator {
  constructor() {
    this.headerComponent = null;
    this.elements = {};
  }

  animateIntro(container) {
    this.headerComponent = container.querySelector('.home-header_component');
    if (!this.headerComponent) return;

    this.initializeElements();
    this.streamVideo();
    this.createAnimation();
  }

  initializeElements() {
    this.elements = {
      paperTop: this.headerComponent.querySelector('.home-header_top-paper2'),
      paperBottom: this.headerComponent.querySelector('.home-header_bottom-paper2'),
      logo: this.headerComponent.querySelector('.home-header_logo'),
      overlay: this.headerComponent.querySelector('.home-header_overlay'),
      bottle: this.headerComponent.querySelector('.home-header_bottle'),
      content: this.headerComponent.querySelector('.home-header_content'),
      kanji: this.headerComponent.querySelector('.home-header_kanji'),
      heading: this.headerComponent.querySelector('.home-header_heading'),
      button: this.headerComponent.querySelector('.button'),
      buttonArrow: this.headerComponent.querySelector('.button_icon'),
      videoContainer: this.headerComponent.querySelector('.home-header_landscape'),
      videoEl: this.headerComponent.querySelector('[data-element="header-video"]'),
    };
  }

  streamVideo() {
    if (!this.elements.videoEl) return;
    const video = new VideoHandler(this.elements.videoEl);
    video.initVideos();
  }

  createAnimation() {
    const text = new SplitType(this.elements.heading, { types: 'lines, words, chars' });

    const tl = gsap.timeline();

    tl.to(this.elements.videoContainer, { autoAlpha: 1 })
      .to(this.elements.bottle, { autoAlpha: 1, y: 0, duration: 1 }, 'start')
      .to(this.elements.kanji, { autoAlpha: 1, duration: 1 }, 'start+=0.5')
      .to(this.elements.heading, { autoAlpha: 1, duration: 0.25 }, 'start+=0.75')
      .fromTo(
        text.lines,
        { filter: 'blur(10px) brightness(70%)', willChange: 'filter, transform', autoAlpha: 0 },
        { filter: 'blur(0px) brightness(100%)', stagger: 0.4, autoAlpha: 1, duration: 1 },
        'start+=1.25'
      )
      .to(this.elements.button, { autoAlpha: 1, duration: 2 })
      .to(this.elements.buttonArrow, { autoAlpha: 1, yPercent: 0, duration: 1 }, '<');
  }

  animateOnScroll() {
    if (!this.headerComponent) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.headerComponent,
        start: 'clamp(top, top)',
        end: '+=1000',
        scrub: 1,
      },
    });

    tl.to(this.elements.bottle, { y: -100 }, '<')
      .to(this.elements.content, { y: -75 }, '<')
      .to(this.elements.videoContainer, { y: -30 }, '<');
  }
}
