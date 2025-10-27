import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { EDITOR_TOOLS } from "@/utils/constants";

const RichTextEditor = ({ 
  value = "",
  onChange,
  placeholder = "Tell your story...",
  className,
  showToolbar = true
}) => {
  const [content, setContent] = useState(value);
  const [showFloatingToolbar, setShowFloatingToolbar] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const editorRef = useRef(null);
  const toolbarRef = useRef(null);
  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      if (onChange) {
        onChange(newContent);
      }
    }
  };

  const handleSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
if (selectedText && editorRef.current?.contains(selection.anchorNode)) {
      setSelectedText(selectedText);
      setShowFloatingToolbar(true);
      
      // Position toolbar near selection
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (toolbarRef.current) {
        toolbarRef.current.style.top = `${rect.top - 50}px`;
        toolbarRef.current.style.left = `${rect.left + rect.width / 2}px`;
      }
    } else {
      setShowFloatingToolbar(false);
      setSelectedText("");
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  const formatText = (format) => {
    switch (format) {
      case "bold":
        executeCommand("bold");
        break;
      case "italic":
        executeCommand("italic");
        break;
      case "underline":
        executeCommand("underline");
        break;
      case "heading1":
        executeCommand("formatBlock", "h1");
        break;
      case "heading2":
        executeCommand("formatBlock", "h2");
        break;
      case "quote":
        executeCommand("formatBlock", "blockquote");
        break;
      case "list":
        executeCommand("insertUnorderedList");
        break;
      case "numberedList":
        executeCommand("insertOrderedList");
        break;
      case "link":
        insertLink();
        break;
      case "image":
        insertImage();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener("selectionchange", handleSelection);
    return () => {
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, []);

  return (
    <div className={cn("relative", className)}>
{/* Floating Toolbar */}
      <AnimatePresence>
        {showToolbar && showFloatingToolbar && (
          <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-50 bg-gray-900 dark:bg-slate-800 text-white rounded-lg shadow-xl border border-gray-700 dark:border-slate-600 p-2 flex items-center gap-1 transform -translate-x-1/2"
          >
            {EDITOR_TOOLS.slice(0, 6).map((tool) => (
              <button
                key={tool.name}
                onClick={() => formatText(tool.name)}
                className="p-2 hover:bg-gray-700 dark:hover:bg-slate-700 rounded transition-colors"
                title={`${tool.name} (${tool.shortcut})`}
              >
                <ApperIcon name={tool.icon} className="w-4 h-4" />
              </button>
            ))}
            
            <div className="w-px h-6 bg-gray-600 dark:bg-slate-600 mx-1" />
            
            <button
              onClick={() => formatText("link")}
              className="p-2 hover:bg-gray-700 dark:hover:bg-slate-700 rounded transition-colors"
              title="Add link"
            >
              <ApperIcon name="Link" className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => formatText("image")}
              className="p-2 hover:bg-gray-700 dark:hover:bg-slate-700 rounded transition-colors"
              title="Add image"
            >
              <ApperIcon name="Image" className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toolbar */}
      {showToolbar && (
        <div className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1">
              {EDITOR_TOOLS.slice(0, 3).map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText(tool.name)}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <ApperIcon name={tool.icon} className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600" />

            <div className="flex items-center gap-1">
              {EDITOR_TOOLS.slice(3, 5).map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText(tool.name)}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <ApperIcon name={tool.icon} className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600" />

            <div className="flex items-center gap-1">
              {EDITOR_TOOLS.slice(5, 8).map((tool) => (
                <Button
                  key={tool.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => formatText(tool.name)}
                  title={`${tool.name} (${tool.shortcut})`}
                >
                  <ApperIcon name={tool.icon} className="w-4 h-4" />
                </Button>
              ))}
            </div>

            <div className="w-px h-6 bg-gray-300 dark:bg-slate-600" />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={insertLink}
                title="Add link (Ctrl+K)"
              >
                <ApperIcon name="Link" className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={insertImage}
                title="Add image (Ctrl+M)"
              >
                <ApperIcon name="Image" className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className={cn(
          "min-h-[400px] max-w-none prose prose-lg prose-gray dark:prose-invert focus:outline-none",
          "prose-headings:font-serif prose-headings:text-gray-900 dark:prose-headings:text-slate-100",
          "prose-p:text-gray-800 dark:prose-p:text-slate-200 prose-p:leading-relaxed prose-p:text-lg",
          "prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline",
          "prose-blockquote:border-primary-200 dark:prose-blockquote:border-primary-800 prose-blockquote:text-gray-600 dark:prose-blockquote:text-slate-400",
          "prose-code:text-primary-600 dark:prose-code:text-primary-400 prose-code:bg-gray-100 dark:prose-code:bg-slate-800",
          "prose-strong:text-gray-900 dark:prose-strong:text-slate-100",
          "prose-em:text-gray-800 dark:prose-em:text-slate-200",
          "editor-content"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {content.length === 0 && (
        <div className="absolute top-0 left-0 text-gray-400 dark:text-slate-500 pointer-events-none text-lg">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;