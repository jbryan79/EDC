# James's Portable Workstation

A professional showcase of an ultraportable mobile workstation setup.

## 🚀 Quick Deploy to Vercel

1. **Create a Vercel account** at vercel.com (if you don't have one)

2. **Install Vercel CLI** (optional, or use web UI):
   ```bash
   npm i -g vercel
   ```

3. **Deploy**:
   - Drag and drop the project folder into Vercel dashboard, OR
   - Run `vercel` in the project directory

4. **Done!** Your site is live.

## 📸 Replacing Placeholder Images

Currently using stock images from Unsplash. Replace with your actual photos:

### Current Image URLs (in index.html):

1. **ASUS Zenbook** (line ~235):
   - Current: `https://images.unsplash.com/photo-1593642632823-8f785ba67e45`
   - Replace with: Your laptop photo

2. **Lenovo Monitor** (line ~259):
   - Current: `https://images.unsplash.com/photo-1527443224154-c4a3942d3acf`
   - Replace with: Your monitor photo

3. **Ugreen USB-C Cable** (line ~282):
   - Current: `https://images.unsplash.com/photo-1625948515291-69613efd103f`
   - Replace with: Your cable photo

4. **Ugreen USB Hub** (line ~305):
   - Current: `https://images.unsplash.com/photo-1625948515291-69613efd103f`
   - Replace with: Your hub photo

5. **ASUS 65W Charger** (line ~329):
   - Current: `https://images.unsplash.com/photo-1583863788434-e58a36330cf0`
   - Replace with: Your charger photo

6. **Ugreen 140W Charger** (line ~352):
   - Current: `https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5`
   - Replace with: Your GaN charger photo

7. **Logitech MX Master 2** (line ~376):
   - Current: `https://images.unsplash.com/photo-1527864550417-7fd91fc51a46`
   - Replace with: Your mouse photo

8. **Bose Headphones** (line ~399):
   - Current: `https://images.unsplash.com/photo-1546435770-a3e426bf472b`
   - Replace with: Your headphones photo

### How to Replace:

**Option A: Use Image URLs**
1. Upload your photos to Imgur, Google Photos, or any image host
2. Copy the direct image URL
3. Replace the Unsplash URL in index.html

**Option B: Local Images**
1. Create an `images/` folder in your project
2. Add your photos (e.g., `zenbook.jpg`, `monitor.jpg`)
3. Update URLs to `./images/zenbook.jpg`, etc.

## 🎨 Five Themes Included

- **Dark Pro** (default) - Professional dark theme
- **Apple Clean** - Light, minimal, Apple-inspired
- **Neon** - Cyberpunk vibes
- **Amazon** - E-commerce style
- **Ultra Gradient** - Premium gradient backgrounds

Theme preference is saved in localStorage.

## ✅ What's Included

- ✅ 8 product cards with specs, prices, weights
- ✅ Responsive grid layout (mobile to desktop)
- ✅ Smooth animations and hover effects
- ✅ Stats overview (weight, items, value)
- ✅ Category organization
- ✅ Clean, maintainable code
- ✅ No dependencies (pure HTML/CSS/JS)
- ✅ All 5 themes working perfectly
- ✅ Theme switcher with localStorage

## 📝 Updates Needed Tomorrow

When you confirm these details, I'll update:

1. **Lenovo Monitor**: Model name + resolution
2. **Ugreen Hub**: Exact model number
3. **Bose Headphones**: Specific model (QC35 II, QC45, etc.)
4. **Logitech Mouse**: Confirm MX Master 2 or 2S
5. **Any missing items**: Bag, phone, other accessories

## 🖼️ Photo Recommendations

For best results, take photos with:
- Clean, simple background (white or gray)
- Good lighting (natural light near window)
- Product centered, slightly angled
- Consistent style across all items

Or just send whatever you have - I can work with it!

## 📊 Current Stats

- **Total Weight**: ~8.5 lbs
- **Total Items**: 8 core pieces
- **Total Value**: ~$2,500
- **Peak Power**: 140W (Ugreen charger)

## 🔧 Technical Details

- Single HTML file (no build process needed)
- Tailwind CSS via CDN
- Vanilla JavaScript (no frameworks)
- CSS custom properties for theming
- localStorage for theme persistence
- Optimized for Vercel deployment

## 🎯 Future Additions

Optional features we discussed:
- Add bag/backpack item
- Add phone if part of workstation
- More detailed "why I chose this" sections
- Links to purchase (Amazon, manufacturer)
- Total cost calculator
- Packing/organization tips

---

**Built with**: HTML, CSS, JavaScript  
**Hosted on**: Vercel  
**Themes**: 5 custom color schemes  
**Status**: Ready for photos & final polish
