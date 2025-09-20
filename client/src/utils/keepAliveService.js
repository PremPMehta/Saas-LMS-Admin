// Keep-alive service to prevent server cold starts
class KeepAliveService {
  constructor() {
    this.intervalId = null;
    this.isActive = false;
    this.apiUrl = process.env.REACT_APP_API_URL || 'https://saas-lms-admin-1.onrender.com';
  }

  start() {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('🔄 Starting keep-alive service');
    
    // Ping server every 4 minutes to keep it warm
    this.intervalId = setInterval(async () => {
      try {
        await fetch(`${this.apiUrl}/api/keepalive`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('💓 Keep-alive ping successful');
      } catch (error) {
        console.log('⚠️ Keep-alive ping failed:', error.message);
      }
    }, 4 * 60 * 1000); // 4 minutes
  }

  stop() {
    if (!this.isActive) return;
    
    this.isActive = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('⏹️ Keep-alive service stopped');
  }

  // Manual ping for immediate warm-up
  async ping() {
    try {
      const response = await fetch(`${this.apiUrl}/api/keepalive`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log('🔥 Manual ping successful:', data.message);
      return true;
    } catch (error) {
      console.log('❌ Manual ping failed:', error.message);
      return false;
    }
  }

  // Warm up server with data preload
  async warmup() {
    try {
      const response = await fetch(`${this.apiUrl}/api/warmup`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      console.log('🔥 Server warmup successful:', data.message);
      return true;
    } catch (error) {
      console.log('❌ Server warmup failed:', error.message);
      return false;
    }
  }
}

// Create singleton instance
const keepAliveService = new KeepAliveService();

export default keepAliveService;
