// Styles for /lib/components/data/brightness.jsx component
export const brightnessStyles = /* css */ `
.brightness {
  font-variant-numeric: tabular-nums;
  background-color: var(--minor);
  transform: translateZ(0);
}
.simple-bar--widgets-background-color-as-foreground .brightness {
  color: var(--yellow);
  background-color: transparent;
}
.brightness__slider-container {
  --slider-size: 10px;

  position: relative;
  max-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  clip-path: inset(0);
  opacity: 0.7;
  border-radius: var(--item-radius);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 0ms var(--transition-easing);
}
.brightness:hover .brightness__slider-container,
.brightness--dragging .brightness__slider-container {
  max-width: 100px;
  clip-path: inset(-100vh -100vw);
  transition: max-width 320ms var(--transition-easing), padding 320ms var(--transition-easing),
    opacity 320ms var(--transition-easing),
    clip-path 320ms 320ms var(--transition-easing)
}
.brightness__slider-container:hover {
  opacity: 1;
}
.brightness__slider {
  width: 100px;
  height: var(--slider-size);
  appearance: none;
  background-color: var(--background);
  border-radius: var(--item-radius);
  outline: none;
  -webkit-appearance: none;
}
.simple-bar--widgets-background-color-as-foreground .brightness__slider {
  background-color: var(--foreground);
}
.brightness__slider::-webkit-slider-thumb {
  width: var(--slider-size);
  height: var(--slider-size);
  background-color: var(--foreground);
  border-radius: var(--item-radius);
  cursor: pointer;
  -webkit-appearance: none;
  transform-origin: center;
  transition: transform 160ms var(--transition-easing);
}
.simple-bar--widgets-background-color-as-foreground .brightness__slider::-webkit-slider-thumb {
  background-color: var(--yellow);
}
.brightness__slider::-webkit-slider-thumb:hover {
  transform: scale(1.5);
}
.brightness__display {
  display: flex;
  align-items: center;
  margin-right: 4px;
  overflow: hidden;
}
.brightness__display:active {
  color: currentColor;
}
.brightness__display > svg {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-right: 3px;
  fill: currentColor;
}
`;
