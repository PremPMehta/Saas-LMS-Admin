const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const planController = require('../controllers/plan.controller');

// Apply authentication middleware to all routes
router.use(protect);

// Get plan statistics for KPI cards
router.get('/stats/summary', planController.getPlanStats);

// Get all plans
router.get('/', planController.getPlans);

// Get single plan by ID
router.get('/:id', planController.getPlanById);

// Create new plan
router.post('/', planController.createPlan);

// Update plan
router.put('/:id', planController.updatePlan);

// Delete plan
router.delete('/:id', planController.deletePlan);

module.exports = router; 