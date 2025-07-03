#!/usr/bin/env node

/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'
import { exec } from 'child_process'
import { promisify } from 'util'


const execAsync = promisify(exec)

const __filename = fileURLToPath(
    import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, '..')
const SKETCHES_DIR = path.join(PROJECT_ROOT, 'src', 'sketches')
const TEMPLATES_DIR = path.join(__dirname, 'templates')

// Create readline interface for prompts
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve)
    })
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Convert a hyphenated string to a valid JavaScript identifier
 * Handles multiple hyphens, numbers, and edge cases
 * @param {string} name - The hyphenated name to convert
 * @returns {string} - Valid JavaScript identifier
 */
function toValidIdentifier(name) {
    if (!name || typeof name !== 'string') return 'Component';
    // Remove hyphens and underscores
    let id = name.replace(/[-_]/g, '');
    // Check for allowed characters (ASCII letters and digits only)
    if (!/^[a-zA-Z0-9]+$/.test(id)) return 'Component';
    // Prefix with _ if starts with digit
    if (/^[0-9]/.test(id)) id = '_' + id;
    return id;
}

function parseSketchName(name) {
    // Check if name contains a path separator (folder structure)
    if (name.includes('/')) {
        const parts = name.split('/')
        const folder = parts.slice(0, -1).join('/')
        const sketchName = parts[parts.length - 1]
        return { folder, sketchName }
    }
    return { folder: '', sketchName: name }
}

function findLastNumberedSketch(folder = '') {
    const targetDir = folder ? path.join(SKETCHES_DIR, folder) : SKETCHES_DIR

    if (!fs.existsSync(targetDir)) {
        return { nextNumber: 1, prefix: 'sketch' }
    }

    const files = fs.readdirSync(targetDir)
    const sketchFiles = files.filter(file =>
        file.endsWith('.tsx') &&
        !file.endsWith('.stories.tsx')
    )

    if (sketchFiles.length === 0) {
        return { nextNumber: 1, prefix: 'sketch' }
    }

    // Debug logging
    console.log(`🔍 Looking for numbered sketches in folder: ${folder}`)
    console.log(`📁 Found sketch files:`, sketchFiles)

    // Look for numbered patterns like i001, v002, synth-001, etc.
    let maxNumber = 0
    let prefix = 'sketch'

    sketchFiles.forEach(file => {
        // Special handling for mySynth folder - look for Synth-i### pattern
        if (folder === 'mySynth') {
            const match = file.match(/^Synth-i(\d+)$/i)
            if (match) {
                const num = parseInt(match[1])
                console.log(`✅ Found Synth-i pattern: ${file} -> number: ${num}`)
                if (num > maxNumber) {
                    maxNumber = num
                    prefix = 'Synth-i'
                }
                return
            }
        }

        // Try different patterns: i001, v002, synth-001, sketch001, etc.
        const patterns = [
            /^(i|v|synth|sketch)(\d+)/i,
            /^([a-zA-Z]+)-(\d+)/i,
            /^([a-zA-Z]+)(\d+)/i
        ]

        for (const pattern of patterns) {
            const match = file.match(pattern)
            if (match) {
                const num = parseInt(match[2])
                console.log(`✅ Found pattern: ${file} -> number: ${num}`)
                if (num > maxNumber) {
                    maxNumber = num
                    prefix = match[1]
                }
                break
            }
        }
    })

    console.log(`🎯 Result: nextNumber=${maxNumber + 1}, prefix=${prefix}`)
    return { nextNumber: maxNumber + 1, prefix }
}

function generateDefaultName(folder = '') {
    const { nextNumber, prefix } = findLastNumberedSketch(folder)
    const paddedNumber = nextNumber.toString().padStart(3, '0')

    // Special handling for mySynth folder - use Synth-i### convention
    if (folder === 'mySynth') {
        return `Synth-i${paddedNumber}`
    }

    if (prefix === 'sketch') {
        return `${prefix}${paddedNumber}`
    } else {
        return `${prefix}-${paddedNumber}`
    }
}

