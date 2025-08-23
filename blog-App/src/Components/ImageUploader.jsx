import React, { useState, useEffect } from "react";

const ImageUploader = () => {
    const [image, setImage] = useState("");

    // Load image from localStorage on mount
    useEffect(() => {
        const savedImage = localStorage.getItem("uploadedImage");
        if (savedImage) {
            setImage(savedImage);
        }
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            setImage(base64Image);
            localStorage.setItem("uploadedImage", base64Image);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        localStorage.removeItem("uploadedImage");
        setImage("");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mb-4"
                />

                {image ? (
                    <div className="relative">
                        <img
                            src={image}
                            alt="Uploaded Preview"
                            className="w-full h-auto rounded-lg border border-gray-300 shadow-sm"
                        />
                        <button
                            onClick={handleRemoveImage}
                            className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                        >
                            Remove Image
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center">No image uploaded.</p>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
