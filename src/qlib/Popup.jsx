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
  title = "Popup",
  titleTextColor,
  message = "",
  messageTextColor,
  duration,
  borderRadius,
  show: controlledShow,
  autoHide = "false",
  showTrigger = "true",
  buttonColor,
  buttonTextColor,
  progressColor,
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

  // Mapping positions to custom CSS classes for layout & transitions
  const positionClassMap = {
    "top-left": "popup-pos-top-left",
    "top-center": "popup-pos-top-center",
    "top-right": "popup-pos-top-right",
    "center": "popup-pos-center",
    "bottom-left": "popup-pos-bottom-left",
    "bottom-center": "popup-pos-bottom-center",
    "bottom-right": "popup-pos-bottom-right",
    "left-center": "popup-pos-left-center",
    "right-center": "popup-pos-right-center",
  };

  const appliedPositionClass = positionClassMap[position] ?? positionClassMap["center"];
  const isCenter = position === "center";

  // Backdrop animation classes (for center position only)
  const backdropVisible = isVisible ? "opacity-100" : "opacity-0";

  // Color Fallbacks & Styles (supporting gradients)
  const titleStyle = getTextStyle(titleTextColor, "#1f2937");
  const messageStyle = getTextStyle(messageTextColor, "#4b5563");
  const defaultAccentColor = "#3b82f6"; // default blue accent

  const defaultButtonTextColor = isGradient(buttonColor || defaultAccentColor)
    ? "#ffffff"
    : (backgroundColor || "#ffffff");

  const buttonTextStyle = getTextStyle(buttonTextColor, defaultButtonTextColor);

  const cardStyle = {
    background: backgroundColor || "#ffffff",
    borderRadius: borderRadius || "0.5rem",
    overflow: "hidden",
  };

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

        .popup-card {
          transition: opacity 300ms cubic-bezier(0.16, 1, 0.3, 1), transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .popup-pos-top-left { top: 1rem; left: 1rem; transform: scale(0.95) translateY(-10px); opacity: 0; }
        .popup-pos-top-left.popup-visible { transform: scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-top-center { top: 1rem; left: 50%; transform: translateX(-50%) scale(0.95) translateY(-10px); opacity: 0; }
        .popup-pos-top-center.popup-visible { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-top-right { top: 1rem; right: 1rem; transform: scale(0.95) translateY(-10px); opacity: 0; }
        .popup-pos-top-right.popup-visible { transform: scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-center { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.95); opacity: 0; }
        .popup-pos-center.popup-visible { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        
        .popup-pos-bottom-left { bottom: 1rem; left: 1rem; transform: scale(0.95) translateY(10px); opacity: 0; }
        .popup-pos-bottom-left.popup-visible { transform: scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-bottom-center { bottom: 1rem; left: 50%; transform: translateX(-50%) scale(0.95) translateY(10px); opacity: 0; }
        .popup-pos-bottom-center.popup-visible { transform: translateX(-50%) scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-bottom-right { bottom: 1rem; right: 1rem; transform: scale(0.95) translateY(10px); opacity: 0; }
        .popup-pos-bottom-right.popup-visible { transform: scale(1) translateY(0); opacity: 1; }
        
        .popup-pos-left-center { top: 50%; left: 1rem; transform: translateY(-50%) scale(0.95) translateX(-10px); opacity: 0; }
        .popup-pos-left-center.popup-visible { transform: translateY(-50%) scale(1) translateX(0); opacity: 1; }
        
        .popup-pos-right-center { top: 50%; right: 1rem; transform: translateY(-50%) scale(0.95) translateX(10px); opacity: 0; }
        .popup-pos-right-center.popup-visible { transform: translateY(-50%) scale(1) translateX(0); opacity: 1; }
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
          className={`absolute p-6 shadow-2xl w-96 max-w-[90vw] z-50 pointer-events-auto popup-card ${appliedPositionClass} ${isVisible ? "popup-visible" : ""}`}
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
                background: buttonColor || defaultAccentColor,
                borderRadius: borderRadius || "0.375rem",
              }}
            >
              <span style={buttonTextStyle}>Close</span>
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
                background: progressColor || defaultAccentColor,
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
