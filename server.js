const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static('./dist/payroll-system'));

// Wait for a request to any path and redirect all of the requests to index.html
app.get('/*', function(req, res) {
    res.sendFile('index.html', {root: 'dist/payroll-system/'}
  );
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);