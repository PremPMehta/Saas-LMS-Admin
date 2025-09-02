const https = require('https');

// Test Vimeo videos
const vimeoVideos = [
  {
    title: 'What is Cryptocurrency?',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'Basic introduction to cryptocurrency'
  },
  {
    title: 'Bitcoin Explained Simply',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'Understanding Bitcoin in simple terms'
  },
  {
    title: 'Blockchain Technology Basics',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'How blockchain works'
  },
  {
    title: 'Crypto Trading Fundamentals',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'Basic crypto trading concepts'
  },
  {
    title: 'DeFi Explained',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'Decentralized Finance overview'
  },
  {
    title: 'NFTs and Digital Assets',
    url: 'https://player.vimeo.com/video/824804225',
    description: 'Understanding NFTs'
  }
];

// Test YouTube videos
const youtubeVideos = [
  {
    title: 'Cryptocurrency In 5 Minutes',
    url: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    description: 'Quick crypto overview'
  },
  {
    title: 'Bitcoin: How Cryptocurrencies Work',
    url: 'https://www.youtube.com/embed/l9jOJk30dQ0',
    description: 'Bitcoin explained'
  },
  {
    title: 'Blockchain Technology Explained',
    url: 'https://www.youtube.com/embed/93E_GzvpMA0',
    description: 'Blockchain basics'
  },
  {
    title: 'How to Trade Cryptocurrency',
    url: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    description: 'Crypto trading guide'
  },
  {
    title: 'DeFi vs Traditional Finance',
    url: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    description: 'DeFi comparison'
  },
  {
    title: 'The Future of Cryptocurrency',
    url: 'https://www.youtube.com/embed/1YyAzVmP9xQ',
    description: 'Crypto future trends'
  }
];

function testUrl(url) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ working: false, error: 'Timeout' });
    }, 5000);

    https.get(url, (res) => {
      clearTimeout(timeout);
      resolve({ working: res.statusCode === 200, statusCode: res.statusCode });
    }).on('error', (err) => {
      clearTimeout(timeout);
      resolve({ working: false, error: err.message });
    });
  });
}

async function testAllVideos() {
  console.log('🔍 Testing Vimeo Videos...\n');
  
  for (let i = 0; i < vimeoVideos.length; i++) {
    const video = vimeoVideos[i];
    console.log(`📹 Testing: ${video.title}`);
    const result = await testUrl(video.url);
    console.log(`   Status: ${result.working ? '✅ Working' : '❌ Failed'} (${result.statusCode || result.error})`);
    console.log(`   URL: ${video.url}\n`);
  }

  console.log('🔍 Testing YouTube Videos...\n');
  
  for (let i = 0; i < youtubeVideos.length; i++) {
    const video = youtubeVideos[i];
    console.log(`📺 Testing: ${video.title}`);
    const result = await testUrl(video.url);
    console.log(`   Status: ${result.working ? '✅ Working' : '❌ Failed'} (${result.statusCode || result.error})`);
    console.log(`   URL: ${video.url}\n`);
  }

  console.log('📋 Summary:');
  console.log(`Vimeo Videos: ${vimeoVideos.length}`);
  console.log(`YouTube Videos: ${youtubeVideos.length}`);
}

testAllVideos();