function fileExists(filePath) {
    return fs.existsSync(filePath)
}

function cleanupSwapFiles() {
    if (!fs.existsSync(SKETCHES_DIR)) {
        return
    }

    const files = fs.readdirSync(SKETCHES_DIR)
        // Handle various types of swap files that Vim creates
    const swapFiles = files.filter(file =>
        file.endsWith('.swp') ||
        file.endsWith('.swo') ||
        file.endsWith('.swn') ||
        file.startsWith('.') && file.includes('.swp')
    )

    if (swapFiles.length > 0) {
        console.log(`🧹 Cleaning up ${swapFiles.length} swap file(s)...`)
        swapFiles.forEach(file => {
            const filePath = path.join(SKETCHES_DIR, file)
            try {
                fs.unlinkSync(filePath)
                console.log(`   ✅ Removed: ${file}`)
            } catch (error) {
                console.log(`   ⚠️  Could not remove: ${file}`)
            }
        })
    }
}

function generateFile(templatePath, name, outputPath) {
    // Check if file already exists
    if (fileExists(outputPath)) {
        console.log(`⚠️  File already exists: ${outputPath}`)
        console.log(`   Skipping to avoid overwrite.`)
        return false
    }

    const template = fs.readFileSync(templatePath, 'utf8')
    const content = template.replace(/__NAME__/g, name)
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(outputPath, content)
    console.log(`✅ Created: ${outputPath}`)
    return true
}

function generateStoryFile(templatePath, componentName, fileName, outputPath) {
    // Check if file already exists
    if (fileExists(outputPath)) {
        console.log(`⚠️  File already exists: ${outputPath}`)
        console.log(`   Skipping to avoid overwrite.`)
        return false
    }

    const template = fs.readFileSync(templatePath, 'utf8')
        // Replace component name and import path separately
    let content = template.replace(/__NAME__/g, componentName)
    content = content.replace(`from './${componentName}'`, `from './${fileName}'`)

    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(outputPath, content)
    console.log(`✅ Created: ${outputPath}`)
    return true
}

async function openInEditor(filePath) {
    try {
        let editor = process.env.EDITOR || process.env.VSCODE_BIN
        if (!editor) {
            // Try to find common editors without hanging
            const editors = ['code', 'subl', 'vim', 'nano']
            for (const ed of editors) {
                try {
                    // Quick check without hanging
                    await execAsync(`which ${ed}`, { timeout: 1000 })
                    editor = ed
                    break
                } catch (e) {
                    // Continue to next editor if this one is not found
                    continue
                }
            }
        }

        if (editor) {
            // Open editor with timeout
            await execAsync(`${editor} "${filePath}"`, { timeout: 3000 })
            console.log(`📝 Opened in editor: ${path.basename(filePath)}`)
        } else {
            console.log(`📝 File created: ${path.basename(filePath)}`)
            console.log(`💡 Tip: Set EDITOR environment variable or install VS Code CLI`)
        }
    } catch (error) {
        console.log(`📝 File created: ${path.basename(filePath)}`)
        console.log(`💡 Tip: Set EDITOR environment variable or install VS Code CLI`)
        console.log(`⚠️  Editor error: ${error.message}`)
    }
}

async function checkDevServer() {
    try {
        await execAsync('curl -s -o /dev/null -w "%{http_code}" http://localhost:61000')
        return true
    } catch (error) {
        return false
    }
}

async function openInBrowser(url) {
    console.log(`🌐 Browser: ${url}`)
    console.log(`💡 Click the URL above or run: open "${url}"`)
}

function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
        .replace(/[-_]+/g, '-') // normalize separators
        .toLowerCase()
}

