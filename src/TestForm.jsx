import React, { useState } from "react";
import QToast from "./QToast"; // Adjust the import path as needed

const TestForm = () => {
    const [showToast, setShowToast] = useState(false);

    const handleTriggerToast = () => {
        setShowToast(true);
    };

    return (
        <div className=" bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Toast Demo</h2>
                <button
                    onClick={handleTriggerToast}
                    className="px-6 py-3 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                    Show Toast
                </button>

                <QToast
                    show={showToast}
                    mode="light"
                    success="true"
                    message="This is a toast notification!"
                    duration={3000}
                    position="top-right"
                    onClose={() => setShowToast(false)}
                />
            </div>
        </div>
    );
};

export default TestForm;