// Piston API is a service for code execution.

// This code goes in your FRONTEND component,
// (e.g., in an onClick handler for a "Run" button).

export async function executeCode(
  language: string,
  source: string
): Promise<{ success: boolean; output?: string; error?: string }> {
  try {
    // 1. This calls your new backend route at /api/execute
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/execute`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 2. You send the language and source in the body
        body: JSON.stringify({
          language: language,
          source: source,
        }),
      }
    );

    // 3. You get the result back from your backend
    // const result = await response.json();

   if (!response.ok) {
            return {
                success:false,
                error:`Error executing code: ${response.statusText}`
            }
        }
    
        const result = await response.json();
        const output = result.run.output || "";
        const stderr = result.run.stderr || "";
    
        if(stderr){
            return {
                success:false,
                output: output,
                error: stderr
            }
        }
    
        return {
            success:true,
            output: output || "No output",
        }
  } catch (error) {
    return {
        success: false,
        error: `Failed to execute code: ${error}`,
        };
    // console.error("Failed to connect to server:", error);
    // setOutput("Failed to connect to server. Is it running?");
  }
}

// --- Example of how you'd use it in your UI ---
//
// const [code, setCode] = useState("print('Hello, world!')");
// const [language, setLanguage] = useState("python");
//
// <button onClick={() => handleRunCode(language, code)}>
//   Run Code
// </button>

// const PISTON_API_URL = 'https://emkc.org/api/v2/piston';

// interface LanguageVersion{
//     [key: string]: {language: string; version: string};
// }

// const LANGUAGE_VERSIONS:LanguageVersion = {
//     javascript: {language:"javascript", version: "18.15.10"},
//     python: {language:"python", version: "3.11.4"},
//     java: {language:"java", version: "20.0.2"},
// }

// export async function executeCode(language: string, source: string): Promise<{success:boolean; output?:string; error?:string}> {
//     try{

//         const langConfig = LANGUAGE_VERSIONS[language.toLowerCase()];
//         if (!langConfig) {
//             throw new Error(`Unsupported language: ${language}`);
//         }
//         const response = await fetch(`${PISTON_API_URL}/execute`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 language: langConfig.language,
//                 version: langConfig.version,
//                 files:[
//                     {
//                         name: `main.${getFileExtension(language)}`,
//                         content: source
//                     }
//                 ]
//             })
//         });
    
//         if (!response.ok) {
//             return {
//                 success:false,
//                 error:`Error executing code: ${response.statusText}`
//             }
//         }
    
//         const result = await response.json();
//         const output = result.run.output || "";
//         const stderr = result.run.stderr || "";
    
//         if(stderr){
//             return {
//                 success:false,
//                 output: output,
//                 error: stderr
//             }
//         }
    
//         return {
//             success:true,
//             output: output || "No output",
//         }
//     }
//     catch(error){
//         return {
//         success: false,
//         error: `Failed to execute code: ${error}`,
//         };
//     }
// }

// function getFileExtension(lanaguage: string): string {
//     switch (lanaguage.toLowerCase()) {
//         case 'javascript':
//             return 'js';
//         case 'python':
//             return 'py';
//         case 'java':
//             return 'java';
//         default:
//             return 'txt';
//     }
// }