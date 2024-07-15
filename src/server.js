// src/server.js
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Olynex Management server running on port ${PORT}`);
});
