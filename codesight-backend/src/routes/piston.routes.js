import express from 'express';
import fetch from 'node-fetch' // Make sure to install node-fetch: npm install node-fetch
const router = express.Router();

// --- Helper Constants (MOVED TO BACKEND) ---
const LANGUAGE_VERSIONS = {
    javascript: { language: "javascript", version: "18.15.0" },
    typescript: { language: "typescript", version: "5.0.3" },
    python: { language: "python", version: "3.10.0" },
    java: { language: "java", version: "15.0.2" },
    csharp: { language: "csharp", version: "6.12.0" },
    go: { language: "go", version: "1.16.2" },
    // Add other languages here
};

const getFileExtension = (language) => {
    switch (language.toLowerCase()) {
        case "javascript":
            return "js";
        case "typescript":
            return "ts";
        case "python":
            return "py";
        case "java":
            return "java";
        case "csharp":
            return "cs";
        case "go":
            return "go";
        default:
            // Fallback for languages not explicitly listed
            return "txt";
    }
};

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

// --- The API Route ---
// This will be mounted at /api/execute (or wherever you mount it in server.js)
router.post("/", async (req, res) => {
    // 1. Get language and source from your frontend's request
    const { language, source } = req.body;

    if (!language || !source) {
        return res.status(400).json({ error: "Language and source are required." });
    }

    try {
        // 2. Find the language config
        const langConfig = LANGUAGE_VERSIONS[language.toLowerCase()];
        if (!langConfig) {
            return res.status(400).json({ error: `Unsupported language: ${language}` });
        }

        // 3. Call the Piston API (Server-to-Server = NO CORS)
        const response = await fetch(PISTON_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: langConfig.language,
                version: langConfig.version,
                files: [
                    {
                        name: `main.${getFileExtension(language)}`,
                        content: source,
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            // 4a. Send Piston's error back to your frontend
            return res
                .status(response.status)
                .json({ error: `Piston API Error: ${errorText}` });
        }

        const result = await response.json();

        if (result.run && result.run.output) {
            let output = result.run.output;

            // 1. Trim trailing newline from all languages
            output = output.trim();

            // 2. Apply special formatting for JavaScript (Node.js)
            if (language.toLowerCase() === "javascript") {
                output = output
                    .replace(/'/g, '"') // Change single quotes to double quotes
                    .replace(/\[ /g, "[") // Remove space after opening bracket
                    .replace(/ \]/g, "]") // Remove space before closing bracket
                    .replace(/, /g, ","); // Remove space after comma
            }

            // 3. Update the result object with the clean output
            result.run.output = output;

        }
        // 4b. Send Piston's result back to your frontend
        return res.status(200).json(result);

    } catch (error) {
        // 4c. Send your own server's error back to your frontend
        return res.status(500).json({ error: `Server Error: ${error.message}` });
    }
});

export default router;