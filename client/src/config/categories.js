// Centralized Categories Configuration
// This file contains all category definitions used across the application

// SUPERSET: 27 detailed trading/finance categories (used in CreateCourse.js)
export const DETAILED_CATEGORIES = [
  'Bitcoin, Ethereum, Altcoins',
  'DeFi, NFTs, Web3',
  'On-chain analysis & portfolio building',
  'Currency pairs (major, minor, exotic)',
  'Technical & fundamental analysis',
  'Risk management strategies',
  'Equity fundamentals & valuation',
  'Technical charting & price action',
  'Dividend & growth investing',
  'Options basics (calls, puts, spreads)',
  'Futures & hedging strategies',
  'Advanced Greeks & risk modeling',
  'Gold, silver, oil, agricultural products',
  'Supply-demand cycles & geopolitical factors',
  'Futures contracts',
  'S&P 500, NASDAQ, Dow Jones',
  'Global index tracking',
  'Leveraged & inverse ETFs',
  'Chart patterns, candlesticks, indicators',
  'Trend following vs. contrarian setups',
  'Algorithmic & automated trading',
  'Economic indicators & central banks',
  'Earnings, balance sheets, valuation models',
  'Global macro & intermarket analysis',
  'Position sizing & stop-loss rules',
  'Emotional discipline in trading',
  'Building sustainable trading systems',
  // NEW CATEGORIES - Added based on comprehensive crypto education needs
  'Automation, prompts, agents, and AI-powered businesses',
  'Tokenization of real estate, art, and real-world finance',
  'On-chain governance, voting, participation',
  'Smart contracts, Solidity, dApps, blockchain infrastructure',
  'Taxes, fiscal reporting, crypto compliance',
  'Legal smart contracts, Web3 regulation',
];

// DERIVED: General categories (used in EditCourse.js)
// These are broader categories that encompass the detailed ones
export const GENERAL_CATEGORIES = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Development',
  'Data Science',
  'Product Management',
  'Finance',
  'Healthcare',
  'Education',
];

// DERIVED: Crypto-focused categories (used in Courses.js filtering)
// These are specific to cryptocurrency and trading
export const CRYPTO_CATEGORIES = [
  { value: 'cryptocurrency', label: 'Cryptocurrency' },
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'trading', label: 'Trading' },
  { value: 'defi', label: 'DeFi' },
  { value: 'nft', label: 'NFT' },
  { value: 'web3', label: 'Web3' },
  { value: 'finance', label: 'Finance' },
  { value: 'technology', label: 'Technology' }
];

// DERIVED: Lifestyle categories (used in Discovery.js)
// These are for community discovery and general interest
export const LIFESTYLE_CATEGORIES = [
  { label: 'All', value: 'all', color: 'default' },
  { label: '🎨 Hobbies', value: 'Hobbies', color: 'warning' },
  { label: '🎵 Music', value: 'Music', color: 'secondary' },
  { label: '💰 Money', value: 'Money', color: 'success' },
  { label: '🙏 Spirituality', value: 'Spirituality', color: 'info' },
  { label: '💻 Tech', value: 'Tech', color: 'primary' },
  { label: '🏃 Health', value: 'Health', color: 'error' },
  { label: '⚽ Sports', value: 'Sports', color: 'default' },
  { label: '📚 Self-improvement', value: 'Self-improvement', color: 'default' },
  { label: '❤️ Relationships', value: 'Relationships', color: 'secondary' }
];

