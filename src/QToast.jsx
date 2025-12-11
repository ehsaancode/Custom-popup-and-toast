import React, { useState, useEffect } from "react";

const QToast = ({
  message = "Default Toast Message",
  duration = 3000,
  position = "top-right",
  success = true,  // Default to true for success
  show = true,    // visibility prop
  mode = "light",
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false); // Controls opacity/transform
  const [shouldRender, setShouldRender] = useState(false); // Controls mounting

  const expiryTimeRef = React.useRef(0);
  const timerRef = React.useRef(null);

  // Handle rendering
  const handleShow = () => {
    setShouldRender(true);
    // Slight delay to allow mount
    setTimeout(() => {
      setIsVisible(true);
    }, 10);
  };

  // Handle Close logic
  const handleClose = () => {
    setIsVisible(false);

    setTimeout(() => {
      setShouldRender(false);
      if (onClose) onClose();
    }, 300); // Duration matches CSS transition duration
  };

  //'show' prop to trigger show/hide
  useEffect(() => {
    if (show) {
      handleShow();
    } else {
      handleClose();
    }
  }, [show]);

  useEffect(() => {
    if (isVisible && duration) {
      // Set absolute expiry time
      expiryTimeRef.current = Date.now() + duration;
      timerRef.current = setTimeout(handleClose, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [isVisible, duration]);

  const handleMouseEnter = () => {
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    if (isVisible) {
      const remainingTime = expiryTimeRef.current - Date.now();
      if (remainingTime <= 0) {
        handleClose();
      } else {
        timerRef.current = setTimeout(handleClose, remainingTime);
      }
    }
  };

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    "center": "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
    "center-right": "top-1/2 right-4 transform -translate-y-1/2",
    "center-left": "top-1/2 left-4 transform -translate-y-1/2",
  };

  const appliedPosition = positionClasses[position] ?? positionClasses["top-right"];

  // Animation classes
  const transitionClasses = "transition-all duration-300 ease-in-out transform";
  const visibleClasses = "opacity-100 scale-100";

  let hiddenClasses = "opacity-0";

  if (position.includes("left")) {
    hiddenClasses += " -translate-x-10"; // Slide from left
  } else if (position.includes("right")) {
    hiddenClasses += " translate-x-10"; // Slide from right
  } else if (position.includes("top")) { // top-center
    hiddenClasses += " -translate-y-10"; // Slide from top
  } else if (position.includes("bottom")) { // bottom-center
    hiddenClasses += " translate-y-10"; // Slide from bottom
  } else if (position === "center") {
    hiddenClasses += " scale-50"; // Pop up
  }

  // Normalize success prop to boolean
  const isSuccess = success === true || success === "true";

  // Mode classes
  const isDarkMode = mode === "dark";
  const themeClasses = isDarkMode
    ? "bg-gray-800 text-white shadow-black/50"
    : "bg-white text-black shadow-gray-500";

  // Don't render if not shown
  if (!show && !shouldRender) return null;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed ${appliedPosition} ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses
        } ${themeClasses} px-4 py-2 rounded-xl shadow-lg flex items-center justify-between w-72 z-50`}
    >
      <div className="flex items-center gap-3">
        {/* Conditional Icon */}
        {isSuccess ? (
          // Success Icon
          <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-green-200 transition-transform duration-500 delay-100 ${isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}>
            <svg
              className="w-4 h-4 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          // Fail Icon
          <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-red-200 transition-transform duration-500 delay-100 ${isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}>
            <svg
              className="w-4 h-4 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
        <span>{message}</span>
      </div>

      <button
        onClick={handleClose}
        className={`ml-1 pb-4 pt-0 rounded-full px-1 py-1 hover:transition hover:text-red-500 ${isDarkMode ? "text-gray-400" : "text-gray-900"}`}
      >
        ×
      </button>
    </div>
  );
};

export default QToast;