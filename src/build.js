require('dotenv').config();
const ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');
const fs = require('fs');
const path = require('path');

// Amazon PA-API Configuration
const defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
defaultClient.accessKey = process.env.AWS_ACCESS_KEY_ID;
defaultClient.secretKey = process.env.AWS_SECRET_ACCESS_KEY;
defaultClient.host = 'webservices.amazon.com';
defaultClient.region = process.env.AWS_REGION || 'us-east-1';

const api = new ProductAdvertisingAPIv1.DefaultApi();
const partnerTag = process.env.AWS_PARTNER_TAG;

// Load products data
const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'products.json'), 'utf8'));

/**
 * Fetch product data from Amazon PA-API
 */
async function fetchAmazonProductData(asins) {
  const getItemsRequest = new ProductAdvertisingAPIv1.GetItemsRequest();

  getItemsRequest.ItemIds = asins;
  getItemsRequest.PartnerTag = partnerTag;
  getItemsRequest.PartnerType = 'Associates';
  getItemsRequest.Resources = [
    'ItemInfo.Title',
    'ItemInfo.Features',
    'Offers.Listings.Price',
    'Offers.Listings.Availability.Message',
    'Offers.Listings.DeliveryInfo.IsPrimeEligible',
    'Images.Primary.Large',
    'CustomerReviews.StarRating',
    'CustomerReviews.Count'
  ];

  try {
    console.log(`Fetching data for ASINs: ${asins.join(', ')}`);
    const response = await new Promise((resolve, reject) => {
      api.getItems(getItemsRequest, (error, data) => {
        if (error) {
          console.error('Amazon API Error:', error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });

    return response;
  } catch (error) {
    console.error('Error fetching from Amazon:', error.message);
    return null;
  }
}

/**
 * Extract product info from Amazon API response
 */
function extractProductInfo(item) {
  const info = {
    title: item.ItemInfo?.Title?.DisplayValue || 'N/A',
    price: item.Offers?.Listings?.[0]?.Price?.DisplayAmount || 'Check Amazon',
    availability: item.Offers?.Listings?.[0]?.Availability?.Message || 'Available',
    isPrime: item.Offers?.Listings?.[0]?.DeliveryInfo?.IsPrimeEligible || false,
    image: item.Images?.Primary?.Large?.URL || '',
    starRating: item.CustomerReviews?.StarRating?.Value || 0,
    reviewCount: item.CustomerReviews?.Count || 0,
    features: item.ItemInfo?.Features?.DisplayValues || []
  };

  return info;
}

/**
 * Generate star HTML
 */
function generateStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '★'.repeat(fullStars);
  if (hasHalfStar) stars += '☆';
  stars += '☆'.repeat(emptyStars);

  return stars;
}

/**
 * Generate product card HTML
 */
function generateProductCard(product, amazonData) {
  const isPrime = amazonData?.isPrime;
  const primeHTML = isPrime ? `<div class="prime-badge" style="position: absolute; top: 10px; right: 10px; background: #00A8E1; color: white; padding: 5px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 700;">Prime</div>` : '';

  const imageSrc = amazonData?.image || '';
  const imageHTML = imageSrc ?
    `<img src="${imageSrc}" alt="${product.customTitle}" style="width: 100%; height: 100%; object-fit: contain;">` :
    `<span style="font-size: 4rem;">${getEmojiForBrand(product.brand)}</span>`;

  const stars = amazonData?.starRating ? generateStars(amazonData.starRating) : '★★★★★';
  const reviewText = amazonData?.reviewCount && amazonData.reviewCount > 0 ?
    `${amazonData.starRating || 'N/A'}/5 (${amazonData.reviewCount.toLocaleString()} reviews)` :
    (product.badge || 'Premium Product');

  const price = amazonData?.price || 'Check Price';
  const priceHTML = price !== 'Check Amazon' && price !== 'Check Price' ?
    `<div class="price" style="font-size: 1.5rem; font-weight: 800; color: #ff8c32; margin-left: 20px;">${price}</div>` :
    '';

  const availabilityHTML = amazonData?.availability ?
    `<div class="availability" style="color: #4CAF50; font-size: 0.9rem; margin: 15px 0;">${amazonData.availability}</div>` :
    '';

  const whyLoveHTML = product.whyLove && product.whyLove.length > 0 ?
    `<div class="why-love">
      <h4>Why I Love This</h4>
      <ul>
        ${product.whyLove.map(item => `<li>${item}</li>`).join('\n                ')}
      </ul>
    </div>` : '';

  const affiliateLink = `https://www.amazon.com/dp/${product.asin}?tag=${partnerTag}`;

  return `
                <div class="product-card">
                    <div class="card-content">
                        <div class="product-image" style="position: relative;">
                            ${primeHTML}
                            ${imageHTML}
                        </div>
                        <span class="product-badge">${product.brand}</span>
                        <h3>${product.customTitle}</h3>
                        <p class="description">${product.customDescription}</p>

                        ${whyLoveHTML}

                        <div class="price-rating">
                            <div class="rating">
                                <div class="stars">${stars}</div>
                                <div class="review-count">${reviewText}</div>
                            </div>
                            ${priceHTML}
                        </div>

                        ${availabilityHTML}

                        <a href="${affiliateLink}" class="cta-button" target="_blank" rel="noopener noreferrer">
                            <span>Check Latest Price on Amazon</span>
                            <span>→</span>
                        </a>
                    </div>
                </div>`;
}

/**
 * Get emoji for brand
 */
function getEmojiForBrand(brand) {
  const emojiMap = {
    'OLIGHT': '🔦',
    'SPYDERCO': '🔪',
    'UGREEN': '🔌',
    'ASUS': '💻',
    'PUZZLE': '🧩'
  };
  return emojiMap[brand] || '📦';
}

/**
 * Generate category section HTML
 */
function generateCategorySection(category, productsHTML) {
  return `
        <!-- CATEGORY: ${category.name} -->
        <section class="category-section">
            <div class="category-header">
                <span class="category-icon">${category.icon}</span>
                <h2 class="category-title">${category.name}</h2>
                <p class="category-description">
                    ${category.description}
                </p>
            </div>

            <div class="products-grid">
${productsHTML}
            </div>
        </section>`;
}

/**
 * Main build function
 */
async function build() {
  console.log('🚀 Starting Amazon PA-API integration build...\n');

  // Collect all ASINs (skip products that need ASIN)
  const validProducts = [];
  productsData.categories.forEach(category => {
    category.products.forEach(product => {
      if (product.asin && product.asin !== 'NEEDS_ASIN') {
        validProducts.push({ ...product, categoryId: category.id });
      } else {
        console.log(`⚠️  Skipping ${product.customTitle} - ASIN needed`);
      }
    });
  });

  const asins = validProducts.map(p => p.asin);

  if (asins.length === 0) {
    console.log('❌ No valid ASINs found. Please update products.json with ASINs.');
    process.exit(1);
  }

  // Fetch data from Amazon in batches of 10 (PA-API limit)
  const batchSize = 10;
  const amazonDataMap = {};

  for (let i = 0; i < asins.length; i += batchSize) {
    const batchAsins = asins.slice(i, i + batchSize);
    console.log(`\n📦 Batch ${Math.floor(i / batchSize) + 1}: Fetching ${batchAsins.length} products...`);

    const response = await fetchAmazonProductData(batchAsins);

    if (response && response.ItemsResult && response.ItemsResult.Items) {
      response.ItemsResult.Items.forEach(item => {
        const asin = item.ASIN;
        amazonDataMap[asin] = extractProductInfo(item);
        console.log(`   ✓ ${amazonDataMap[asin].title}`);
      });
    }

    // Rate limiting: wait 1 second between batches
    if (i + batchSize < asins.length) {
      console.log('   ⏳ Rate limiting (1 second)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log(`\n✅ Fetched data for ${Object.keys(amazonDataMap).length} products\n`);

  // Generate category sections
  const categorySections = productsData.categories.map(category => {
    const categoryProducts = validProducts.filter(p => p.categoryId === category.id);

    if (categoryProducts.length === 0) {
      console.log(`⚠️  No valid products in category: ${category.name}`);
      return '';
    }

    const productsHTML = categoryProducts.map(product => {
      const amazonData = amazonDataMap[product.asin];
      return generateProductCard(product, amazonData);
    }).join('\n');

    return generateCategorySection(category, productsHTML);
  }).join('\n\n');

  // Read the original index.html as a base template
  let outputHTML = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

  // Replace product sections with Amazon-powered content
  // Find and replace each category section
  productsData.categories.forEach(category => {
    const categoryProducts = validProducts.filter(p => p.categoryId === category.id);

    if (categoryProducts.length === 0) return;

    // Generate the new products HTML for this category
    const productsHTML = categoryProducts.map(product => {
      const amazonData = amazonDataMap[product.asin];
      return generateProductCard(product, amazonData);
    }).join('\n');

    // Find the products-grid for this category and replace its contents
    // Use a regex to find the category section and its products-grid
    const categoryPattern = new RegExp(
      `(<section class="category-section">.*?<h2 class="category-title">${category.name}</h2>.*?<div class="products-grid">)([\\s\\S]*?)(<\\/div>\\s*<\\/div>\\s*(?:<div class="view-all-link">|<\\/section>))`,
      'i'
    );

    outputHTML = outputHTML.replace(categoryPattern, (match, before, oldProducts, after) => {
      console.log(`   📝 Updating ${category.name} section with Amazon data`);
      return before + '\n' + productsHTML + '\n            ' + after;
    });
  });

  console.log('\n✅ Injected Amazon data into HTML\n');

  // Create dist directory if it doesn't exist
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write output
  const outputPath = path.join(distDir, 'index.html');
  fs.writeFileSync(outputPath, outputHTML, 'utf8');

  // Copy static assets
  console.log('📋 Copying static assets...');
  const assetsToCopy = ['ugreen-vs-anker.html', 'style.css', 'app.js', 'script.js', 'toolbox-favicon.svg', 'robots.txt', 'sitemap.xml'];
  assetsToCopy.forEach(asset => {
    const srcPath = path.join(__dirname, '..', asset);
    const destPath = path.join(distDir, asset);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`   ✓ Copied ${asset}`);
    }
  });

  // Copy images directory
  const imagesDir = path.join(__dirname, '..', 'images');
  const distImagesDir = path.join(distDir, 'images');
  if (fs.existsSync(imagesDir)) {
    if (!fs.existsSync(distImagesDir)) {
      fs.mkdirSync(distImagesDir, { recursive: true });
    }
    const images = fs.readdirSync(imagesDir);
    images.forEach(image => {
      fs.copyFileSync(
        path.join(imagesDir, image),
        path.join(distImagesDir, image)
      );
    });
    console.log(`   ✓ Copied ${images.length} images`);
  }

  console.log(`\n✨ Build complete! Output: ${outputPath}\n`);
  console.log('📊 Summary:');
  console.log(`   • Total products processed: ${validProducts.length}`);
  console.log(`   • Amazon data fetched: ${Object.keys(amazonDataMap).length}`);
  console.log(`   • Categories: ${productsData.categories.length}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Add your API credentials to .env file');
  console.log('   2. Update products.json with missing ASINs');
  console.log('   3. Run: npm run build');
  console.log('   4. Test locally: npm run dev');
  console.log('   5. Deploy: npm run deploy\n');
}

// Run build
build().catch(error => {
  console.error('\n❌ Build failed:', error);
  process.exit(1);
});
