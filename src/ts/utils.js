// Function to convert Markdown to HTML using MarkdownIt
function convertMarkdownToHtml(markdownContent) {
    const md = new markdownit(); // MarkdownIt library instance
    return md.render(markdownContent);
}

// Function to delete token and id from localStorage
function deleteTokenAndId(token, id) {
    if (!token || !id) return;
    localStorage.removeItem(token);
    localStorage.removeItem(id);
}

// Handle Markdown conversion and display
function handleConvertMarkdown() {
    const markdownInput = document.getElementById("markdown-input").value;
    const htmlContent = convertMarkdownToHtml(markdownInput);
    document.getElementById("html-output").innerHTML = htmlContent;
}

// Handle clearing token and ID
function handleClearData() {
    const token = "user-token"; // Replace with your actual token key
    const id = "user-id"; // Replace with your actual ID key
    deleteTokenAndId(token, id);
    alert("Token and ID have been deleted from localStorage");
}

// Set up event listeners after DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
    document
        .getElementById("convert-button")
        .addEventListener("click", handleConvertMarkdown);
    document
        .getElementById("clear-button")
        .addEventListener("click", handleClearData);
});
