import { gsap } from 'gsap';
import SplitType from 'split-type';

import VideoHandler from './VideoHandler';
export default class HeaderAnimator {
  constructor() {
    this.headerComponent = null;
    this.elements = {};
  }

  init(container) {
    this.headerComponent = container.querySelector('.home-header_component');
    if (!this.headerComponent) return;

    this.initializeElements();
    this.streamVideo();
    this.animateIntro();
    this.animateOnScroll();
  }

  initializeElements() {
    this.elements = {
      introWrap: this.headerComponent.querySelector('[data-element="intro-wrap"]'),
      introLogo: this.headerComponent.querySelector('[data-element="intro-logo"]'),
      introKanji: this.headerComponent.querySelector('[data-element="intro-kanji"]'),
      introVideoContainer: this.headerComponent.querySelector(
        '[data-element="intro-video-container"]'
      ),
      introVideo: this.headerComponent.querySelector('[data-element="intro-video"]'),
      bottle: this.headerComponent.querySelector('.home-header_bottle'),
      content: this.headerComponent.querySelector('.home-header_content'),
      kanji: this.headerComponent.querySelector('.home-header_kanji'),
      heading: this.headerComponent.querySelector('.home-header_heading'),
      button: this.headerComponent.querySelector('.button'),
      buttonArrow: this.headerComponent.querySelector('.button_icon'),
      videoContainer: this.headerComponent.querySelector('.home-header_landscape'),
      video: this.headerComponent.querySelector('[data-element="header-video"]'),
    };
  }

  streamVideo() {
    if (!this.elements.video || !this.elements.introVideo) return;
    const videos = new VideoHandler([this.elements.introVideo, this.elements.video]);
    videos.initVideos();
  }

  animateIntro() {
    const text = new SplitType(this.elements.heading, { types: 'lines, words, chars' });
    console.log(this.elements.introWrap);
    const tl = gsap.timeline();

    tl.from(this.elements.introLogo, { autoAlpha: 0, duration: 1 })
      .from(this.elements.introKanji, { autoAlpha: 0, duration: 1 }, '>-0.15')
      .to(this.elements.introWrap, { autoAlpha: 1 }, '>-0.5')
      .to(this.elements.introKanji, { autoAlpha: 0, duration: 1 })
      .to(this.elements.introLogo, { autoAlpha: 0, duration: 1 })
      .to(this.elements.introWrap, { autoAlpha: 0, duration: 2 }, '<')
      .to(this.elements.videoContainer, { autoAlpha: 3 }, '<')
      .to(this.elements.bottle, { autoAlpha: 1, y: 0, duration: 1 }, '>-0.25')
      .to(this.elements.kanji, { autoAlpha: 1, duration: 1 }, '>-0.5')
      .to(this.elements.heading, { autoAlpha: 1, duration: 0.25 }, '<')
      .fromTo(
        text.lines,
        { filter: 'blur(10px) brightness(70%)', willChange: 'filter, transform', autoAlpha: 0 },
        { filter: 'blur(0px) brightness(100%)', stagger: 0.4, autoAlpha: 1, duration: 1 },
        '>-0.5'
      )
      .to(this.elements.button, { autoAlpha: 1, duration: 2 })
      .to(this.elements.buttonArrow, { autoAlpha: 1, yPercent: 0, duration: 1 }, '<');
  }

  animateOnScroll() {
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
