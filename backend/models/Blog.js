const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        subtitle: { type: String },
        author: { type: String, required: true },
        content: { type: Object, required: true }, // Draft.js raw JSON
        date: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