async function generateSketch(name) {
    const { folder, sketchName } = parseSketchName(name)
    const capitalizedName = capitalize(sketchName)
    const validComponentName = toValidIdentifier(capitalizedName)

    // Determine the target directory
    const targetDir = folder ? path.join(SKETCHES_DIR, folder) : SKETCHES_DIR
    const sketchPath = path.join(targetDir, `${capitalizedName}.tsx`)
    const templatePath = path.join(TEMPLATES_DIR, 'sketch-with-leva.tsx')
    const storyPath = path.join(targetDir, `${capitalizedName}.stories.tsx`)
    const storyTemplatePath = path.join(TEMPLATES_DIR, 'sketch-with-leva.stories.tsx')

    // Check if files already exist
    const sketchExists = fileExists(sketchPath)
    const storyExists = fileExists(storyPath)

    if (sketchExists || storyExists) {
        console.log(`\n⚠️  Files already exist for sketch: ${capitalizedName}`)
        if (sketchExists) console.log(`   - ${sketchPath}`)
        if (storyExists) console.log(`   - ${storyPath}`)
        console.log(`\n💡 Use a different name or delete existing files first.`)
        return
    }

    const sketchCreated = generateFile(templatePath, validComponentName, sketchPath)
    const storyCreated = generateStoryFile(storyTemplatePath, validComponentName, capitalizedName, storyPath)

    if (sketchCreated && storyCreated) {
        console.log(`\n🎵 Generated sketch: ${capitalizedName}`)
        if (folder) {
            console.log(`📁 In folder: ${folder}`)
        }
        console.log(`📁 Files created:`)
        console.log(`   - ${sketchPath}`)
        console.log(`   - ${storyPath}`)

        // Clean up any swap files
        cleanupSwapFiles()

        // Generate the story URL
        const storyName = toKebabCase(capitalizedName)
        const storyUrl = `http://localhost:61000/?story=${storyName}--default`

        await openInEditor(sketchPath)
        await openInBrowser(storyUrl)
        console.log(`\n🚀 Your sketch is ready!`)
        console.log(`📝 Edit: ${sketchPath} (cmd-click to open)`)
        console.log(`💡 Start dev server: npm run dev`)
        console.log(`🌐 View in browser: ${storyUrl} (cmd-click to open)`)
    } else {
        console.log(`\n❌ Failed to generate sketch. Some files already exist.`)
    }
}

function showHelp() {
    console.log(`\n🎵 Elementary Audio Playground Generator\n\nUsage:\n  npm run generate [name]     Generate a new sketch\n\nExamples:\n  npm run generate oscillator\n  npm run generate filter\n  npm run generate mySynth/synth-i001\n  npm run generate effects/reverb\n\nIf no name is provided, you'll be prompted for one.\nThe generator will auto-suggest the next iteration based on existing files.\nSketches are created with Leva controls by default.\n`)
}

async function main() {
    const args = process.argv.slice(2)
    if (args.includes('--help') || args.includes('-h')) {
        showHelp()
        rl.close()
        return
    }
    let name = args[0]
    if (!name) {
        // Auto-detect the last folder used or suggest a new one
        const folders = fs.existsSync(SKETCHES_DIR) ?
            fs.readdirSync(SKETCHES_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name) : []

        let defaultName
        if (folders.length > 0) {
            // Use the most recently modified folder, or the first one
            const lastFolder = folders[folders.length - 1]
            const nextName = generateDefaultName(lastFolder)
            defaultName = `${lastFolder}/${nextName}`
        } else {
            defaultName = generateDefaultName()
        }

        name = await question(`Enter sketch name (default: ${defaultName}): `)
        if (!name.trim()) {
            name = defaultName
        }
    }
    if (!name || !name.trim()) {
        console.error('❌ Error: Name is required')
        rl.close()
        process.exit(1)
    }
    try {
        await generateSketch(name.trim())
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    } finally {
        rl.close()
    }
}

// Export functions for testing
export { findLastNumberedSketch, generateDefaultName, toValidIdentifier }

function incrementSketchName(name) {
    // Match trailing digits, possibly after a dash or letter
    const match = name.match(/^(.*?)(\d+)$/)
    if (!match) return name // No number to increment
    const prefix = match[1]
    const num = parseInt(match[2], 10) + 1
    const padded = num.toString().padStart(match[2].length, '0')
    return `${prefix}${padded}`
}

export { incrementSketchName }

main()