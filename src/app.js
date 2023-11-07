const express = require('express')
const app = express()
const port = process.env.PORT || 3000;

app.get('/page-with-esi-tag.html', (req, res) => {
  res.header('Content-Type', 'text/html')
  res.send(`<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page with ESI tag</title>
    <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body>
<h1>Page with ESI tag</h1>
<esi:include src="https://dummyjson.com/products/1" onerror="continue"/>
</body>
</html>`)
})

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
