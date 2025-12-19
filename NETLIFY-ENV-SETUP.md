# 🚀 Netlify Environment Variables Setup Guide

## Why This Matters

Your `.env` file works locally, but Netlify needs its own copy of your Amazon API credentials to build your site in the cloud.

**Important:** We use `MY_` prefix because Netlify reserves standard AWS variable names for its own infrastructure.

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Get Your Netlify Site

**If you haven't deployed yet:**
1. Go to https://app.netlify.com/
2. Sign up or log in
3. Click **"Add new site"** → **"Import an existing project"**
4. Connect your GitHub repo (recommended) OR drag-and-drop the `dist` folder

**If you've already deployed:**
1. Go to https://app.netlify.com/
2. Find your site in the list
3. Click on it

---

### Step 2: Navigate to Environment Variables

1. **From your site dashboard:**
   - Click **"Site configuration"** (left sidebar)
   - Or click **"Site settings"** button

2. **Go to Environment Variables:**
   - In the left sidebar, click **"Environment variables"**
   - Or navigate to: `https://app.netlify.com/sites/YOUR-SITE-NAME/configuration/env`

---

### Step 3: Add Your API Credentials

You need to add **4 environment variables**. Here's what they should be:

#### Variable 1: MY_AWS_ACCESS_KEY_ID
- **Key:** `MY_AWS_ACCESS_KEY_ID`
- **Value:** `AKPAPAMQ3V1766011300` (from your `.env` file)
- **Scopes:** All scopes (default)

**How to add:**
1. Click **"Add a variable"** or **"New variable"**
2. Enter Key: `MY_AWS_ACCESS_KEY_ID`
3. Enter Value: `AKPAPAMQ3V1766011300`
4. Click **"Create variable"** or **"Add"**

---

#### Variable 2: MY_AWS_SECRET_ACCESS_KEY
- **Key:** `MY_AWS_SECRET_ACCESS_KEY`
- **Value:** `RdUFZ1AGhzDW+hBMRHmGuQRhR8zKuzjylSAkJN/o` (from your `.env` file)
- **Scopes:** All scopes (default)

**How to add:**
1. Click **"Add a variable"** or **"New variable"**
2. Enter Key: `MY_AWS_SECRET_ACCESS_KEY`
3. Enter Value: `RdUFZ1AGhzDW+hBMRHmGuQRhR8zKuzjylSAkJN/o`
4. Click **"Create variable"** or **"Add"**

⚠️ **SECURITY NOTE:** This is sensitive! Never share this value publicly.

---

#### Variable 3: MY_AWS_PARTNER_TAG
- **Key:** `MY_AWS_PARTNER_TAG`
- **Value:** `mylineup-20` (from your `.env` file)
- **Scopes:** All scopes (default)

**How to add:**
1. Click **"Add a variable"** or **"New variable"**
2. Enter Key: `MY_AWS_PARTNER_TAG`
3. Enter Value: `mylineup-20`
4. Click **"Create variable"** or **"Add"**

---

#### Variable 4: MY_AWS_REGION
- **Key:** `MY_AWS_REGION`
- **Value:** `us-east-1` (from your `.env` file)
- **Scopes:** All scopes (default)

**How to add:**
1. Click **"Add a variable"** or **"New variable"**
2. Enter Key: `MY_AWS_REGION`
3. Enter Value: `us-east-1`
4. Click **"Create variable"** or **"Add"**

---

### Step 4: Verify All Variables Are Added

Your environment variables page should now show:

```
MY_AWS_ACCESS_KEY_ID         = AKPAPAMQ3V17660113...  [hidden]
MY_AWS_SECRET_ACCESS_KEY     = ******************* [hidden]
MY_AWS_PARTNER_TAG           = mylineup-20
MY_AWS_REGION                = us-east-1
```

---

### Step 5: Trigger a New Deployment

Environment variables only take effect on **new builds**, not existing ones.

**Option A: Trigger Deploy (Easiest)**
1. Go to **"Deploys"** tab in Netlify
2. Click **"Trigger deploy"** dropdown
3. Click **"Clear cache and deploy site"**

**Option B: Push to Git (If using GitHub/Git)**
1. Make any small change to your code
2. Commit and push to your repo
3. Netlify will auto-deploy

**Option C: Manual Deploy**
```bash
npm run build
netlify deploy --prod
```

---

## ✅ Verification Checklist

After deploying, check these:

### 1. Build Logs Show API Calls
1. Go to **"Deploys"** tab in Netlify
2. Click on the latest deployment
3. View the build log
4. Look for:
   ```
   ✅ Fetched data for 11 products
   ```
   NOT:
   ```
   ✅ Fetched data for 0 products  ← This means env vars aren't working
   ```

### 2. Deployed Site Has Live Data
1. Visit your live site: `https://YOUR-SITE.netlify.app`
2. Check product cards for:
   - ✅ Real prices (not "Check Amazon")
   - ✅ Star ratings with review counts
   - ✅ Product images from Amazon

