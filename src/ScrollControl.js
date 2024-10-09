import Lenis from 'lenis';

export default class ScrollControl {
  constructor() {
    this.lenis = null;
  }

  init() {
    if (Webflow.env('editor') === undefined) {
      this.lenis = new Lenis({ easing: (t) => 1 - Math.pow(1 - t, 5), wheelMultiplier: 1.5 });
      this.lenis.on('scroll', (e) => {
        // Scroll event handling (if needed)
      });
      this.startRaf();
    }
  }

  startRaf() {
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  stop() {
    if (this.lenis) {
      this.lenis.stop();
      console.log('Lenis is stopped');
    }
  }

  start() {
    if (this.lenis) {
      this.lenis.start();
      console.log('Lenis is started');
    }
  }
}
