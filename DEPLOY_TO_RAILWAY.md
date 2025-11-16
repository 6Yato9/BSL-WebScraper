# 🚂 Deploy to Railway (5 Minutes)

Railway.app is the recommended platform for this app because it won't be blocked by signbsl.com.

## Quick Start

### 1. Create Railway Account
- Go to [railway.app](https://railway.app)
- Click "Login" → Sign in with GitHub
- Authorize Railway to access your repositories

### 2. Deploy Your Project
1. Click "**New Project**"
2. Select "**Deploy from GitHub repo**"
3. Choose your `bsl-webscraper` repository
4. Railway will automatically:
   - Detect Next.js
   - Install dependencies
   - Build the project
   - Deploy it

### 3. Wait for Deployment
- Progress bar shows build status
- Takes ~2-3 minutes
- You'll see "Success" when done

### 4. Get Your URL
- Click on your deployment
- Click "**Settings**" tab
- Scroll to "**Domains**"
- Click "**Generate Domain**"
- Railway gives you a URL like: `bsl-webscraper-production-xxxx.up.railway.app`

### 5. Test It!
- Visit your Railway URL
- Search for "black hat"
- Videos should load! ✅

## That's It!

Your app is now deployed and working. Every time you push to GitHub, Railway will automatically redeploy.

## Free Tier Limits

Railway's free tier includes:
- **$5 free credits per month**
- Enough for hobby projects
- Auto-sleeps after inactivity (wakes up in ~2s)

If you exceed free tier, you'll need to add a payment method.

## Troubleshooting

### Build Failed
- Check Railway build logs
- Make sure all dependencies are in `package.json`

### Still Getting "No videos found"
- Check Railway logs (click on deployment → View Logs)
- Look for the same `[DEBUG]` messages
- If you still see `403`, Railway might also be blocked (rare)

### App Won't Wake Up
- Free tier apps sleep after 30 min of inactivity
- First request takes ~2s to wake up
- Subsequent requests are instant

## Need Help?

Railway has excellent documentation: [docs.railway.app](https://docs.railway.app)
