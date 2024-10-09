import Hls from 'hls.js';
export default class VideoHandler {
  constructor(videoEls) {
    this.videoEls = videoEls;
  }

  initVideos() {
    const videos = this.videoEls || document.querySelectorAll('[data-element="video"]');
    const videoArray =
      this.videoEls && this.videoEls.length === undefined ? [this.videoEls] : videos;

    videoArray.forEach((video) => {
      const url = video.getAttribute('data-source');
      if (!url) return;

      this.setupVideo(video, url);
    });
  }

  setupVideo(video, url) {
    const playVideo = () => {
      video.play().catch((error) => {
        console.error('Playback failed:', error);
        // Handle autoplay restrictions here
      });
    };

    if (Hls.isSupported()) {
      this.setupHls(video, url, playVideo);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      this.setupNativeHls(video, url, playVideo);
    } else {
      console.error('This browser does not support HLS playback.');
    }
  }

  setupHls(video, url, playCallback) {
    const hls = new Hls({
      debug: false,
      enableWorker: true,
      lowLatencyMode: true,
    });

    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, playCallback);
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        this.handleHlsError(hls, data);
      }
    });
  }

  setupNativeHls(video, url, playCallback) {
    video.src = url;
    video.addEventListener('loadedmetadata', playCallback);
  }

  handleHlsError(hls, data) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        console.error('Network error:', data);
        hls.startLoad();
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        console.error('Media error:', data);
        hls.recoverMediaError();
        break;
      default:
        console.error('Unrecoverable error:', data);
        hls.destroy();
        break;
    }
  }
}
