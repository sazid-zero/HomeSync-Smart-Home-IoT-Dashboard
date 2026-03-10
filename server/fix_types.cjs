const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    content = content.replace(/req\.params\.id(?!\s*as)/g, '(req.params.id as string)');
    content = content.replace(/req\.params\.roomId(?!\s*as)/g, '(req.params.roomId as string)');
    fs.writeFileSync(filePath, content, 'utf-8');
}

const controllersDir = path.join(__dirname, 'src', 'controllers');
fs.readdirSync(controllersDir).forEach(file => {
    if (file.endsWith('.ts')) {
        replaceInFile(path.join(controllersDir, file));
    }
});
console.log('Done replacement.');
