import React, { useState, useEffect } from "react";

// Toast component
const Toast = ({ message = "Defaut Toast Message", duration = 3000, position = "top-right", onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  const appliedPosition = positionClasses[position] ?? positionClasses["top-right"];

  return (
    <>
    <div className={`fixed ${appliedPosition} bg-blue-500 text-white px-4 py-2 rounded shadow-lg flex items-center justify-between w-72`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 bg-white text-blue-500 rounded px-2 py-1 hover:bg-red-500 hover:text-white transition">
        <h1>X</h1>
      </button>
    </div>
   
    </>
  )
};

//handle multiple toasts
const ToastManager = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, duration, position) => {
    const id = Date.now();
    setToasts([...toasts, { id, message, duration, position }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter((toast) => toast.id !== id));
  };

  return (
    <>
<div className="fixed bottom-4 left-4 flex space-x-2">

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}

       <button onClick={() => addToast()} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
        Show Toast
    </button>

</div>
    </>
    
  );
};

export default ToastManager;

