#!/usr/bin/env node

/**
 * Gumroad Automated Deployment Script
 * Automatically creates and deploys templates to Gumroad marketplace
 * 
 * Usage: node gumroad-deploy.js --template="crypto-tracker" --price="45"
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const archiver = require('archiver');

class GumroadDeployer {
  constructor() {
    this.apiKey = process.env.GUMROAD_API_KEY;
    this.baseURL = 'https://api.gumroad.com/v2';
    
    if (!this.apiKey) {
      throw new Error('GUMROAD_API_KEY environment variable is required');
    }
  }

  /**
   * Create ZIP file from template directory
   */
  async createTemplateZip(templatePath, outputPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        console.log(`✅ Template ZIP created: ${archive.pointer()} bytes`);
        resolve(outputPath);
      });

      archive.on('error', reject);
      archive.pipe(output);
      
      // Add all files except node_modules and .git
      archive.glob('**/*', {
        cwd: templatePath,
        ignore: ['node_modules/**', '.git/**', '*.zip', 'automation-scripts/**']
      });
      
      archive.finalize();
    });
  }

  /**
   * Generate product description from template README
   */
  generateDescription(templateName, price, features) {
    return `🚀 ${templateName} - React Native Template

✨ **Production-Ready Features:**
${features.map(f => `• ${f}`).join('\n')}

🎯 **Perfect For:**
• Micro-SaaS entrepreneurs
• React Native developers
• Template resellers
• Startup prototypes

💰 **Monetization Ready:**
• AdMob integration placeholders
• Premium feature toggles
• In-app purchase setup
• Analytics tracking

📱 **Tech Stack:**
• React Native 0.74.5
• Expo SDK 52
• TypeScript
• React Navigation v6

⚡ **Quick Setup:**
1. Download & extract
2. Run \`npm install\`
3. Customize branding
4. Deploy to stores

🔥 **Bonus Included:**
• Complete documentation
• Video tutorials
• Marketing templates
• 30-day support

**Special Launch Price: $${price}** (Regular: $${price + 20})

⭐ **100% Satisfaction Guaranteed!**`;
  }

  /**
   * Create product on Gumroad
   */
  async createProduct(productData) {
    try {
      const response = await axios.post(`${this.baseURL}/products`, {
        name: productData.name,
        description: productData.description,
        price: productData.price * 100, // Gumroad uses cents
        content_type: 'zip',
        tags: productData.tags.join(','),
        published: false // Start as draft
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Product created: ${response.data.product.name}`);
      return response.data.product;
    } catch (error) {
      console.error('❌ Failed to create product:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Upload ZIP file to product
   */
  async uploadFile(productId, filePath) {
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filePath));

      const response = await axios.put(`${this.baseURL}/products/${productId}`, form, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          ...form.getHeaders()
        }
      });

      console.log(`✅ File uploaded successfully`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to upload file:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Publish product (make it live)
   */
  async publishProduct(productId) {
    try {
      const response = await axios.put(`${this.baseURL}/products/${productId}`, {
        published: true
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      console.log(`✅ Product published: ${response.data.product.short_url}`);
      return response.data.product;
    } catch (error) {
      console.error('❌ Failed to publish product:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Full deployment pipeline
   */
  async deploy(options) {
    const {
      templateName,
      templatePath = '.',
      price,
      features = [],
      tags = ['react-native', 'template', 'mobile-app'],
      autoPublish = false
    } = options;

    console.log(`🚀 Starting Gumroad deployment for ${templateName}...`);

    try {
      // 1. Create template ZIP
      const zipPath = path.join(__dirname, `${templateName}-template.zip`);
      await this.createTemplateZip(templatePath, zipPath);

      // 2. Generate product data
      const productData = {
        name: `${templateName} - React Native Template`,
        description: this.generateDescription(templateName, price, features),
        price: price,
        tags: tags
      };

      // 3. Create product on Gumroad
      const product = await this.createProduct(productData);

      // 4. Upload ZIP file
      await this.uploadFile(product.id, zipPath);

      // 5. Optionally publish
      if (autoPublish) {
        await this.publishProduct(product.id);
      }

      // 6. Cleanup
      fs.unlinkSync(zipPath);

      console.log(`\n🎉 Deployment Complete!`);
      console.log(`📦 Product ID: ${product.id}`);
      console.log(`🔗 Edit URL: https://gumroad.com/products/${product.id}/edit`);
      if (autoPublish) {
        console.log(`🌐 Live URL: ${product.short_url}`);
      }

      return product;

    } catch (error) {
      console.error('💥 Deployment failed:', error.message);
      throw error;
    }
  }
}

// CLI Integration
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  args.forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=');
      options[key] = value || true;
    }
  });

  const deployer = new GumroadDeployer();
  
  // Default template deployment
  const deployOptions = {
    templateName: options.template || 'Crypto Tracker',
    templatePath: options.path || '.',
    price: parseInt(options.price) || 45,
    features: [
      'Real-time cryptocurrency price tracking',
      'Dark/light theme toggle',
      'Add/remove coins functionality',
      'Ad monetization ready',
      'Cross-platform (iOS/Android/Web)',
      'TypeScript + React Navigation',
      'Complete documentation',
      'Marketing guides included'
    ],
    tags: ['react-native', 'crypto', 'mobile-app', 'template', 'typescript'],
    autoPublish: options.publish === 'true'
  };

  deployer.deploy(deployOptions)
    .then(product => {
      console.log('\n💰 Next Steps:');
      console.log('1. Add screenshots to product page');
      console.log('2. Set up affiliate program');
      console.log('3. Create marketing campaigns');
      console.log('4. Track analytics and optimize');
    })
    .catch(error => {
      console.error('Deployment failed:', error.message);
      process.exit(1);
    });
}

module.exports = GumroadDeployer;