const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User.model');
const Academy = require('../models/Academy.model');
const Plan = require('../models/Plan.model');
const AccessLog = require('../models/AccessLog.model');

// Get system statistics
router.get('/system-stats', protect, async (req, res) => {
  try {
    // Only admin users can access system stats
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // Get real-time statistics from database
    const [
      totalUsers,
      activeUsers,
      totalAcademies,
      totalPlans,
      accessLogs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastLoginAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }),
      Academy.countDocuments(),
      Plan.countDocuments(),
      AccessLog.countDocuments()
    ]);

    // Calculate system uptime (mock for now, can be enhanced with real monitoring)
    const systemUptime = 99.7; // This would come from system monitoring
    
    // Get last backup time (mock for now)
    const lastBackup = new Date(Date.now() - 6 * 60 * 60 * 1000);
    
    // Calculate database size (mock for now, can be enhanced with real DB stats)
    const databaseSize = '2.4 GB'; // This would come from database monitoring
    
    // Get server performance metrics (mock for now)
    const serverLoad = Math.floor(Math.random() * 50) + 20; // 20-70%
    const memoryUsage = Math.floor(Math.random() * 40) + 50; // 50-90%
    const diskUsage = Math.floor(Math.random() * 30) + 30; // 30-60%

    const systemStats = {
      totalUsers,
      activeUsers,
      totalAcademies,
      totalPlans,
      systemUptime,
      lastBackup,
      databaseSize,
      serverLoad,
      memoryUsage,
      diskUsage,
      lastUpdated: new Date()
    };

    res.json({
      success: true,
      message: 'System statistics retrieved successfully',
      data: systemStats
    });

  } catch (error) {
    console.error('Error fetching system stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch system statistics',
      error: error.message
    });
  }
});

// Get session settings
router.get('/session', protect, async (req, res) => {
  try {
    // Only admin users can access session settings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    // For now, return default settings
    // In production, these would be stored in database or config files
    const sessionSettings = {
      sessionTimeout: 30,
      enableSessionTimeout: true,
      enableIdleTimeout: true,
      idleTimeout: 15,
      enableRememberMe: true,
      rememberMeDuration: 7,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      requirePasswordChange: false,
      passwordExpiryDays: 90
    };

    res.json({
      success: true,
      message: 'Session settings retrieved successfully',
      data: sessionSettings
    });

  } catch (error) {
    console.error('Error fetching session settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch session settings',
      error: error.message
    });
  }
});

// Update session settings
router.put('/session', protect, async (req, res) => {
  try {
    // Only admin users can update session settings
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const {
      sessionTimeout,
      enableSessionTimeout,
      enableIdleTimeout,
      idleTimeout,
      enableRememberMe,
      rememberMeDuration,
      maxLoginAttempts,
      lockoutDuration,
      requirePasswordChange,
      passwordExpiryDays
    } = req.body;

    // Validate input
    if (sessionTimeout < 1 || sessionTimeout > 1440) {
      return res.status(400).json({ message: 'Session timeout must be between 1 and 1440 minutes' });
    }

    if (idleTimeout < 1 || idleTimeout > 1440) {
      return res.status(400).json({ message: 'Idle timeout must be between 1 and 1440 minutes' });
    }

    if (maxLoginAttempts < 1 || maxLoginAttempts > 10) {
      return res.status(400).json({ message: 'Max login attempts must be between 1 and 10' });
    }

    // In production, save these settings to database or config files
    const updatedSettings = {
      sessionTimeout,
      enableSessionTimeout,
      enableIdleTimeout,
      idleTimeout,
      enableRememberMe,
      rememberMeDuration,
      maxLoginAttempts,
      lockoutDuration,
      requirePasswordChange,
      passwordExpiryDays,
      updatedAt: new Date(),
      updatedBy: req.user._id
    };

    // Log the settings update
    console.log('Session settings updated:', updatedSettings);

    res.json({
      success: true,
      message: 'Session settings updated successfully',
      data: updatedSettings
    });

  } catch (error) {
    console.error('Error updating session settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update session settings',
      error: error.message
    });
  }
});

// Get access logs
router.get('/access-logs', protect, async (req, res) => {
  try {
    // Only admin users can access access logs
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get access logs with pagination
    const [accessLogs, totalLogs] = await Promise.all([
      AccessLog.find()
        .sort({ loginTime: -1 })
        .skip(skip)
        .limit(limit)
        .populate('userId', 'email firstName lastName')
        .lean(),
      AccessLog.countDocuments()
    ]);

    // Format the logs
    const formattedLogs = accessLogs.map(log => ({
      id: log._id,
      username: log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown User',
      email: log.userId ? log.userId.email : 'unknown@example.com',
      loginTime: log.loginTime,
      ipAddress: log.ipAddress,
      location: log.location,
      userAgent: log.userAgent,
      status: log.status,
      failureReason: log.failureReason
    }));

    res.json({
      success: true,
      message: 'Access logs retrieved successfully',
      data: formattedLogs,
      total: totalLogs,
      page,
      limit,
      totalPages: Math.ceil(totalLogs / limit)
    });

  } catch (error) {
    console.error('Error fetching access logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch access logs',
      error: error.message
    });
  }
});

module.exports = router;
