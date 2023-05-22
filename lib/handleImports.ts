import axios from "axios";

export default async function handleImports(sourceCode: string, sourcePath?: string) {
    const sources: { [fileName: string]: { content: any; }; } = {};
    const importRegex = /import\s+["']([^"']+)["'];/g;
    const matches = Array.from(sourceCode.matchAll(importRegex));
    for (const match of matches) {
        const importPath = match[1]
        const { sources: importedSources, sourceCode: mainSourceCode } = await fetchImport(importPath, sourcePath);

        // Merge the imported sources into the main sources object
        Object.assign(sources, importedSources);

        let sourceFileName = importPath.split("/").pop() || importPath;
        // If a file with the same name already exists in the sources object, append a unique identifier
        let uniqueIdentifier = 0;
        while (sources[sourceFileName]) {
            sourceFileName = `${sourceFileName}_${uniqueIdentifier}`;
            uniqueIdentifier++;
        }
        sources[sourceFileName] = {
            content: mainSourceCode,
        };
        sourceCode = sourceCode.replace(match[0], `import "${sourceFileName}";`);
    }
    return { sources, sourceCode };
}


async function fetchImport(importPath: string, sourcePath?: string) {
    // Determine the URL to fetch
    let urlToFetch;
    if (importPath[0] === '.' && sourcePath) {
        // If the import path starts with '.', it's a relative path, so remove the last path component from the source path and append the import path
        urlToFetch = `${sourcePath.split('/').slice(0, -1).join('/')}/${importPath}`;
    } else if (importPath[0] !== '@') {
        // If the import path starts with anything other than '@', use it directly
        urlToFetch = importPath;
    } else {
        // Otherwise, convert the import path to an unpkg URL
        urlToFetch = `https://unpkg.com/${importPath}`;
    }


    // Fetch the imported file
    const response = await axios.get(urlToFetch);
    let importedSource = response.data;

    // Handle any imports within the fetched source code
    const { sources, sourceCode } = await handleImports(importedSource, urlToFetch);

    return { sources, sourceCode };
}