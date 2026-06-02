import React, { useState, useEffect, useRef } from "react";

const toastEvents = {
  listeners: [],
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  },
  emit(event) {
    this.listeners.forEach((listener) => listener(event));
  },
};

const PRESETS = {
  success: {
    bg: "bg-green-200",
    text: "text-green-600",
    icon: (
      <svg
        className="w-4 h-4"
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
    ),
  },
  error: {
    bg: "bg-red-200",
    text: "text-red-600",
    icon: (
      <svg
        className="w-4 h-4"
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
    ),
  },
  info: {
    bg: "bg-blue-200",
    text: "text-blue-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    bg: "bg-yellow-200",
    text: "text-yellow-600",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
  },
};

const parseDuration = (dur) => {
  if (dur === undefined || dur === null) return null;
  if (typeof dur === 'number') return dur;
  const str = String(dur).trim().toLowerCase();

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

// Toast Item Component
const ToastItem = ({
  message = "Default Toast Message",
  duration = 3000,
  position = "top-right",
  type = "success",
  mode = "light",
  backgroundColor,
  borderRadius,
  title,
  titleTextColor,
  messageTextColor,
  buttonColor,
  buttonTextColor,
  progressColor,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const expiryTimeRef = useRef(0);
  const timerRef = useRef(null);

  const parsedMs = parseDuration(duration);
  const safeDuration = parsedMs !== null ? parsedMs : 3000;

  const stylePreset = PRESETS[type] || PRESETS.success;

  // Trigger entry transition on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const startTimer = (timeRemaining) => {
    if (timeRemaining && timeRemaining > 0) {
      expiryTimeRef.current = Date.now() + timeRemaining;
      timerRef.current = setTimeout(handleClose, timeRemaining);
    }
  };

  useEffect(() => {
    if (isVisible && !isHovered && safeDuration > 0) {
      startTimer(safeDuration);
    }
    return () => clearTimeout(timerRef.current);
  }, [isVisible, isHovered, safeDuration]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    clearTimeout(timerRef.current);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (isVisible && safeDuration > 0) {
      const remainingTime = expiryTimeRef.current - Date.now();
      if (remainingTime <= 0) {
        handleClose();
      } else {
        startTimer(remainingTime);
      }
    }
  };

  const transitionClasses = "transition-all duration-300 ease-in-out transform";
  const visibleClasses = "opacity-100 scale-100 translate-x-0 translate-y-0";

  let hiddenClasses = "opacity-0";
  if (position.includes("left")) hiddenClasses += " -translate-x-10";
  else if (position.includes("right")) hiddenClasses += " translate-x-10";
  else if (position.includes("top")) hiddenClasses += " -translate-y-10";
  else if (position.includes("bottom")) hiddenClasses += " translate-y-10";
  else if (position === "center") hiddenClasses += " scale-50";

  const isDarkMode = mode === "dark";
  const themeClasses = isDarkMode
    ? "bg-gray-800 text-white shadow-black/50"
    : "bg-white text-black shadow-gray-500";

  const titleStyle = titleTextColor ? getTextStyle(titleTextColor) : {};
  const messageStyle = messageTextColor ? getTextStyle(messageTextColor) : {};

  const containerStyle = {
    ...(backgroundColor ? { background: backgroundColor } : {}),
    ...(borderRadius ? { borderRadius } : {}),
    overflow: "hidden",
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={containerStyle}
      className={`relative flex items-center justify-between max-w-sm w-auto min-w-[300px] px-4 py-3 rounded-xl shadow-lg z-50 pointer-events-auto ${themeClasses} ${transitionClasses} ${isVisible ? visibleClasses : hiddenClasses}`}
    >
      <div className="flex items-start gap-3 overflow-hidden mr-2">
        <div
          className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full mt-0.5 ${stylePreset.bg} ${stylePreset.text} transition-transform duration-500 delay-100 ${isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-90"}`}
        >
          {stylePreset.icon}
        </div>

        <div className="flex flex-col overflow-hidden">
          {title && (
            <span style={titleStyle} className="font-bold text-sm leading-tight mb-0.5">
              {title}
            </span>
          )}
          <span style={messageStyle} className="break-words text-sm leading-normal">
            {message}
          </span>
        </div>
      </div>

      <button
        onClick={handleClose}
        style={{
          background: buttonColor || "transparent",
          color: buttonTextColor || (isDarkMode ? "#9ca3af" : "#111827"),
        }}
        className="rounded-full w-6 h-6 flex items-center justify-center hover:opacity-80 active:scale-95 transition-all text-lg cursor-pointer shrink-0"
      >
        ×
      </button>

      {/* Shrinking progress bar */}
      {safeDuration > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            height: "4px",
            background: progressColor || (stylePreset.text ? "currentColor" : "#10b981"),
            animation: `shrinkWidth ${safeDuration}ms linear forwards`,
            animationPlayState: isHovered ? "paused" : "running",
          }}
          className={stylePreset.text || ""}
        />
      )}
    </div>
  );
};

