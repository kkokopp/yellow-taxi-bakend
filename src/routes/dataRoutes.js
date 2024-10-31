// routes/dataRoutes.js
import express from 'express';
import { getAllData } from '../controllers/dataController.js';
import { getDataByFiltered } from '../controllers/dataController.js';


const router = express.Router();

// Route untuk mengambil data dari API eksternal
router.get('/trips-all', getAllData);
// Route filtered data
router.get('/trips', getDataByFiltered);

export default router;