# Deployment Solutions for BSL Web Scraper

## ❌ Problem
signbsl.com returns `403 Forbidden` when accessed from Vercel's servers. This is anti-bot protection blocking Vercel's IP addresses.

## ✅ Working Solutions

### Solution 1: Deploy to Railway (Recommended - Easy)

**Railway.app** is a platform similar to Vercel but uses different IPs that aren't typically blocked.

**Steps:**
1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Next.js
5. Click "Deploy"
6. **Done!** Railway gives you a URL

**Pros:**
- Free tier available
- Similar to Vercel (easy deployment)
- Different IP ranges (less likely to be blocked)
- No changes to your code needed

**Cons:**
- Free tier has usage limits
- Slightly slower than Vercel

---

### Solution 2: Deploy to Render.com

**Render** is another Vercel alternative with different IP addresses.

**Steps:**
1. Create account at [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Set build command: `pnpm install && pnpm build`
5. Set start command: `pnpm start`
6. Click "Create Web Service"

**Pros:**
- Free tier (with limitations)
- Good for web scraping
- Auto-deploys from GitHub

**Cons:**
- Free tier spins down after inactivity
- Takes ~30s to wake up from sleep

---

### Solution 3: Use Vercel with ScraperAPI (Paid Solution)

If you must use Vercel, use a scraping service like ScraperAPI.

**Steps:**
1. Sign up at [scraperapi.com](https://scraperapi.com) (1000 free requests)
2. Get your API key
3. Update the code to use ScraperAPI

**Code changes needed:**
```typescript
// In app/api/scrape/route.ts
const apiKey = process.env.SCRAPER_API_KEY;
const url = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(
  `https://www.signbsl.com/sign/${word}`
)}`;
```

4. Add `SCRAPER_API_KEY` to Vercel environment variables

**Pros:**
- Works on Vercel
- Handles anti-bot protection

**Cons:**
- Costs money after free tier
- Adds latency

---

### Solution 4: Self-Host on DigitalOcean/Linode (Full Control)

Deploy to a VPS where you control everything.

**Steps:**
1. Create a $5/month droplet on [DigitalOcean](https://digitalocean.com)
2. SSH into server
3. Install Node.js and pnpm
4. Clone your repository
5. Run `pnpm install && pnpm build && pnpm start`
6. Use nginx as reverse proxy

**Pros:**
- Full control
- Rarely blocked
- Can run forever

**Cons:**
- Requires server management
- Not free
- More complex setup

---

## 🎯 Recommended Action

**For you: Deploy to Railway**

It's the easiest solution that will work right away:

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. "New Project" → "Deploy from GitHub"
4. Select your `bsl-webscraper` repo
5. Wait ~2 minutes for deployment
6. Click the generated URL
7. **It should work!**

Railway won't be blocked by signbsl.com and requires zero code changes.

---

## Why Vercel Doesn't Work

Vercel uses AWS Lambda/Edge Functions with well-known IP ranges:
- Many websites block these IPs to prevent scraping
- signbsl.com has anti-bot protection
- Returns 403 when it detects Vercel's IPs
- This is common and not fixable from code changes alone

Your code works perfectly - it's just the deployment platform that's blocked.
