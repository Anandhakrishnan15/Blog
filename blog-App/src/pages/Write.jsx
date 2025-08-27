"use client";

import React, { useRef, useState, useCallback } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    AtomicBlockUtils,
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

/** ---------- Media renderer for Draft.js IMAGE entities ---------- */
const Media = (props) => {
    try {
        const entityKey = props.block.getEntityAt(0);
        if (!entityKey) return null;
        const entity = props.contentState.getEntity(entityKey);
        const { src, alt } = entity.getData() || {};
        if (!src) return null;

        return (
            <div className="my-4 flex justify-center">
                <img
                    src={src}
                    alt={alt || "blog image"}
                    className="max-w-full rounded-lg shadow-md"
                />
            </div>
        );
    } catch {
        return null;
    }
};

const mediaBlockRenderer = (block) => {
    if (block.getType() === "atomic") {
        return { component: Media, editable: false };
    }
    return null;
};
/** ----------------------------------------------------------------- */

export default function Write() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // get logged-in user
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    
    // set defaults

    // Cover image URL (saved to blog.image)
    const [coverImage, setCoverImage] = useState("");

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [author, setAuthor] = useState(user?.username || user?.name || "");
    const [date, setDate] = useState(today);

    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const editorRef = useRef(null);

    const focusEditor = useCallback(() => {
        if (editorRef.current) editorRef.current.focus();
    }, []);

    const handleKeyCommand = (command, editorStateArg) => {
        const newState = RichUtils.handleKeyCommand(editorStateArg, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };

    const toggleInlineStyle = (style) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    };

    const toggleBlockType = (blockType) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
    };

    const isInlineActive = (style) =>
        editorState.getCurrentInlineStyle().has(style);

    const isBlockActive = (blockType) => {
        const selection = editorState.getSelection();
        const block = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey());
        return block.getType() === blockType;
    };

    /** Insert an IMAGE entity (Cloudinary URL) as an atomic block */
    const insertImage = (src) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity("IMAGE", "IMMUTABLE", {
            src,
        });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        // Insert atomic block
        const withAtomic = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            " "
        );

        // Force focus back to editor to avoid "stuck selection"
        const newState = EditorState.forceSelection(
            withAtomic,
            withAtomic.getCurrentContent().getSelectionAfter()
        );

        setEditorState(newState);
        setTimeout(focusEditor, 0);
    };

    /** Upload helper to your backend -> Cloudinary */
    const uploadToBackend = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const token = localStorage.getItem("token");

        const res = await fetch("http://localhost:5000/api/upload", {
            method: "POST",
            headers: {
                // include auth only if your route requires it
                Authorization: token ? `Bearer ${token}` : undefined,
            },
            body: formData,
        });

        if (!res.ok) {
            throw new Error("Upload failed");
        }
        const data = await res.json();
        if (!data?.url) {
            throw new Error("No URL returned from server");
        }
        return data.url; // Cloudinary secure_url from your backend
    };

    /** Inline image upload (into the editor content) */
    const handleInlineImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await uploadToBackend(file);
            insertImage(url);
        } catch (err) {
            console.error("Inline image upload error:", err);
            alert("Image upload failed ❌");
        } finally {
            // reset the input so the same file can be re-selected if needed
            e.target.value = "";
        }
    };

    /** Cover image upload (saved to blog.image) */
    const handleCoverImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const url = await uploadToBackend(file);
            setCoverImage(url);
        } catch (err) {
            console.error("Cover image upload error:", err);
            alert("Cover image upload failed ❌");
        } finally {
            e.target.value = "";
        }
    };

    const handleSubmit = async () => {
        const content = editorState.getCurrentContent();
        const rawContent = convertToRaw(content);

        if (!title.trim()) {
            alert("Please enter a title");
            return;
        }
        if (!author.trim()) {
            alert("Please enter an author name");
            return;
        }
        if (!date) {
            alert("Please pick a date");
            return;
        }

        const blogData = {
            title,
            subtitle,
            author,
            date,
            image: coverImage || "", // <-- requires `image` in your schema
            content: rawContent, // Draft.js raw JSON that now contains Cloudinary URLs
        };

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token ? `Bearer ${token}` : undefined,
                },
                body: JSON.stringify(blogData),
            });

            const data = await res.json();

            if (res.ok) {
                alert("Blog created successfully ✅");
                navigate("/blogs");
            } else {
                alert(data.message || "Failed to create blog ❌");
            }
        } catch (err) {
            console.error("Error submitting blog:", err);
            alert("Something went wrong ❌");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-2xl p-6 space-y-6">
                {/* Cover Image */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Cover Image (optional)</h3>
                        <label className="px-3 py-1 rounded-md shadow bg-white hover:bg-teal-500 hover:text-white cursor-pointer">
                            Upload Cover
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleCoverImageUpload}
                            />
                        </label>
                    </div>
                    {coverImage ? (
                        <div className="w-full">
                            <img
                                src={coverImage}
                                alt="cover"
                                className="w-full max-h-72 object-cover rounded-xl border"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-40 border border-dashed rounded-xl flex items-center justify-center text-gray-500">
                            No cover selected
                        </div>
                    )}
                </div>

                {/* Title */}
                <input
                    type="text"
                    placeholder="Enter blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-3xl font-bold focus:outline-none border-b border-transparent focus:border-teal-500 transition"
                />

                {/* Subtitle */}
                <input
                    type="text"
                    placeholder="Enter subtitle..."
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full text-lg italic text-gray-600 focus:outline-none border-b border-transparent focus:border-teal-400 transition"
                />

                {/* Author + Date */}
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Author name"
                        value={author}
                        readOnly
                        // onChange={(e) => setAuthor(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                        type="date"
                        value={date}
                        readOnly
                        // onChange={(e) => setDate(e.target.value)}
                        className="rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                </div>

                {/* Toolbar */}
                <div className="flex gap-2 flex-wrap bg-gray-100 p-2 rounded-lg shadow-inner">
                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isInlineActive("BOLD")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleInlineStyle("BOLD");
                        }}
                    >
                        Bold
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isInlineActive("ITALIC")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleInlineStyle("ITALIC");
                        }}
                    >
                        Italic
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isBlockActive("header-one")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlockType("header-one");
                        }}
                    >
                        H1
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isBlockActive("header-two")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlockType("header-two");
                        }}
                    >
                        H2
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isBlockActive("unordered-list-item")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlockType("unordered-list-item");
                        }}
                    >
                        • List
                    </button>

                    <button
                        className={`px-3 py-1 rounded-md shadow transition ${isBlockActive("ordered-list-item")
                                ? "bg-gray-700 text-white"
                                : "bg-white hover:bg-teal-500 hover:text-white"
                            }`}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            toggleBlockType("ordered-list-item");
                        }}
                    >
                        1. List
                    </button>

                    {/* Inline Image Upload
                    <label className="px-3 py-1 rounded-md shadow bg-white hover:bg-teal-500 hover:text-white cursor-pointer">
                        Add Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleInlineImageUpload}
                        />
                    </label> */}
                </div>

                {/* Editor */}
                <div
                    className="border border-gray-300 rounded-lg min-h-[200px] p-4 bg-white shadow-inner"
                    onClick={focusEditor}
                >
                    <Editor
                        ref={editorRef}
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        onChange={setEditorState}
                        blockRendererFn={mediaBlockRenderer}
                        placeholder="Start writing your blog..."
                    />
                </div>

                {/* Submit button */}
                <button
                    onClick={handleSubmit}
                    className="w-full mt-4 bg-teal-600 text-white py-3 rounded-xl shadow hover:bg-teal-700 transition"
                >
                    Submit Blog
                </button>
            </div>
        </div>
    );
}
