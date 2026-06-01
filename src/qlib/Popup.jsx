import React, { useState, useEffect, useRef } from "react";

const parseDuration = (dur) => {
  if (dur === undefined || dur === null) return null;
  if (typeof dur === 'number') return dur;
  const str = String(dur).trim().toLowerCase();

  // Matches digits optionally followed by ms, s, or m
  const match = str.match(/^(\d+(?:\.\d+)?)\s*(ms|s|m)?$/);
  if (!match) return null;

  const value = parseFloat(match[1]);
  const unit = match[2];

  if (unit === 's') return value * 1000;
  if (unit === 'm') return value * 60000;
  return value; // 'ms' or no unit
};

const isGradient = (colorStr) => {
  if (!colorStr) return false;
  const str = String(colorStr).trim().toLowerCase();
  return str.startsWith("linear-gradient") || 
         str.startsWith("radial-gradient") || 
         str.startsWith("conic-gradient") ||
         str.includes("-gradient");
};

const getTextStyle = (colorVal, defaultColor) => {
  const finalColor = colorVal || defaultColor;
  if (isGradient(finalColor)) {
    return {
      background: finalColor,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      display: "inline-block",
    };
  }
  return {
    color: finalColor,
  };
};

const Popup = ({
  position = "center",
  backgroundColor,
  color, // general text/accent color fallback
  title = "Popup",
  titleTextColor,
  message = "",
  messageTextColor,
  duration,
  borderRadius,
  show: controlledShow,
  autoHide = "false",

  showTrigger = "true",
}) => {
  const [showPopup, setShowPopup] = useState(true);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const expiryTimeRef = useRef(0);
  const timerRef = useRef(null);

  const parsedMs = parseDuration(duration);
  const shouldAutoHide = autoHide === true || autoHide === "true";

  // Sync controlled/uncontrolled state
  useEffect(() => {
    if (controlledShow !== undefined) {
      setShowPopup(controlledShow);
    } else {
      setShowPopup(true);
    }
  }, [controlledShow, title, message, duration]);

  // Handle smooth transition rendering
  useEffect(() => {
    if (showPopup) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  // Handle timer starting and pausing on hover
  const startTimer = (timeRemaining) => {
    if (shouldAutoHide && timeRemaining && timeRemaining > 0) {
      expiryTimeRef.current = Date.now() + timeRemaining;
      timerRef.current = setTimeout(() => {
        setShowPopup(false);
      }, timeRemaining);
    }
  };

  useEffect(() => {
    if (showPopup && !isHovered && shouldAutoHide && parsedMs && parsedMs > 0) {
      startTimer(parsedMs);
    }
    return () => clearTimeout(timerRef.current);
  }, [showPopup, isHovered, parsedMs, title, message, shouldAutoHide]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (shouldAutoHide) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (showPopup && shouldAutoHide && parsedMs && parsedMs > 0) {
      const remainingTime = expiryTimeRef.current - Date.now();
      if (remainingTime <= 0) {
        setShowPopup(false);
      } else {
        startTimer(remainingTime);
      }
    }
  };

  // Mapping positions to Tailwind classes
  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "top-right": "top-4 right-4",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "left-center": "top-1/2 left-4 -translate-y-1/2",
    "right-center": "top-1/2 right-4 -translate-y-1/2",
  };

  const appliedPosition = positionClasses[position] ?? positionClasses["center"];
  const isCenter = position === "center";

  // Animation classes
  let hiddenClasses = "opacity-0 scale-95";
  if (position.includes("top")) {
    hiddenClasses = "opacity-0 -translate-y-4 scale-95";
  } else if (position.includes("bottom")) {
    hiddenClasses = "opacity-0 translate-y-4 scale-95";
  }
  const visibleClasses = "opacity-100 scale-100 translate-y-0";
  const animationClass = isVisible ? visibleClasses : hiddenClasses;

  // Backdrop animation classes (for center position only)
  const backdropVisible = isVisible ? "opacity-100" : "opacity-0";

  // Color Fallbacks & Styles (supporting gradients)
  const titleStyle = getTextStyle(titleTextColor || color, "#1f2937");
  const messageStyle = getTextStyle(messageTextColor || color, "#4b5563");
  const accentColor = color || "#3b82f6"; // for button, progress bar

  const cardStyle = {
    background: backgroundColor || "#ffffff",
    borderRadius: borderRadius || "0.5rem",
    overflow: "hidden",
  };

  const cardPositionClass = isCenter
    ? "relative"
    : `absolute ${appliedPosition}`;

  if (!shouldRender) {
    return (
      <>
        {showTrigger && (
          <button
            onClick={() => setShowPopup(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 z-40 pointer-events-auto"
          >
            Show Popup
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>

      {/* Backdrop or transparent container */}
      <div
        className={
          isCenter
            ? `fixed inset-0 bg-black/40 backdrop-blur-xs z-40 flex items-center justify-center transition-opacity duration-300 pointer-events-auto ${backdropVisible}`
            : "fixed inset-0 z-40 pointer-events-none"
        }
      >
        {/* Popup Card */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`relative p-6 shadow-2xl w-96 max-w-[90vw] z-50 pointer-events-auto transition-all duration-300 ease-out transform ${cardPositionClass} ${animationClass}`}
          style={cardStyle}
        >
          {/* Top-right close icon */}
          <button
            onClick={() => setShowPopup(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Card Content */}
          <div className="mb-4 pr-6">
            <h3 className="text-lg font-bold mb-2">
              <span style={titleStyle}>{title}</span>
            </h3>
            <p className="text-sm leading-relaxed">
              <span style={messageStyle}>{message}</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 text-sm font-semibold rounded transition-all hover:opacity-90 active:scale-95 cursor-pointer"
              style={{
                background: accentColor,
                color: isGradient(backgroundColor) ? "#ffffff" : (backgroundColor || "#ffffff"),
                borderRadius: borderRadius || "0.375rem",
              }}
            >
              Close
            </button>
          </div>

          {/* Shrinking progress bar */}
          {shouldAutoHide && parsedMs > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                height: "4px",
                background: accentColor,
                animation: `shrinkWidth ${parsedMs}ms linear forwards`,
                animationPlayState: isHovered ? "paused" : "running",
              }}
            />
          )}
        </div>
      </div>

      {showTrigger && (
        <button
          onClick={() => setShowPopup(true)}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95 z-40 pointer-events-auto"
        >
          Show Popup
        </button>
      )}
    </>
  );
};

export default Popup;
