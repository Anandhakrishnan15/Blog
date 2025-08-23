"use client";

import React, { useState } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    convertToRaw,
    AtomicBlockUtils,
    Modifier
} from "draft-js";
import "draft-js/dist/Draft.css";
import { useNavigate } from "react-router-dom";

export default function Write() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [author, setAuthor] = useState("");
    const [date, setDate] = useState("");
    
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const handleKeyCommand = (command, editorState) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
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

    // Insert image
    const insertImage = (src) => {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            "IMAGE",
            "IMMUTABLE",
            { src }
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            " "
        );
        setEditorState(newEditorState);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            insertImage(reader.result); // Base64 string
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        const content = editorState.getCurrentContent();
        const rawContent = convertToRaw(content);

        const blogData = {
            title,
            subtitle,
            author,
            date,
            content: rawContent,
        };

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/blogs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
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
                        onChange={(e) => setAuthor(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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

                    {/* Image Upload */}
                    <label className="px-3 py-1 rounded-md shadow bg-white hover:bg-teal-500 hover:text-white cursor-pointer">
                        Add Image
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>

                {/* Editor */}
                <div className="border border-gray-300 rounded-lg min-h-[200px] p-4 bg-white shadow-inner">
                    <Editor
                        editorState={editorState}
                        handleKeyCommand={handleKeyCommand}
                        onChange={setEditorState}
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