let containerCount = 0;

// Toast Container
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    containerCount++;
    if (containerCount === 1) {
      setIsPrimary(true);
    }
    const unsubscribe = toastEvents.subscribe((event) => {
      if (event.type === "ADD") {
        setToasts((prev) => [
          ...prev,
          { ...event.payload, id: Date.now() + Math.random() },
        ]);
      }
    });
    return () => {
      containerCount--;
      unsubscribe();
    };
  }, []);

  if (!isPrimary) return null;

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const groupedToasts = toasts.reduce((acc, toast) => {
    const pos = toast.position || "top-right";
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(toast);
    return acc;
  }, {});

  const positionStyles = {
    "top-left": "top-4 left-4 flex-col",
    "top-right": "top-4 right-4 flex-col",
    "bottom-left": "bottom-4 left-4 flex-col-reverse",
    "bottom-right": "bottom-4 right-4 flex-col-reverse",
    "top-center": "top-4 left-1/2 -translate-x-1/2 flex-col",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 flex-col-reverse",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col",
    "center-right": "top-1/2 right-4 -translate-y-1/2 flex-col",
    "center-left": "top-1/2 left-4 -translate-y-1/2 flex-col",
  };

  return (
    <>
      <style>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      {Object.entries(groupedToasts).map(([pos, toastsInGroup]) => (
        <div
          key={pos}
          className={`fixed z-50 flex gap-3 pointer-events-none ${positionStyles[pos] || positionStyles["top-right"]}`}
        >
          {toastsInGroup.map((toast) => (
            <ToastItem
              key={toast.id}
              {...toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      ))}
    </>
  );
};

// Main Export
const QToast = ({
  position = "top-right",
  backgroundColor,
  borderRadius,
  title,
  showTrigger = "false",
  titleTextColor,
  messageTextColor,
  message,
  duration,
  buttonColor,
  buttonTextColor,
  progressColor,
  success,
  error,
  info,
  warning,
  type,
  onClose,
  mode,
  ...rest
}) => {
  const shouldShowTrigger = showTrigger === true || showTrigger === "true";

  const triggerToast = () => {
    let resolvedType = type || "success";
    if (success === true || success === "true") resolvedType = "success";
    else if (error === true || error === "true") resolvedType = "error";
    else if (info === true || info === "true") resolvedType = "info";
    else if (warning === true || warning === "true") resolvedType = "warning";

    toastEvents.emit({
      type: "ADD",
      payload: {
        message: message || "Default Toast Message",
        position,
        backgroundColor,
        borderRadius,
        title,
        titleTextColor,
        messageTextColor,
        duration,
        buttonColor,
        buttonTextColor,
        progressColor,
        type: resolvedType,
        mode,
        onClose,
        ...rest,
      },
    });
  };

  // Trigger once on mount if there's no trigger button
  useEffect(() => {
    if (message && !shouldShowTrigger) {
      triggerToast();
    }
  }, [message]);

  return (
    <>
      <ToastContainer />
      {shouldShowTrigger && (
        <button
          onClick={triggerToast}
          style={{
            background: buttonColor || "#059669",
            color: buttonTextColor || "#ffffff",
          }}
          className="fixed bottom-16 left-1/2 -translate-x-1/2 px-5 py-2.5 font-medium rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 z-40 pointer-events-auto cursor-pointer"
        >
          Show Toast
        </button>
      )}
    </>
  );
};

QToast.success = (message, options = {}) =>
  toastEvents.emit({
    type: "ADD",
    payload: { message, type: "success", ...options },
  });

QToast.error = (message, options = {}) =>
  toastEvents.emit({
    type: "ADD",
    payload: { message, type: "error", ...options },
  });

QToast.info = (message, options = {}) =>
  toastEvents.emit({
    type: "ADD",
    payload: { message, type: "info", ...options },
  });

QToast.warning = (message, options = {}) =>
  toastEvents.emit({
    type: "ADD",
    payload: { message, type: "warning", ...options },
  });

QToast.show = (message, options = {}) =>
  toastEvents.emit({ type: "ADD", payload: { message, ...options } });

export default QToast;
