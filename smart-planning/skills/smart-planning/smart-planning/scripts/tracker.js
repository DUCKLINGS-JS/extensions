const fs = require('fs');
const path = require('path');

function getProgress(folderName) {
    const targetDir = path.resolve(process.cwd(), folderName);
    
    if (!fs.existsSync(targetDir)) {
        return `Error: Folder '${folderName}' not found.`;
    }

    const files = fs.readdirSync(targetDir);
    
    // Extract numbers from files starting with "N. "
    const numbers = files.map(f => {
        const match = f.match(/^(\d+)\./);
        return match ? parseInt(match[1], 10) : null;
    }).filter(n => n !== null);

    if (numbers.length === 0) return "0% (No numbered steps found)";

    const totalSteps = Math.max(...numbers);
    
    // Count how many steps are actually marked as 'done'
    const completedSteps = files.filter(f => f.toLowerCase().includes('done') && !f.toLowerCase().includes('not-done')).length;
    
    const percent = Math.round((completedSteps / totalSteps) * 100);
    return `${percent}% (${completedSteps}/${totalSteps} steps completed) - Folder: ${folderName}`;
}

const folderName = process.argv[2];
if (!folderName) {
    console.log("Usage: node tracker.js <folder-name>");
} else {
    console.log(getProgress(folderName));
}
