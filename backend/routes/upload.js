const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const fileBuffer = req.file.buffer.toString("base64");
        const result = await cloudinary.uploader.upload(
            `data:${req.file.mimetype};base64,${fileBuffer}`,
            { folder: "blogs" } // Optional: store in "blogs" folder
        );

        res.json({ url: result.secure_url });
    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        res.status(500).json({ message: "Upload failed ❌" });
    }
});

module.exports = router;
