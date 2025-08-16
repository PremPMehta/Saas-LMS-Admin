const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5001/api';
let authToken = '';

// Test login to get token
async function testLogin() {
  try {
    console.log('🔐 Testing login...');
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@multi-admin.com',
        password: 'Password@123'
      }),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      authToken = data.data.token;
      console.log('✅ Login successful');
      console.log(`👤 User: ${data.data.user.firstName} ${data.data.user.lastName}`);
      console.log(`🔑 Token: ${authToken.substring(0, 20)}...`);
      return true;
    } else {
      console.log('❌ Login failed:', data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error.message);
    return false;
  }
}

// Test system stats endpoint
async function testSystemStats() {
  try {
    console.log('\n📊 Testing system stats...');
    const response = await fetch(`${BASE_URL}/settings/system-stats`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ System stats retrieved successfully');
      console.log(`👥 Total Users: ${data.data.totalUsers}`);
      console.log(`🟢 Active Users: ${data.data.activeUsers}`);
      console.log(`🏫 Total Academies: ${data.data.totalAcademies}`);
      console.log(`📋 Total Plans: ${data.data.totalPlans}`);
      console.log(`⏱️ System Uptime: ${data.data.systemUptime}%`);
      console.log(`💾 Database Size: ${data.data.databaseSize}`);
      console.log(`🖥️ Server Load: ${data.data.serverLoad}%`);
      console.log(`🧠 Memory Usage: ${data.data.memoryUsage}%`);
      console.log(`💿 Disk Usage: ${data.data.diskUsage}%`);
    } else {
      console.log('❌ System stats failed:', data.message);
    }
  } catch (error) {
    console.error('❌ System stats error:', error.message);
  }
}

// Test session settings endpoint
async function testSessionSettings() {
  try {
    console.log('\n⚙️ Testing session settings...');
    const response = await fetch(`${BASE_URL}/settings/session`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Session settings retrieved successfully');
      console.log(`⏰ Session Timeout: ${data.data.sessionTimeout} minutes`);
      console.log(`🔄 Idle Timeout: ${data.data.idleTimeout} minutes`);
      console.log(`🔒 Max Login Attempts: ${data.data.maxLoginAttempts}`);
      console.log(`⏳ Lockout Duration: ${data.data.lockoutDuration} minutes`);
      console.log(`🔑 Password Expiry: ${data.data.passwordExpiryDays} days`);
    } else {
      console.log('❌ Session settings failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Session settings error:', error.message);
  }
}

// Test access logs endpoint
async function testAccessLogs() {
  try {
    console.log('\n📝 Testing access logs...');
    const response = await fetch(`${BASE_URL}/settings/access-logs?page=1&limit=5`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Access logs retrieved successfully');
      console.log(`📊 Total Logs: ${data.total}`);
      console.log(`📄 Current Page: ${data.page}`);
      console.log(`📋 Logs per Page: ${data.limit}`);
      console.log(`📈 Total Pages: ${data.totalPages}`);
      
      if (data.data.length > 0) {
        console.log('\n📋 Sample Logs:');
        data.data.slice(0, 3).forEach((log, index) => {
          console.log(`  ${index + 1}. ${log.username} (${log.email})`);
          console.log(`     📅 ${log.loginTime}`);
          console.log(`     🌐 ${log.ipAddress}`);
          console.log(`     📍 ${log.location}`);
          console.log(`     ✅ ${log.status}`);
        });
      }
    } else {
      console.log('❌ Access logs failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Access logs error:', error.message);
  }
}

// Test updating session settings
async function testUpdateSessionSettings() {
  try {
    console.log('\n💾 Testing session settings update...');
    const newSettings = {
      sessionTimeout: 45,
      enableSessionTimeout: true,
      enableIdleTimeout: true,
      idleTimeout: 20,
      enableRememberMe: true,
      rememberMeDuration: 14,
      maxLoginAttempts: 6,
      lockoutDuration: 20,
      requirePasswordChange: true,
      passwordExpiryDays: 60
    };

    const response = await fetch(`${BASE_URL}/settings/session`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSettings),
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Session settings updated successfully');
      console.log(`⏰ New Session Timeout: ${data.data.sessionTimeout} minutes`);
      console.log(`🔄 New Idle Timeout: ${data.data.idleTimeout} minutes`);
      console.log(`🔒 New Max Login Attempts: ${data.data.maxLoginAttempts}`);
    } else {
      console.log('❌ Session settings update failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Session settings update error:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Settings API Tests...\n');
  
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }

  await testSystemStats();
  await testSessionSettings();
  await testAccessLogs();
  await testUpdateSessionSettings();
  
  console.log('\n✨ All tests completed!');
}

// Run the tests
runTests().catch(console.error);
