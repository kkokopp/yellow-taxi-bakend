// app.js
import express from 'express';
import dataRoutes from './routes/dataRoutes.js';

const app = express();
const port = 3000;
const cors = require('cors');

// Menggunakan route dari dataRoutes
app.use(cors({ origin: 'http://localhost:3000' }));
app.use('/', dataRoutes);

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export default app;
