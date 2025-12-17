# Amazon Product Advertising API Setup Guide

## ✅ Implementation Complete!

Your Amazon PA-API 5.0 integration is now set up. Follow these steps to complete the configuration and test the build.

## 📋 What Was Implemented

- ✅ Node.js project with all dependencies
- ✅ Product catalog in `src/products.json`
- ✅ Build script with Amazon PA-API integration (`src/build.js`)
- ✅ Environment configuration (`.env.example`)
- ✅ Git ignore rules for secrets
- ✅ Netlify deployment configuration

## 🔧 Next Steps

### 1. Add Your API Credentials

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Amazon PA-API credentials:

**Note:** We use `MY_` prefix because standard AWS variable names are reserved by the deployment platform.

```
MY_AWS_ACCESS_KEY_ID=your_access_key_here
MY_AWS_SECRET_ACCESS_KEY=your_secret_key_here
MY_AWS_PARTNER_TAG=mylineup-20
MY_AWS_REGION=us-east-1
```

**Where to find these:**
- Go to: https://affiliate-program.amazon.com/home
- Navigate to: Tools → Product Advertising API
- Get your Access Key, Secret Key, and Associate Tag

### 2. Update Products with Missing ASINs

Several products in `src/products.json` are marked as `"asin": "NEEDS_ASIN"`. You need to convert the short links to ASINs:

**Products needing ASINs:**
1. Spyderco Para Military 2 (`amzn.to/48YU7vo`)
2. ASUS Zenbook 14 Copilot AI Laptop (`amzn.to/4qeBACy`)
3. Bicycle puzzle (`amzn.to/49fikPt`)
4. Satellite in Cage (`amzn.to/48VW5Nj`)
5. Trick Bolt (`amzn.to/45aNVzi`)
6. Star in Circle (`amzn.to/4s21DhO`)
7. Horseshoe (`amzn.to/4rWylkR`)

**How to get ASINs:**
1. Click the short link
2. Look at the full Amazon URL
3. Extract the ASIN from the URL: `amazon.com/dp/B0XXXXXX`
4. Update `src/products.json` with the ASIN

Example:
```json
{
  "asin": "B08XXXXXX",
  "customTitle": "Product Name",
  ...
}
```

### 3. Test the Build Locally

Run the build script to fetch product data from Amazon:

```bash
npm run build
```

This will:
- Fetch real-time data from Amazon for all valid ASINs
- Generate product cards with prices, images, ratings
- Create the `dist/` directory with your updated site

### 4. Preview Locally

Start a local server to preview:

```bash
npm run dev
```

Open http://localhost:8080 in your browser to see your site with live Amazon data.

### 5. Add Netlify Environment Variables

Before deploying, add your API credentials to Netlify:

**Important:** Use `MY_` prefix because Netlify reserves standard AWS variable names.

1. Go to: https://app.netlify.com/sites/YOUR_SITE/settings/deploys#environment
2. Add these variables:
   - `MY_AWS_ACCESS_KEY_ID` = your_access_key
   - `MY_AWS_SECRET_ACCESS_KEY` = your_secret_key
   - `MY_AWS_PARTNER_TAG` = mylineup-20
   - `MY_AWS_REGION` = us-east-1

### 6. Deploy to Netlify

Option 1 - Push to Git (Recommended):
```bash
git add .
git commit -m "Add Amazon API integration"
git push
```
Netlify will auto-deploy if connected to your repo.

Option 2 - Manual Deploy:
```bash
npm run build
netlify deploy --prod
```

## 📂 Project Structure

```
EDC/
├── src/
│   ├── products.json           # Your product catalog (UPDATE THIS!)
│   ├── build.js                # Build script with PA-API integration
│   └── templates/              # (Reserved for future enhancements)
├── dist/                       # Generated site (auto-generated)
├── node_modules/               # Dependencies (gitignored)
├── .env                        # API credentials (gitignored - CREATE THIS!)
├── .env.example                # Template for credentials
├── .gitignore                  # Git ignore rules
├── package.json                # Node.js project config
├── netlify.toml                # Netlify deployment config
└── index.html                  # Original site (used as template)
```

## 🔍 How It Works

1. **Build Time**: When you run `npm run build`, the script:
   - Reads `src/products.json`
   - Fetches live data from Amazon PA-API for each ASIN
   - Generates product cards with real prices, images, ratings
   - Creates static HTML files in `dist/`

2. **Deployment**: Netlify automatically:
   - Installs dependencies
   - Runs the build script
   - Deploys the static files from `dist/`

3. **Updates**: To update product data:
   - Run `npm run build` locally, or
   - Push to git (Netlify rebuilds automatically)

## 🎨 Features Implemented

- ✅ Real-time product prices from Amazon
- ✅ Product images from Amazon CDN
- ✅ Live ratings and review counts
- ✅ Stock availability status
- ✅ Prime eligibility badges
- ✅ Automatic affiliate link generation
- ✅ Rate limiting (respects 1 req/sec API limit)
- ✅ Batch processing (10 products per request)
- ✅ Error handling and logging

## 🛠 Maintenance

### Adding a New Product

1. Get the product ASIN from Amazon
2. Add to `src/products.json`:

```json
{
  "asin": "B0XXXXXXXX",
  "customTitle": "Product Name",
  "customDescription": "Your honest review",
  "whyLove": [
    "Feature 1",
    "Feature 2"
  ],
  "brand": "BRAND NAME"
}
```

3. Run `npm run build`
4. Deploy

### Updating Product Data

Amazon data (prices, ratings) updates automatically on each build. To refresh:

```bash
npm run build
npm run deploy
```

Or just push to git if auto-deploy is enabled.

## ⚠️ Important Notes

1. **API Limits**: Free tier = 8,640 requests/day (1 req/sec)
2. **ASINs Required**: Products marked `NEEDS_ASIN` will be skipped during build
3. **Rate Limiting**: Build script automatically waits 1 second between API calls
4. **Credentials**: Never commit `.env` to git (already in `.gitignore`)

## 🐛 Troubleshooting

### Build fails with "No valid ASINs found"
- Update `src/products.json` with real ASINs
- At least one product needs a valid ASIN

### Amazon API errors
- Check your credentials in `.env`
- Verify your Amazon Associates account is approved
- Ensure you've made 3+ qualifying sales (PA-API requirement)

### Products not showing data
- Check the build logs for errors
- Verify the ASIN is correct
- Some products may not be available via PA-API

## 📚 Resources

- [Amazon PA-API Documentation](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon Associates Central](https://affiliate-program.amazon.com/)
- [Product Advertising API Credentials](https://webservices.amazon.com/paapi5/documentation/register-for-pa-api.html)

## 🎯 Next Steps After Setup

1. ✅ Add API credentials to `.env`
2. ✅ Update missing ASINs in `src/products.json`
3. ✅ Run `npm run build` to test
4. ✅ Preview with `npm run dev`
5. ✅ Add credentials to Netlify
6. ✅ Deploy with `npm run deploy` or push to git
7. 🚀 Your site is live with real Amazon data!

---

**Need Help?** Check the implementation plan at `.claude/plans/cosmic-sniffing-iverson.md`
