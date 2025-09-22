#!/usr/bin/env node

/**
 * Social Media Automation Script
 * Posts template announcements across multiple platforms
 * 
 * Usage: node social-blast.js --template="crypto-tracker" --platforms="twitter,linkedin"
 */

const axios = require('axios');
const fs = require('fs');

class SocialMediaBlaster {
  constructor() {
    this.apis = {
      twitter: {
        bearerToken: process.env.TWITTER_BEARER_TOKEN,
        apiKey: process.env.TWITTER_API_KEY,
        apiSecret: process.env.TWITTER_API_SECRET,
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessSecret: process.env.TWITTER_ACCESS_SECRET
      },
      openai: {
        apiKey: process.env.OPENAI_API_KEY
      }
    };
  }

  /**
   * Generate marketing copy with OpenAI
   */
  async generateContent(templateName, platform, tone = 'professional') {
    const prompts = {
      twitter: `Create an engaging Twitter thread (5 tweets) about a new ${templateName} React Native template. Include:
- Hook tweet with emoji and value prop
- Technical details (React Native, TypeScript, Expo)
- Monetization features (ads, premium)
- Call to action with pricing
- Relevant hashtags (#ReactNative, #MobileDev, #Template)
Tone: ${tone}, exciting, dev-focused`,

      linkedin: `Write a professional LinkedIn post about launching a ${templateName} React Native template for developers. Include:
- Professional hook about mobile development
- Business value and ROI
- Technical specifications
- Success metrics and pricing
- Call to action for developers and entrepreneurs
Tone: ${tone}, business-focused`,

      reddit: `Write a helpful Reddit post for r/reactnative about a new ${templateName} template. Include:
- Genuine value-first approach
- Technical implementation details
- Open source elements
- Community feedback request
- Subtle mention of commercial version
Tone: ${tone}, community-focused, helpful`
    };

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'You are a marketing expert specializing in developer tools and templates.' },
          { role: 'user', content: prompts[platform] }
        ],
        max_tokens: 500,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.apis.openai.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(`❌ Failed to generate ${platform} content:`, error.message);
      return this.getFallbackContent(templateName, platform);
    }
  }

  /**
   * Fallback content if AI generation fails
   */
  getFallbackContent(templateName, platform) {
    const fallbacks = {
      twitter: `🚀 Just launched: ${templateName} React Native Template!

✨ Features:
• Real-time data tracking
• Dark/light themes
• Ad monetization ready
• Cross-platform (iOS/Android)
• TypeScript + Expo SDK 52

Perfect for developers building micro-SaaS! 💰

#ReactNative #MobileDev #Template #Startup`,

      linkedin: `🚀 Excited to share my latest React Native template: ${templateName}

As mobile developers, we know the pain of starting from scratch. This production-ready template includes:

✅ Modern tech stack (React Native 0.74.5 + TypeScript)
✅ Monetization features (ads, premium tiers)
✅ Cross-platform compatibility
✅ Complete documentation

Perfect for entrepreneurs and developers looking to build mobile apps quickly.

What mobile app are you planning to build? Drop a comment below! 👇`,

      reddit: `Built a ${templateName} React Native template - feedback welcome!

Hey r/reactnative! I've been working on a production-ready template that includes:

• React Native 0.74.5 + TypeScript
• Expo SDK 52 for cross-platform deployment
• Modern navigation and state management
• Dark/light theme implementation
• Comprehensive documentation

The code is clean, well-documented, and follows React Native best practices. Would love to get the community's feedback on the architecture and implementation!

Technical details and demo available in the repo. Happy to answer questions about any implementation decisions.`
    };

    return fallbacks[platform] || `Check out my new ${templateName} React Native template!`;
  }

  /**
   * Post to Twitter using API v2
   */
  async postToTwitter(content) {
    try {
      // Split content into tweets if it's a thread
      const tweets = content.split('\n\n').filter(tweet => tweet.trim());
      const results = [];

      for (let i = 0; i < tweets.length; i++) {
        const tweetData = {
          text: tweets[i].substring(0, 280) // Twitter character limit
        };

        // If this is a reply to previous tweet, add reply reference
        if (i > 0 && results[i-1]) {
          tweetData.reply = {
            in_reply_to_tweet_id: results[i-1].data.id
          };
        }

        const response = await axios.post('https://api.twitter.com/2/tweets', tweetData, {
          headers: {
            'Authorization': `Bearer ${this.apis.twitter.bearerToken}`,
            'Content-Type': 'application/json'
          }
        });

        results.push(response.data);
        console.log(`✅ Posted tweet ${i + 1}/${tweets.length}: ${response.data.data.id}`);

        // Rate limiting: wait 1 second between tweets
        if (i < tweets.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      return results;
    } catch (error) {
      console.error('❌ Twitter posting failed:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Post to LinkedIn (requires manual OAuth setup)
   */
  async postToLinkedIn(content) {
    console.log('📝 LinkedIn content generated:');
    console.log('---');
    console.log(content);
    console.log('---');
    console.log('⚠️  LinkedIn posting requires manual OAuth setup.');
    console.log('💡 Copy the content above and post manually to your LinkedIn profile.');
    
    return { status: 'manual_required', content };
  }

  /**
   * Post to Reddit (manual posting with content generation)
   */
  async postToReddit(content) {
    console.log('📝 Reddit post generated for r/reactnative:');
    console.log('---');
    console.log(content);
    console.log('---');
    console.log('⚠️  Reddit posting requires manual submission.');
    console.log('💡 Copy the content above and post to r/reactnative.');
    
    return { status: 'manual_required', content };
  }

  /**
   * Generate and post across multiple platforms
   */
  async blastAcrossPlatforms(templateName, platforms, options = {}) {
    console.log(`🚀 Starting social media blast for ${templateName}...`);
    
    const results = {};

    for (const platform of platforms) {
      try {
        console.log(`\n📱 Processing ${platform}...`);
        
        // Generate content
        const content = await this.generateContent(templateName, platform, options.tone);
        
        // Post to platform
        switch (platform) {
          case 'twitter':
            results[platform] = await this.postToTwitter(content);
            break;
          case 'linkedin':
            results[platform] = await this.postToLinkedIn(content);
            break;
          case 'reddit':
            results[platform] = await this.postToReddit(content);
            break;
          default:
            console.log(`⚠️  Platform ${platform} not supported yet`);
        }
        
      } catch (error) {
        console.error(`❌ Failed to process ${platform}:`, error.message);
        results[platform] = { error: error.message };
      }
    }

    return results;
  }

  /**
   * Generate marketing analytics report
   */
  generateReport(templateName, results, price) {
    const report = `
🎯 Social Media Blast Report: ${templateName}

📊 Platforms Targeted: ${Object.keys(results).length}
💰 Product Price: $${price}
🎯 Target Audience: React Native developers, entrepreneurs

📈 Expected Results (7 days):
• Twitter: 50-200 engagements, 2-5 clicks
• LinkedIn: 20-100 views, 1-3 professional inquiries  
• Reddit: 10-50 upvotes, community feedback

🎯 Success Metrics to Track:
• Template downloads/purchases
• Repository stars/forks
• Social media engagement
• Website traffic from social links

💡 Next Steps:
1. Monitor engagement for 24-48 hours
2. Respond to comments and questions
3. Share user testimonials and reviews
4. Plan follow-up content (tutorials, updates)
5. A/B test different content styles

Generated: ${new Date().toISOString()}
`;

    console.log(report);
    
    // Save report to file
    fs.writeFileSync(`social-blast-report-${Date.now()}.txt`, report);
    
    return report;
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

  // Validate required environment variables
  const requiredEnvVars = ['OPENAI_API_KEY'];
  const missingVars = requiredEnvVars.filter(env => !process.env[env]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.log('\n💡 Setup instructions:');
    console.log('export OPENAI_API_KEY="your-openai-key"');
    console.log('export TWITTER_BEARER_TOKEN="your-twitter-token"');
    process.exit(1);
  }

  const blaster = new SocialMediaBlaster();
  
  const templateName = options.template || 'Crypto Tracker';
  const platforms = options.platforms ? options.platforms.split(',') : ['twitter', 'linkedin'];
  const price = options.price || 45;
  
  blaster.blastAcrossPlatforms(templateName, platforms, {
    tone: options.tone || 'professional'
  })
  .then(results => {
    console.log('\n🎉 Social media blast complete!');
    blaster.generateReport(templateName, results, price);
  })
  .catch(error => {
    console.error('💥 Blast failed:', error.message);
    process.exit(1);
  });
}

module.exports = SocialMediaBlaster;