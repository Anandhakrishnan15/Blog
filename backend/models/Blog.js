const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        author: { type: String, required: true },
        content: { type: Object, required: true }, // Draft.js raw JSON
        date: { type: String, required: true },

        // 🔹 Add main image (cover/thumbnail)
        image: { type: String, default: "" }, // Cloudinary URL

        // 🔹 If you want multiple images
        images: [{ type: String }], // Array of Cloudinary URLs

        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        views: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
                date: { type: Date, default: Date.now }
            }
        ]


    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
