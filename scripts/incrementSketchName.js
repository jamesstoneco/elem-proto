function incrementSketchName(name) {
    // Match trailing digits, possibly after a dash or letter
    const match = name.match(/^(.*?)(\d+)$/)
    if (match) {
        const prefix = match[1]
        const num = parseInt(match[2], 10) + 1
        const padded = num.toString().padStart(match[2].length, '0')
        return `${prefix}${padded}`
    }
    // If no number, append '2' if ends with a digit, else '002'
    if (/\d$/.test(name)) {
        // Ends with a digit, increment it
        return name.replace(/(\d+)$/, (d) => (parseInt(d, 10) + 1).toString())
    } else {
        // No number at end, append '002'
        return name + '002'
    }
}

export { incrementSketchName }