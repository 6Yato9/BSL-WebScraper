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

## Deployment on Vercel

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

If videos don't load after deployment:

1. **Check Function Logs:**
   - Go to your Vercel project dashboard
   - Navigate to "Deployments" → Click on latest deployment → "Functions"
   - Look for errors in `/api/scrape` function

2. **Common Issues:**
   - **Timeout**: Serverless functions have time limits (60s on Pro, 10s on Hobby)
   - **Rate Limiting**: signbsl.com may block too many requests
   - **CORS**: Headers are configured in `vercel.json`

3. **Solutions:**
   - Upgrade to Vercel Pro for longer function timeouts
   - Add delays between requests if rate limited
   - Check browser console for client-side errors

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
