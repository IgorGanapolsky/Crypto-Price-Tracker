#!/usr/bin/env node

// Quick test to verify automation setup
require('dotenv').config();

const requiredEnvVars = [
    'GUMROAD_API_KEY',
    'OPENAI_API_KEY',
    'TWITTER_BEARER_TOKEN'
];

console.log('🧪 Testing automation setup...\n');

let allGood = true;

requiredEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Configured`);
    } else {
        console.log(`❌ ${envVar}: Missing`);
        allGood = false;
    }
});

console.log('\n📦 Testing npm packages...');

const packages = ['axios', 'form-data', 'archiver'];
packages.forEach(pkg => {
    try {
        require(pkg);
        console.log(`✅ ${pkg}: Installed`);
    } catch (error) {
        console.log(`❌ ${pkg}: Missing`);
        allGood = false;
    }
});

if (allGood) {
    console.log('\n🎉 Setup is complete! Ready to automate.');
    console.log('\n💡 Next steps:');
    console.log('1. Add your API keys to .env file');
    console.log('2. Test with: npm run deploy-gumroad -- --template="crypto-tracker"');
    console.log('3. Run full pipeline: ./automation-scripts/full-deployment.sh --template="crypto-tracker"');
} else {
    console.log('\n⚠️  Please fix the issues above before proceeding.');
}
