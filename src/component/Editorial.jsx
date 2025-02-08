import React from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // Dark syntax highlighting style
import { FaRegCopy } from "react-icons/fa";

// Configure marked to use highlight.js
marked.setOptions({
  highlight: (code, lang) => {
    return lang ? hljs.highlight(code, { language: lang }).value : hljs.highlightAuto(code).value;
  },
});

// Function to copy code to clipboard
const handleCopy = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    alert("Code copied to clipboard! 🚀");
  });
};

const convertMarkdownToHtml = (markdown) => {
  if (typeof markdown !== "string") {
    console.error("Expected a string for Markdown data, but received:", markdown);
    return "<p>Error: Invalid Markdown data.</p>";
  }
  return marked(markdown);
};

const Editorial = ({ data }) => {
  const markdownContent = data.editorial_body || "";

  return (
    <div className="p-6 bg-[#1e1e1e] border-[#3e3e3e] shadow-lg rounded-lg ">
      <h1 className="text-3xl font-bold mb-6 text-white ">Editorial</h1>
      <div
        id="description-body"
        className="prose prose-invert mb-8 text-white "
        dangerouslySetInnerHTML={{
          __html: convertMarkdownToHtml(markdownContent),
        }}
      ></div>

      {/* Code Snippet Section */}
      <div className="mt-6 " >
        <h2 className="text-2xl font-semibold mb-4">Code Snippet</h2>
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-white ">JavaScript Code</span>
            <button
              onClick={() =>
                handleCopy(`function twoSum(nums, target) {
  const numMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
}`)
              }
              className="flex items-center bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <FaRegCopy className="mr-1" />
              Copy
            </button>
          </div>
          <div className="overflow-x-auto">
            <pre className="bg-gray-900 rounded-lg p-4 text-white">
              <code className="language-javascript">
                {`function twoSum(nums, target) {
  const numMap = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap.has(complement)) {
      return [numMap.get(complement), i];
    }
    numMap.set(nums[i], i);
  }
}`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editorial;
