import React, { useState } from "react";

const Popup = ({ position = "center" }) => {
  const [showPopup, setShowPopup] = useState(false);

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

  return (
    <div className="relative h-screen bg-gray-100">
      {showPopup && (
        
        <div className="fixed inset-0 bg-opacity-50 z-40">
          <div className={`absolute bg-white p-6 rounded-lg shadow-lg w-96 z-50 ${appliedPosition}`}>
            <h2 className="text-xl font-semibold mb-4">Popup</h2>
            <p className="mb-4">This popup is positioned at {position}.</p>

            <button onClick={() => setShowPopup(false)} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Close
            </button>
            
          </div>
        </div>
      )}

      <button
        onClick={() => setShowPopup(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Show Popup
      </button>
    </div>
  );
};

export default Popup;
