import React, { useState } from "react";

// Utility functions (the same ones you provided)
export function kebabToCamel(str) {
    let spliced = str.split("");
    for (let i = 0; i < spliced.length; i++) {
        if (spliced[i] === "-" && spliced[i + 1] != null) {
            spliced[i + 1] = spliced[i + 1].toUpperCase();
            spliced.splice(i, 1);
            i--;
        }
    }
    return spliced.join("");
}

export function changeCase(str, changeTo) {
    if (str == null) return;
    switch (changeTo) {
        case "camel":
        case "pascal":
            return toCamelOrPascalCase(str, changeTo);
        case "snake":
        case "kebab":
        case "scream":
            return toSnakeOrKebabOrScreamCase(str, changeTo);
        case "upper":
        case "lower":
            return toUpperOrLowerCase(str, changeTo);
        default:
            throw new Error(`Invalid case: ${changeTo}`);
    }
}

export function toCamelOrPascalCase(str, changeTo) {
    let result = str
        .split(/[-_ ]+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join("");
    return changeTo === "camel" ? result.charAt(0).toLowerCase() + result.slice(1) : result;
}

export function toUpperOrLowerCase(str, changeTo) {
    let result = str.replace(/[-_ ]+/g, "");
    return changeTo === "upper" ? result.toUpperCase() : result.toLowerCase();
}

export function toSnakeOrKebabOrScreamCase(str, changeTo) {
    let separator = changeTo === "kebab" ? "-" : "_";
    let result = str.split(/[-_ ]+/).join(separator);
    if (changeTo === "scream") {
        result = result.toUpperCase();
    }
    return result.toLocaleLowerCase();
}

export function kebabToSpacedPascal(str) {
    if (str == null) return "";
    let spliced = str.split("-");
    let upperCasedFirstChars = spliced.map((str) => {
        return spice(str, 0, 1, str[0].toUpperCase());
    });
    return upperCasedFirstChars.join(" ");
}

// Splice function and other helpers (same as in your code)
export function spice(string, start, deleteCount, insertString = "") {
    return string.slice(0, start) + (insertString || "") + string.slice(start + (deleteCount || 0));
}

// React component that uses these utilities
const StringManipulator = () => {
    const [input, setInput] = useState("");
    const [result, setResult] = useState("");
    const [selectedCase, setSelectedCase] = useState("camel");

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleCaseChange = (event) => {
        setSelectedCase(event.target.value);
    };

    const handleConvert = () => {
        setResult(changeCase(input, selectedCase));
    };

    return (
        <div className="container">
            <h2>String Manipulator</h2>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Enter your string"
            />
            <div>
                <label htmlFor="case-select">Choose case:</label>
                <select id="case-select" value={selectedCase} onChange={handleCaseChange}>
                    <option value="camel">Camel Case</option>
                    <option value="pascal">Pascal Case</option>
                    <option value="snake">Snake Case</option>
                    <option value="kebab">Kebab Case</option>
                    <option value="scream">Scream Case</option>
                    <option value="upper">Upper Case</option>
                    <option value="lower">Lower Case</option>
                </select>
            </div>
            <button onClick={handleConvert}>Convert</button>
            {result && (
                <div>
                    <h3>Converted String:</h3>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
};

export default StringManipulator;