### 3. No Build Errors
1. Check the build log for no errors
2. Look for successful completion: `✨ Build complete!`

---

## 🐛 Troubleshooting

### Build Still Shows "0 Products Fetched"

**Cause:** Environment variables not set correctly

**Fix:**
1. Double-check spelling of variable names (exact match, case-sensitive)
2. Verify values match your `.env` file exactly
3. Make sure there are no extra spaces in values
4. Trigger a new deploy (clear cache)

---

### Build Fails with "Forbidden" Error

**Cause:** Amazon API credentials issue

**Fixes:**
1. Verify your Amazon Associates account has `edc.jamesabryan.com` added
2. Check that API credentials in Netlify match your `.env` file
3. Wait 1 hour after adding website to Amazon Associates
4. See `AMAZON-ASSOCIATES-QUICK-FIX.md` for detailed Amazon troubleshooting

---

### Can't Find Environment Variables Page

**Netlify UI Changes Often. Try These:**

**New UI (2024+):**
- Site Configuration → Environment variables

**Old UI:**
- Settings → Build & deploy → Environment → Environment variables

**Direct URL:**
- `https://app.netlify.com/sites/YOUR-SITE-NAME/configuration/env`

---

### Variables Not Taking Effect

**Remember:**
- Environment variables only apply to **new builds**
- Existing deployments don't get updated
- Always trigger a fresh deploy after adding/changing env vars

---

## 🔒 Security Best Practices

### DO ✅
- ✅ Keep credentials in Netlify environment variables
- ✅ Never commit `.env` to GitHub
- ✅ Use `.gitignore` to exclude `.env` file
- ✅ Rotate credentials every 6-12 months
- ✅ Use different credentials for production vs testing (optional)

### DON'T ❌
- ❌ Share your Secret Access Key with anyone
- ❌ Commit `.env` file to public repositories
- ❌ Post credentials in forums, Discord, or chat
- ❌ Include credentials in screenshots
- ❌ Use production credentials for local testing (if you have a high-traffic site)

---

## 📊 Quick Reference Table

| Variable Name | Your Value | Purpose |
|--------------|------------|---------|
| `MY_AWS_ACCESS_KEY_ID` | `AKPAPAMQ3V1766011300` | Amazon API Access Key |
| `MY_AWS_SECRET_ACCESS_KEY` | `RdUFZ1AGhzDW+hBMRHmG...` | Amazon API Secret Key (KEEP SECRET!) |
| `MY_AWS_PARTNER_TAG` | `mylineup-20` | Your Amazon Affiliate Tag |
| `MY_AWS_REGION` | `us-east-1` | Amazon API Region |

---

## 🚀 Alternative: Netlify CLI Setup

If you prefer using the command line:

### Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Login to Netlify
```bash
netlify login
```

### Link Your Site
```bash
netlify link
```

### Set Environment Variables via CLI
```bash
netlify env:set MY_AWS_ACCESS_KEY_ID "AKPAPAMQ3V1766011300"
netlify env:set MY_AWS_SECRET_ACCESS_KEY "RdUFZ1AGhzDW+hBMRHmGuQRhR8zKuzjylSAkJN/o"
netlify env:set MY_AWS_PARTNER_TAG "mylineup-20"
netlify env:set MY_AWS_REGION "us-east-1"
```

### Trigger Deploy
```bash
netlify deploy --prod
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Build logs show:**
   ```
   📦 Batch 1: Fetching 11 products...
   ✓ OLIGHT Baton4 Premium Edition EDC Flashlight
   ✓ Spyderco Para Military 2
   ✓ UGREEN 5-in-1 USB-C Hub
   ...
   ✅ Fetched data for 11 products
   ```

2. **Live site displays:**
   - Real product prices: `$29.99` (not "Check Amazon")
   - Star ratings: `★★★★★ 4.6/5 (12,847 reviews)`
   - Amazon product images (not emoji placeholders)
   - "Prime" badges on eligible products

3. **No errors in build log:**
   - No "Forbidden" errors
   - No "AssociateNotEligible" errors

---

## 📞 Need Help?

**Netlify Support:**
- Help docs: https://docs.netlify.com/environment-variables/overview/
- Community forum: https://answers.netlify.com/

**Amazon API Issues:**
- See `AMAZON-ASSOCIATES-QUICK-FIX.md`

**General Setup:**
- See `AMAZON-API-SETUP.md`

---

## 🎯 Next Steps After Setup

1. ✅ Verify build logs show successful API calls
2. ✅ Check live site for real product data
3. ✅ Set up custom domain (optional)
4. ✅ Submit sitemap to Google Search Console
5. ✅ Monitor Amazon Associates dashboard for clicks/sales

---

**Congratulations!** 🎉 Your site now has live Amazon product data and will update with each deployment.
