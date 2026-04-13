#!/usr/bin/env node 

import { argv } from 'node:process';
import { statSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Check if the regex pattern provided as command line argument is present and successfully resolves into a valid JS regex 
function checkIfValidRegexEntered(pattern) {
    if (!pattern) { //Check if a command line argument for regex was enetered or not;
        console.error("Error: No regex pattern provided.");
        console.error("Usage: node grep.mjs <pattern> <file1> <file2> ...");
        process.exit(1); // exit with a non-zero code to signal failure
    }
    try {
        pattern = new RegExp(pattern);
        return pattern;
    } catch (e) {
        console.error(`Error: Invalid regex pattern — ${e.message}`);
        process.exit(1);
    }
}

// Check if atleast one file or directory was provided as an argument in the command line
function returnAllFileNames(args) { //In unix everything is considered as a file, hence it also returns "directories"
    if (!Array.isArray(args) || args.length === 0) {
        console.error("Error: No files provided.");
        console.error("Usage: node grep.mjs <pattern> <file1> <file2> ...");
        process.exit(1);
    }
    return args;
}

// Recursively resolve all file paths from a mixed list of files and directories
function resolveAllFiles(paths) {
    let results = [];

    paths.forEach(currentPath => {
        if (!currentPath) {
            console.log("No filenames / directories present in the path");
            return;
        }

        try {
            const stats = statSync(currentPath);

            if (stats.isFile()) {
                results.push(currentPath);
            } else if (stats.isDirectory()) {
                const entries = readdirSync(currentPath);
                const fullPaths = entries.map(entry => join(currentPath, entry)); //Construct full paths
                const nestedFiles = resolveAllFiles(fullPaths);
                results.push(...nestedFiles);
            }
        } catch (e) {
            console.error(`Error accessing path "${currentPath}": ${e.message}`);
        }
    });

    return results;
}

// Search each file for the regex pattern and print the filename if a match is found
function searchFiles(files, pattern) {
    files.forEach(filePath => {
        try {
            const content = readFileSync(filePath, 'utf-8');
            if (pattern.test(content)) {
                console.log(filePath);
            }
        } catch (e) {
            console.error(`Error reading file "${filePath}": ${e.message}`);
        }
    });
}

// --- Entry point ---
const pattern = checkIfValidRegexEntered(argv[2]);
const rawPaths = returnAllFileNames(argv.slice(3));
const allFiles = resolveAllFiles(rawPaths);
searchFiles(allFiles, pattern);
