import * as Uebersicht from "uebersicht";
import * as DataWidget from "./data-widget.jsx";
import * as DataWidgetLoader from "./data-widget-loader.jsx";
import * as Icons from "../icons/icons.jsx";
import { SuspenseIcon } from "../icons/icon.jsx";
import useWidgetRefresh from "../../hooks/use-widget-refresh";
import useServerSocket from "../../hooks/use-server-socket";
import { useSimpleBarContext } from "../simple-bar-context.jsx";
import * as Utils from "../../utils";

export { brightnessStyles as styles } from "../../styles/components/data/brightness";

const { React } = Uebersicht;

const DEFAULT_REFRESH_FREQUENCY = 20000;

/**
 * Brightness widget component.
 * @returns {JSX.Element|null} The brightness widget.
 */
export const Widget = React.memo(() => {
  const { displayIndex, settings } = useSimpleBarContext();
  const { widgets, brightnessWidgetOptions } = settings;
  const { brightnessWidget } = widgets;
  const { refreshFrequency, showOnDisplay, showIcon } = brightnessWidgetOptions;

  // Determine the refresh frequency for the widget.
  const refresh = React.useMemo(
    () =>
      Utils.getRefreshFrequency(refreshFrequency, DEFAULT_REFRESH_FREQUENCY),
    [refreshFrequency],
  );

  // Determine if the widget should be visible on the current display.
  const visible =
    Utils.isVisibleOnDisplay(displayIndex, showOnDisplay) && brightnessWidget;

  const [state, setState] = React.useState();
  const [loading, setLoading] = React.useState(visible);
  const { brightness: _brightness } = state || {};
  const [brightness, setBrightness] = React.useState(
    _brightness && parseFloat(_brightness),
  );
  const [dragging, setDragging] = React.useState(false);

  /**
   * Reset the widget state.
   */
  const resetWidget = () => {
    setState(undefined);
    setLoading(false);
  };

  /**
   * Fetch the current brightness settings.
   */
  const getBrightness = React.useCallback(async () => {
    if (!visible) return;

    // Try to get brightness using osascript first
    let brightnessOutput;

    try {
      brightnessOutput = await Uebersicht.run(
        `betterdisplaycli get --brightness`,
      );
    } catch {
      // Final fallback: default brightness
      brightnessOutput = "0.5";
    }

    setState({
      brightness: brightnessOutput,
    });
    setLoading(false);
  }, [visible]);

  // Use server socket to listen for brightness updates.
  useServerSocket(
    "brightness",
    visible,
    getBrightness,
    resetWidget,
    setLoading,
  );
  // Refresh the widget at the specified interval.
  useWidgetRefresh(visible, getBrightness, refresh);

  // Update the brightness settings when dragging ends.
  React.useEffect(() => {
    if (!dragging) setBrightnessLevel(brightness, _brightness);
  }, [dragging, brightness]);

  // Update the brightness state when the fetched brightness changes.
  React.useEffect(() => {
    setBrightness((currentBrightness) => {
      if (_brightness && currentBrightness !== parseFloat(_brightness)) {
        return parseFloat(_brightness);
      }
      return currentBrightness;
    });
  }, [_brightness]);

  if (loading) return <DataWidgetLoader.Widget className="brightness" />;
  if (!state || brightness === undefined) return null;

  const Icon = getIcon(brightness);

  /**
   * Handle brightness change event.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event.
   */
  const onChange = (e) => {
    const value = parseFloat(e.target.value);
    setBrightness(value);
  };

  const onMouseDown = () => setDragging(true);
  const onMouseUp = () => setDragging(false);

  // Convert brightness to percentage for display
  const brightnessPercentage = Math.round(brightness * 100);
  const formattedBrightness = `${brightnessPercentage.toString().padStart(2, "0")}%`;

  const classes = Utils.classNames("brightness", {
    "brightness--dragging": dragging,
  });

  return (
    <DataWidget.Widget classes={classes} disableSlider>
      <div className="brightness__display">
        {showIcon && (
          <SuspenseIcon>
            <Icon />
          </SuspenseIcon>
        )}
        <span className="brightness__value">{formattedBrightness}</span>
      </div>
      <div className="brightness__slider-container">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={brightness}
          className="brightness__slider"
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
      </div>
    </DataWidget.Widget>
  );
});

Widget.displayName = "Brightness";

/**
 * Get the appropriate icon based on brightness level.
 * @param {number} brightness - The current brightness (0-1).
 * @returns {JSX.Element} The icon component.
 */
function getIcon(brightness) {
  // if (brightness <= 0.5) return Icons.Moon;
  // return Icons.Sun;
  return Icons.Desktop;
}

/**
 * Set the system brightness.
 * @param {number} brightness - The brightness to set (0-1).
 */
function setBrightnessLevel(brightness, foo) {
  if (brightness === undefined) return;

  Uebersicht.run(`betterdisplaycli set --brightness=${brightness}`);
}
