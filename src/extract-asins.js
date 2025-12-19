const https = require('https');
const http = require('http');

// Short links that need ASIN extraction
const shortLinks = [
  { name: 'Spyderco Para Military 2', url: 'https://amzn.to/48YU7vo' },
  { name: 'ASUS Zenbook 14', url: 'https://amzn.to/4qeBACy' },
  { name: 'Bicycle', url: 'https://amzn.to/49fikPt' },
  { name: 'Satellite in Cage', url: 'https://amzn.to/48VW5Nj' },
  { name: 'Trick Bolt', url: 'https://amzn.to/45aNVzi' },
  { name: 'Star in Circle', url: 'https://amzn.to/4s21DhO' },
  { name: 'Horseshoe', url: 'https://amzn.to/4rWylkR' }
];

/**
 * Follow redirects and extract ASIN from final URL
 */
function getASIN(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    client.request(url, options, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        getASIN(res.headers.location).then(resolve).catch(reject);
      } else {
        // Extract ASIN from final URL
        const finalUrl = res.headers.location || url;
        const asinMatch = finalUrl.match(/\/dp\/([A-Z0-9]{10})/i) ||
                         finalUrl.match(/\/gp\/product\/([A-Z0-9]{10})/i) ||
                         finalUrl.match(/ASIN[=\/]([A-Z0-9]{10})/i);

        if (asinMatch && asinMatch[1]) {
          resolve(asinMatch[1]);
        } else {
          reject(new Error(`Could not extract ASIN from: ${finalUrl}`));
        }
      }
    }).on('error', reject).end();
  });
}

/**
 * Process all short links
 */
async function extractAllASINs() {
  console.log('🔍 Extracting ASINs from short links...\n');

  const results = [];

  for (const link of shortLinks) {
    try {
      console.log(`Fetching: ${link.name}`);
      console.log(`   URL: ${link.url}`);

      const asin = await getASIN(link.url);

      console.log(`   ✅ ASIN: ${asin}\n`);

      results.push({
        name: link.name,
        shortLink: link.url,
        asin: asin,
        success: true
      });

      // Rate limiting - wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}\n`);

      results.push({
        name: link.name,
        shortLink: link.url,
        asin: null,
        success: false,
        error: error.message
      });
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 EXTRACTION SUMMARY');
  console.log('='.repeat(60) + '\n');

  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.name}`);
      console.log(`   ASIN: ${result.asin}`);
      console.log(`   Short Link: ${result.shortLink}\n`);
    } else {
      console.log(`❌ ${result.name}`);
      console.log(`   Error: ${result.error}`);
      console.log(`   Short Link: ${result.shortLink}\n`);
    }
  });

  console.log('='.repeat(60));
  console.log(`Total: ${results.filter(r => r.success).length}/${results.length} successful`);
  console.log('='.repeat(60));

  return results;
}

// Run extraction
extractAllASINs().catch(console.error);
