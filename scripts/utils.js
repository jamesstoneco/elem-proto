import fs from 'fs'

/**
 * Shared utility functions for sketch generation and incrementing
 */

/**
 * Convert a hyphenated string to a valid JavaScript identifier
 * Handles multiple hyphens, numbers, and edge cases
 * @param {string} name - The hyphenated name to convert
 * @returns {string} - Valid JavaScript identifier
 */
export function toValidIdentifier(name) {
    if (!name || typeof name !== 'string') return 'Component';
    // Remove hyphens and underscores
    let id = name.replace(/[-_]/g, '');
    // Check for allowed characters (ASCII letters and digits only)
    if (!/^[a-zA-Z0-9]+$/.test(id)) return 'Component';
    // Prefix with _ if starts with digit
    if (/^[0-9]/.test(id)) id = '_' + id;
    return id;
}

/**
 * Convert a string to kebab-case for URL generation
 * @param {string} str - The string to convert
 * @returns {string} - Kebab-case string
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
        .replace(/[-_]+/g, '-') // normalize separators
        .toLowerCase();
}

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generate a Ladle story URL from a filename
 * @param {string} filename - The filename (without extension)
 * @returns {string} - The Ladle story URL
 */
export function generateStoryUrl(filename) {
    const storyName = toKebabCase(filename);
    return `http://localhost:61000/?story=${storyName}--default`;
}

/**
 * Check if a file exists
 * @param {string} filePath - The file path to check
 * @returns {boolean} - True if file exists
 */
export function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

/**
 * Update the import path in a story file
 * @param {string} storyFilePath - Path to the story file
 * @param {string} oldBase - Old filename (without extension)
 * @param {string} newBase - New filename (without extension)
 * @returns {boolean} - True if successful
 */
export function updateStoryImport(storyFilePath, oldBase, newBase) {
    try {
        let content = fs.readFileSync(storyFilePath, 'utf8');
        // Update the import path to use the new file name
        content = content.replace(`from './${oldBase}'`, `from './${newBase}'`);
        fs.writeFileSync(storyFilePath, content);
        return true;
    } catch (error) {
        console.log(`⚠️  Could not update import in story file: ${error.message}`);
        return false;
    }
}