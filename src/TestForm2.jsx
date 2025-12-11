import React, { useState } from "react";
import QToast from "./QToast";

const TestForm2 = () => {
    const [formData, setFormData] = useState({ name: "" }); // Simple state for form input
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return; // Basic validation

        setIsSubmitting(true);
        try {
            // Simulate API call or form submission
            await new Promise((resolve) => setTimeout(resolve, 800)); // Fake delay for realism

            // On success, trigger toast
            setShowSuccessToast(true);
            setFormData({ name: "" }); // Reset form
        } catch (error) {
            // Handle error (optional: show error toast)
            console.error("Submission failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Test Form</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !formData.name.trim()}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </button>
            </form>

            <QToast
                show={showSuccessToast}
                success="true"
                mode="dark"
                message={`submitted successfully.`}
                duration="4000"
                position="top-left"
                onClose={() => setShowSuccessToast(false)}
            />
        </div>
    );
};

export default TestForm2;