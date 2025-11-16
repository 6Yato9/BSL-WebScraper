# BSL Dictionary - British Sign Language Video Search

A Next.js web application that scrapes and displays British Sign Language videos from signbsl.com. Enter a phrase and watch videos for each word played sequentially.

## Features

- 🔍 Search for BSL videos by phrase
- 🎥 Combined video player that plays all words sequentially
- 🎨 Modern, responsive UI with dark mode support
- ⚡ Built with Next.js 16, React 19, and TailwindCSS 4

## Getting Started

### Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## ⚠️ Important: Vercel Deployment Issue

**Vercel is blocked by signbsl.com** - You'll get `403 Forbidden` errors because signbsl.com blocks Vercel's IP addresses.

**✅ Recommended:** Deploy to **Railway.app** instead (see `DEPLOYMENT_SOLUTIONS.md` for detailed instructions)

---

## Deployment on Vercel (Not Recommended - Will Be Blocked)

### Prerequisites
- A Vercel account
- This repository pushed to GitHub/GitLab/Bitbucket

### Deploy Steps

1. **Push to Git:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Environment Configuration:**
   - The app should work out of the box
   - Check the "Functions" logs in Vercel dashboard if you encounter issues

### Troubleshooting Vercel Deployment

If you get "No videos found" error after deployment:

#### **Step 1: Check Function Logs**

1. Go to your Vercel project dashboard
2. Navigate to **Deployments** → Click on your latest deployment
3. Click on **Functions** tab
4. Click on `/api/scrape` function
5. Look for `[DEBUG]`, `[ERROR]`, or `[WARN]` messages

**What to look for:**
- `[DEBUG] Response status`: Should be `200 OK`
- `[DEBUG] HTML length`: Should be > 0
- `[DEBUG] Found X video source elements`: Should be > 0
- `[ERROR]` messages indicate what went wrong

#### **Step 2: Test the Connection**

Visit this URL in your browser (replace `your-app` with your Vercel domain):
```
https://your-app.vercel.app/api/test
```

This will test if Vercel can connect to signbsl.com and return diagnostic info.

**Expected response:**
```json
{
  "success": true,
  "status": 200,
  "htmlLength": 50000+,
  "hasVideoTag": true,
  "hasSourceTag": true
}
```

#### **Step 3: Common Issues & Solutions**

**Issue 1: HTML length is 0 or very small**
- **Cause**: signbsl.com is blocking Vercel's servers
- **Solution**: They may have anti-bot protection. Try:
  - Deploying to a different region in Vercel
  - Using a proxy service
  - Contact signbsl.com for API access

**Issue 2: Timeout errors**
- **Cause**: Scraping takes too long
- **Solution**: 
  - Upgrade to Vercel Pro (60s timeout vs 10s on Hobby)
  - Reduce number of words searched at once

**Issue 3: Status 403 or 429**
- **Cause**: Rate limiting or blocked IP
- **Solution**: signbsl.com is actively blocking the requests

**Issue 4: Works locally but not on Vercel**
- **Cause**: Different IP addresses, Vercel's serverless environment
- **Solution**: This is the most common issue with web scraping deployments

#### **Step 4: Alternative Solutions**

If scraping doesn't work on Vercel:

1. **Self-host**: Deploy to a VPS (DigitalOcean, Linode, etc.) where you have more control
2. **Use a proxy**: Add a proxy service to route requests
3. **Contact BSL**: Ask if they have an official API
4. **Build a cache**: Pre-scrape common words and cache the results

### Vercel Configuration

The `vercel.json` file includes:
- Function timeout settings (60s max)
- CORS headers for API routes
- Required for serverless function configuration

## How It Works

1. User enters a phrase (e.g., "black hat")
2. API route splits phrase into words
3. Scrapes signbsl.com for each word
4. Returns video URLs and metadata
5. Combined player displays videos sequentially

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS 4
- **Scraping**: Cheerio
- **Icons**: Lucide React
- **Deployment**: Vercel
