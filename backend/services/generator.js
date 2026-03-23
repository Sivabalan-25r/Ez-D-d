/**
 * Simple HTML Generator for Ez D&d
 * Converts Canvas JSON elements to structured HTML markup.
 */

const generateHTML = (canvasData) => {
    let elementsMarkup = canvasData.map(el => {
        // Basic mapping for simple export
        if (el.type === 'text') {
            return `<div style="position:absolute; left:${el.left}px; top:${el.top}px; ${el.style || ''}">${el.content}</div>`;
        }
        if (el.type === 'image') {
            return `<img src="${el.src}" style="position:absolute; left:${el.left}px; top:${el.top}px; width:${el.width}px; height:${el.height}px; ${el.style || ''}" />`;
        }
        if (el.type === 'section') {
            return `<section style="width:100%; height:${el.height}px; ${el.style || ''}">${el.content || ''}</section>`;
        }
        return '';
    }).join('\n');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Ez D&d Site</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { margin: 0; padding: 0; font-family: sans-serif; }
        .canvas-container { position: relative; width: 100%; height: 100vh; overflow: hidden; }
    </style>
</head>
<body>
    <div class="canvas-container">
        ${elementsMarkup}
    </div>
</body>
</html>
    `.trim();
};

module.exports = { generateHTML };
