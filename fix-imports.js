import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(__filename);

// Main function that will run asynchronously
async function main() {
function fixDuplicateReactImports(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check for duplicate React imports
    const reactImportLines = [];
    const reactImportIndices = [];
    
    lines.forEach((line, index) => {
      if (line.match(/^\s*import\s+React\b.*from\s+['"]react['"]/)) {
        reactImportLines.push(line);
        reactImportIndices.push(index);
      }
    });
    
    // If there are duplicate React imports
    if (reactImportLines.length > 1) {
      console.log(`Fixing duplicate React imports in ${filePath}`);
      
      // Merge imports if needed
      let mergedImport = reactImportLines[0];
      
      // Check if we need to merge named imports
      const namedImports = reactImportLines
        .map(line => {
          const match = line.match(/import\s+React,\s*{([^}]*)}\s+from\s+['"]react['"]/);
          return match ? match[1].trim() : '';
        })
        .filter(Boolean);
      
      if (namedImports.length > 0) {
        // Create a merged import with all named imports
        const allNamedImports = namedImports
          .join(', ')
          .split(',')
          .map(imp => imp.trim())
          .filter(Boolean)
          .filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates
          .join(', ');
        
        mergedImport = `import React, { ${allNamedImports} } from 'react';`;
      }
      
      // Remove all React imports
      reactImportIndices.reverse().forEach(index => {
        lines.splice(index, 1);
      });
      
      // Add the merged import at the first position
      lines.unshift(mergedImport);
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, lines.join('\n'));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
    return false;
  }
}

// Find all JS and JSX files in the src directory
const files = await glob('src/**/*.{js,jsx}', {
  cwd: path.resolve(dirname),
  absolute: true
});

let fixedCount = 0;

// Process each file
files.forEach(file => {
  if (fixDuplicateReactImports(file)) {
    fixedCount++;
  }
});

console.log(`\nCompleted! Fixed duplicate React imports in ${fixedCount} files.`);
console.log('Run "npm run dev" to verify that the build errors are resolved.');
}

// Execute the main function
main().catch(error => console.error('Error:', error));