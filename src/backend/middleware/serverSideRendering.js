module.exports = function (request, response) {
    console.log('Middleware Url is: ' + request.url);
    response.setHeader('Last-Modified', (new Date()).toUTCString());
    if (ENV_DEVELOPMENT) {
        // Do not cache webpack stats: the script file would change since
        // hot module replacement is enabled in the development env
        webpackIsomorphicTools.refresh();
    }

    response.send(renderPage());
}
function renderPage() {
    const assets = webpackIsomorphicTools.assets();
    const jsBundle = assets.javascript.main;
    
    const cssBundle = assets.styles.main;
    const cssTag = cssBundle ? `<link rel="stylesheet" href="${cssBundle}">` : '';
    return `<!DOCTYPE html>
        <html>
        <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="/css/react-datepicker.css">
        ${cssTag}
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>ЦУП | Разработка</title>
        </head>
        <body>
        <div id="root"></div>
        <div id="root-modal"></div>
        <script src="${jsBundle}"></script>
        </body>
    </html>`
}
