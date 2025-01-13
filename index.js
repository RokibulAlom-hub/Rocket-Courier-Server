const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 7000;

// Enable all CORS requests
app.use(cors());

app.get('/', (req, res) => {
  res.send('Ohh yeah my server is working');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
