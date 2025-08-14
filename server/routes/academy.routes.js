const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const academyController = require('../controllers/academy.controller');

// Apply authentication middleware to all routes
router.use(protect);

// Get academy statistics for KPI cards
router.get('/stats/summary', academyController.getAcademyStats);

// Get all academies
router.get('/', academyController.getAcademies);

// Get single academy by ID
router.get('/:id', academyController.getAcademyById);

// Create new academy
router.post('/', academyController.createAcademy);

// Update academy
router.put('/:id', academyController.updateAcademy);

// Delete academy
router.delete('/:id', academyController.deleteAcademy);

module.exports = router; 