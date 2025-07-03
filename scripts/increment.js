#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'
import { incrementSketchName } from './incrementSketchName.js'

const execAsync = promisify(exec)
const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(
    import.meta.url)), '..')
const SKETCHES_DIR = path.join(PROJECT_ROOT, 'src', 'sketches')

function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase to kebab-case
        .replace(/[-_]+/g, '-') // normalize separators
        .toLowerCase()
}

function findMostRecentSketchFile(dir) {
    let files = []

    function walk(currentDir) {
        for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
            const fullPath = path.join(currentDir, entry.name)
            if (entry.isDirectory()) {
                walk(fullPath)
            } else if (entry.isFile() && entry.name.endsWith('.tsx') && !entry.name.endsWith('.stories.tsx')) {
                files.push(fullPath)
            }
        }
    }
    walk(dir)
    if (files.length === 0) return null
    files.sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)
    return files[0]
}

function copyAndIncrement(filePath) {
    const dir = path.dirname(filePath)
    const base = path.basename(filePath, '.tsx')
    const newBase = incrementSketchName(base)
    const newFile = path.join(dir, newBase + '.tsx')
    if (fs.existsSync(newFile)) {
        console.error(`❌ File already exists: ${newFile}`)
        process.exit(1)
    }
    fs.copyFileSync(filePath, newFile)

    // Try to copy and update the .stories.tsx file if it exists
    const storyFile = path.join(dir, base + '.stories.tsx')
    const newStoryFile = path.join(dir, newBase + '.stories.tsx')
    if (fs.existsSync(storyFile)) {
        fs.copyFileSync(storyFile, newStoryFile)
            // Update the import path in the story file
        updateStoryImport(newStoryFile, base, newBase)
    }
    return { newFile, newStoryFile: fs.existsSync(storyFile) ? newStoryFile : null }
}

function updateStoryImport(storyFilePath, oldBase, newBase) {
    try {
        let content = fs.readFileSync(storyFilePath, 'utf8')
            // Update the import path to use the new file name
        content = content.replace(`from './${oldBase}'`, `from './${newBase}'`)
        fs.writeFileSync(storyFilePath, content)
        console.log(`✅ Updated import in: ${path.basename(storyFilePath)}`)
    } catch (error) {
        console.log(`⚠️  Could not update import in story file: ${error.message}`)
    }
}

async function openInEditor(filePath) {
    try {
        let editor = process.env.EDITOR || process.env.VSCODE_BIN
        if (!editor) {
            const editors = ['code', 'subl', 'vim', 'nano']
            for (const ed of editors) {
                try {
                    await execAsync(`which ${ed}`, { timeout: 1000 })
                    editor = ed
                    break
                } catch (e) {
                    continue
                }
            }
        }

        if (editor) {
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

async function openInBrowser(url) {
    console.log(`🌐 Browser: ${url}`)
    console.log(`💡 Click the URL above or run: open "${url}"`)
}

async function main() {
    const lastFile = findMostRecentSketchFile(SKETCHES_DIR)
    if (!lastFile) {
        console.error('❌ No sketch files found.')
        process.exit(1)
    }

    console.log(`📁 Found most recent sketch: ${path.basename(lastFile)}`)

    const { newFile, newStoryFile } = copyAndIncrement(lastFile)

    // Generate the story URL
    const newBase = path.basename(newFile, '.tsx')
    const storyName = toKebabCase(newBase)
    const storyUrl = `http://localhost:61000/?story=${storyName}--default`

    await openInEditor(newFile)
    await openInBrowser(storyUrl)

    console.log(`\n🚀 New incremented sketch ready!`)
    console.log(`📝 Edit: ${newFile} (cmd-click to open)`)
    if (newStoryFile) {
        console.log(`📝 Story: ${newStoryFile} (cmd-click to open)`)
    }
    console.log(`💡 Start dev server: npm run dev`)
    console.log(`🌐 View in browser: ${storyUrl} (cmd-click to open)`)
}

main()