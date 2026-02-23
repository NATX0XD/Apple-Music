const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk(srcDir, (filePath) => {
    if (filePath.match(/\.(js|jsx)$/)) {
        let content = fs.readFileSync(filePath, 'utf8');
        // Replace all references of purple to theme, but ignore SettingsModal where "Purple" name is literal
        if (!filePath.includes('SettingsModal.jsx') && !filePath.includes('itunesApi.js')) {
            content = content.replace(/purple/g, 'theme');
            content = content.replace(/Purple/g, 'Theme');
        } else if (filePath.includes('SettingsModal.jsx')) {
            // Carefully replace just the tailwind classes in SettingsModal
            content = content.replace(/border-purple-500/g, 'border-theme-500');
            content = content.replace(/bg-purple-500\/10/g, 'bg-theme-500/10');
            content = content.replace(/bg-purple-500/g, 'bg-theme-500');
            content = content.replace(/text-purple-500/g, 'text-theme-500');
            content = content.replace(/text-purple-400/g, 'text-theme-400');
        }
        fs.writeFileSync(filePath, content, 'utf8');
    }
});

console.log('Replaced purple with theme variables automatically.');