// MAPPING: Map detailed categories to general categories
export const DETAILED_TO_GENERAL_MAPPING = {
  // Technology & Development
  'Bitcoin, Ethereum, Altcoins': 'Technology',
  'DeFi, NFTs, Web3': 'Technology',
  'On-chain analysis & portfolio building': 'Technology',
  'Algorithmic & automated trading': 'Technology',
  
  // Finance & Business
  'Currency pairs (major, minor, exotic)': 'Finance',
  'Technical & fundamental analysis': 'Finance',
  'Risk management strategies': 'Finance',
  'Equity fundamentals & valuation': 'Finance',
  'Technical charting & price action': 'Finance',
  'Dividend & growth investing': 'Finance',
  'Options basics (calls, puts, spreads)': 'Finance',
  'Futures & hedging strategies': 'Finance',
  'Advanced Greeks & risk modeling': 'Finance',
  'Gold, silver, oil, agricultural products': 'Finance',
  'Supply-demand cycles & geopolitical factors': 'Finance',
  'Futures contracts': 'Finance',
  'S&P 500, NASDAQ, Dow Jones': 'Finance',
  'Global index tracking': 'Finance',
  'Leveraged & inverse ETFs': 'Finance',
  'Chart patterns, candlesticks, indicators': 'Finance',
  'Trend following vs. contrarian setups': 'Finance',
  'Economic indicators & central banks': 'Finance',
  'Earnings, balance sheets, valuation models': 'Finance',
  'Global macro & intermarket analysis': 'Finance',
  'Position sizing & stop-loss rules': 'Finance',
  'Emotional discipline in trading': 'Finance',
  'Building sustainable trading systems': 'Finance',
  
  // NEW CATEGORIES MAPPING
  'Automation, prompts, agents, and AI-powered businesses': 'Technology',
  'Tokenization of real estate, art, and real-world finance': 'Finance',
  'On-chain governance, voting, participation': 'Technology',
  'Smart contracts, Solidity, dApps, blockchain infrastructure': 'Technology',
  'Taxes, fiscal reporting, crypto compliance': 'Finance',
  'Legal smart contracts, Web3 regulation': 'Business',
};

// MAPPING: Map detailed categories to crypto categories
export const DETAILED_TO_CRYPTO_MAPPING = {
  'Bitcoin, Ethereum, Altcoins': 'cryptocurrency',
  'DeFi, NFTs, Web3': 'defi',
  'On-chain analysis & portfolio building': 'blockchain',
  'Currency pairs (major, minor, exotic)': 'trading',
  'Technical & fundamental analysis': 'trading',
  'Risk management strategies': 'trading',
  'Equity fundamentals & valuation': 'finance',
  'Technical charting & price action': 'trading',
  'Dividend & growth investing': 'finance',
  'Options basics (calls, puts, spreads)': 'trading',
  'Futures & hedging strategies': 'trading',
  'Advanced Greeks & risk modeling': 'trading',
  'Gold, silver, oil, agricultural products': 'finance',
  'Supply-demand cycles & geopolitical factors': 'finance',
  'Futures contracts': 'trading',
  'S&P 500, NASDAQ, Dow Jones': 'finance',
  'Global index tracking': 'finance',
  'Leveraged & inverse ETFs': 'finance',
  'Chart patterns, candlesticks, indicators': 'trading',
  'Trend following vs. contrarian setups': 'trading',
  'Algorithmic & automated trading': 'technology',
  'Economic indicators & central banks': 'finance',
  'Earnings, balance sheets, valuation models': 'finance',
  'Global macro & intermarket analysis': 'finance',
  'Position sizing & stop-loss rules': 'trading',
  'Emotional discipline in trading': 'trading',
  'Building sustainable trading systems': 'trading',
  
  // NEW CATEGORIES CRYPTO MAPPING
  'Automation, prompts, agents, and AI-powered businesses': 'technology',
  'Tokenization of real estate, art, and real-world finance': 'defi',
  'On-chain governance, voting, participation': 'blockchain',
  'Smart contracts, Solidity, dApps, blockchain infrastructure': 'blockchain',
  'Taxes, fiscal reporting, crypto compliance': 'finance',
  'Legal smart contracts, Web3 regulation': 'blockchain',
};

// UTILITY FUNCTIONS
export const getGeneralCategory = (detailedCategory) => {
  return DETAILED_TO_GENERAL_MAPPING[detailedCategory] || 'Finance';
};

export const getCryptoCategory = (detailedCategory) => {
  return DETAILED_TO_CRYPTO_MAPPING[detailedCategory] || 'finance';
};

export const getDetailedCategoriesByGeneral = (generalCategory) => {
  return Object.keys(DETAILED_TO_GENERAL_MAPPING).filter(
    detailed => DETAILED_TO_GENERAL_MAPPING[detailed] === generalCategory
  );
};

export const getDetailedCategoriesByCrypto = (cryptoCategory) => {
  return Object.keys(DETAILED_TO_CRYPTO_MAPPING).filter(
    detailed => DETAILED_TO_CRYPTO_MAPPING[detailed] === cryptoCategory
  );
};

// DEFAULT EXPORT: The superset categories
export default DETAILED_CATEGORIES;
