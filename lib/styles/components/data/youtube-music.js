// Styles for /lib/components/data/youtube-music.jsx component
export const youtubeMusicStyles = /* css */ `
.youtube-music {
  position: relative;
  background-color: var(--blue);
}
.simple-bar--widgets-background-color-as-foreground .youtube-music {
  color: var(--minor);
  background-color: transparent;
}

.scrolling-text.scrolling {
  animation: scroll-text 15s linear infinite;
}

@keyframes scroll-text {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.scrolling-text.scrolling.paused {
  animation-play-state: paused;
}
`;
