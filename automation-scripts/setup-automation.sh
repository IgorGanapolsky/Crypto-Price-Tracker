#!/bin/bash

# 🤖 Micro-SaaS Automation Setup Script
# Sets up the complete automation pipeline for template creation and deployment

set -e

echo "🚀 Setting up Micro-SaaS Automation Pipeline..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

print_status "Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm found: $(npm --version)"

# Install required npm packages
print_info "Installing automation dependencies..."
npm install -g expo-cli @expo/cli

# Install local dependencies for automation scripts
print_info "Installing local dependencies..."
cat > package.json << 'EOF'
{
  "name": "micro-saas-automation",
  "version": "1.0.0",
  "description": "Automation tools for micro-SaaS template creation and deployment",
  "scripts": {
    "deploy-gumroad": "node automation-scripts/gumroad-deploy.js",
    "social-blast": "node automation-scripts/social-blast.js",
    "full-deploy": "bash automation-scripts/full-deployment.sh"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "form-data": "^4.0.0",
    "archiver": "^6.0.1",
    "dotenv": "^16.4.5"
  }
}
EOF

npm install

# Create environment variables template
print_info "Creating environment variables template..."
cat > .env.template << 'EOF'
# Gumroad API
GUMROAD_API_KEY=your_gumroad_api_key_here

# Twitter/X API
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# OpenAI API (for content generation)
OPENAI_API_KEY=your_openai_api_key

# GitHub (usually auto-configured with gh CLI)
GITHUB_TOKEN=your_github_token

# Optional: YouTube API (for video uploads)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CLIENT_ID=your_youtube_client_id
YOUTUBE_CLIENT_SECRET=your_youtube_client_secret
EOF

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.template .env
    print_warning "Created .env file. Please add your API keys!"
fi

# Setup GitHub CLI if not already installed
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI not found. Please install it manually:"
    print_info "Visit: https://github.com/cli/cli#installation"
else
    print_status "GitHub CLI found: $(gh --version | head -n1)"
fi

# Create automation scripts directory structure
mkdir -p automation-scripts/{apis,generators,deployers,reports}

# Create a master automation script
cat > automation-scripts/full-deployment.sh << 'EOF'
#!/bin/bash

# Full template deployment pipeline
# Usage: ./full-deployment.sh --template="habit-tracker" --price="45"

set -e

TEMPLATE_NAME=""
PRICE="45"
PLATFORMS="gumroad"
SOCIAL="twitter,linkedin"
AUTO_PUBLISH="false"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --template=*)
            TEMPLATE_NAME="${1#*=}"
            shift
            ;;
        --price=*)
            PRICE="${1#*=}"
            shift
            ;;
        --platforms=*)
            PLATFORMS="${1#*=}"
            shift
            ;;
        --social=*)
            SOCIAL="${1#*=}"
            shift
            ;;
        --auto-publish)
            AUTO_PUBLISH="true"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [ -z "$TEMPLATE_NAME" ]; then
    echo "❌ Template name is required. Use --template=name"
    exit 1
fi

echo "🚀 Starting full deployment for: $TEMPLATE_NAME"
echo "💰 Price: \$$PRICE"
echo "🏪 Platforms: $PLATFORMS"
echo "📱 Social: $SOCIAL"

# Step 1: Deploy to Gumroad
if [[ $PLATFORMS == *"gumroad"* ]]; then
    echo "📦 Deploying to Gumroad..."
    node automation-scripts/gumroad-deploy.js \
        --template="$TEMPLATE_NAME" \
        --price="$PRICE" \
        --publish="$AUTO_PUBLISH"
fi

# Step 2: Social media blast
echo "📱 Starting social media blast..."
node automation-scripts/social-blast.js \
    --template="$TEMPLATE_NAME" \
    --platforms="$SOCIAL" \
    --price="$PRICE"

# Step 3: Generate deployment report
echo "📊 Generating deployment report..."
cat > "deployment-report-$(date +%Y%m%d-%H%M%S).md" << REPORT
# Deployment Report: $TEMPLATE_NAME

**Date:** $(date)
**Template:** $TEMPLATE_NAME
**Price:** \$$PRICE
**Platforms:** $PLATFORMS
**Social Media:** $SOCIAL

## Next Steps:
1. ✅ Monitor Gumroad analytics
2. ✅ Track social media engagement
3. ✅ Respond to customer inquiries
4. ✅ Plan follow-up marketing
5. ✅ Collect customer feedback

## Success Metrics to Track:
- Sales within 24 hours: Target 1-2
- Social media engagement: Target 50+ interactions
- Repository stars: Target 10+
- Website traffic: Track via analytics

Generated by Micro-SaaS Automation Pipeline
REPORT

echo "🎉 Deployment complete! Check deployment report for next steps."
EOF

chmod +x automation-scripts/full-deployment.sh

# Create a quick test script
cat > automation-scripts/test-setup.js << 'EOF'
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
EOF

chmod +x automation-scripts/test-setup.js

# Create useful aliases
cat > automation-scripts/aliases.sh << 'EOF'
#!/bin/bash

# Useful aliases for micro-SaaS automation
alias deploy-template='./automation-scripts/full-deployment.sh'
alias test-automation='node automation-scripts/test-setup.js'
alias social-blast='node automation-scripts/social-blast.js'
alias gumroad-deploy='node automation-scripts/gumroad-deploy.js'

# Add to your ~/.bashrc or ~/.zshrc:
# source /path/to/your/project/automation-scripts/aliases.sh
EOF

print_status "Automation pipeline setup complete!"
print_info "Files created:"
echo "  📁 automation-scripts/"
echo "    📄 gumroad-deploy.js (Gumroad automation)"
echo "    📄 social-blast.js (Social media automation)"
echo "    📄 full-deployment.sh (Complete pipeline)"
echo "    📄 test-setup.js (Setup verification)"
echo "  📄 .env.template (Environment variables template)"
echo "  📄 package.json (Dependencies)"

print_warning "Next steps:"
echo "1. Copy your API keys to .env file"
echo "2. Run: node automation-scripts/test-setup.js"
echo "3. Test deployment: npm run deploy-gumroad -- --template=\"crypto-tracker\""

print_info "Quick commands:"
echo "• Full deployment: ./automation-scripts/full-deployment.sh --template=\"crypto-tracker\" --price=\"45\""
echo "• Social blast only: npm run social-blast -- --template=\"crypto-tracker\" --platforms=\"twitter,linkedin\""
echo "• Test setup: npm run test-automation"

echo ""
print_status "🎯 Ready to build your automated micro-SaaS empire!"