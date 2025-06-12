const baseHtml = (title, bodyContent, includeNavbar = true) => `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body>
    ${includeNavbar ? '<nav class="navbar"></nav>' : ''}
    <div class="container">
        ${bodyContent}
    </div>
</body>
</html>
`;

module.exports = baseHtml;