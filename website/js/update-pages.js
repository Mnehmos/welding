// Batch update script for StickWeldPro pages
// This script adds the tab indicator CSS and JS to all pages in the site

const fs = require('fs');
const path = require('path');

// Path to the pages directory
const pagesDir = path.join(__dirname, '../pages');

// Get a list of all HTML files in the pages directory
const htmlFiles = fs.readdirSync(pagesDir).filter(file => file.endsWith('.html'));

console.log(`Found ${htmlFiles.length} HTML files to update`);

// Process each HTML file
htmlFiles.forEach(fileName => {
    const filePath = path.join(pagesDir, fileName);
    
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the tab-indicator.css link after responsive.css
    if (content.includes('<link rel="stylesheet" href="../css/responsive.css">')) {
        content = content.replace(
            '<link rel="stylesheet" href="../css/responsive.css">',
            '<link rel="stylesheet" href="../css/responsive.css">\n    <link rel="stylesheet" href="../css/tab-indicator.css">'
        );
    }
    
    // Add the tab-indicator.js script before the closing </body> tag
    if (content.includes('<script src="../js/script.js"></script>')) {
        content = content.replace(
            '<script src="../js/script.js"></script>',
            '<script src="../js/script.js"></script>\n    <script src="../js/tab-indicator.js"></script>'
        );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Updated ${fileName}`);
});

console.log('All files have been updated successfully.');
