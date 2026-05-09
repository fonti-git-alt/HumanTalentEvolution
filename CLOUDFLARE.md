# Cloudflare Pages Configuration

## Project Setup

This project uses Astro with the Cloudflare adapter for deployment to Cloudflare Pages.

### Configuration Files

- **wrangler.jsonc** - Wrangler configuration for deployment
- **astro.config.mjs** - Astro configuration with `@astrojs/cloudflare` adapter

### Build Settings

```json
{
  "name": "humantalentevolution",
  "compatibility_date": "2026-04-03",
  "compatibility_flags": ["global_fetch_strictly_public", "nodejs_compat"],
  "main": "dist/_worker.js/index.js",
  "assets": {
    "binding": "ASSETS",
    "directory": "dist"
  }
}
```

## Contact Form API

The contact form is powered by a Cloudflare Worker at `functions/api/contact.ts`.

### Features
- Form validation (name, email, message required)
- Email validation
- Integration with Resend for email delivery

### Configure Resend API Key

1. Get your API key from [resend.com](https://resend.com)
2. In Cloudflare Dashboard, go to your Pages project > Settings > Variables
3. Add `RESEND_API_KEY` with your key

Or set it locally in `wrangler.jsonc`:
```json
"vars": {
  "RESEND_API_KEY": "re_xxxxxxxxxxxxxx"
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Build the Project
```bash
npm run build
```

### 3. Deploy to Cloudflare Pages

**Option A: Using Wrangler**
```bash
npx wrangler pages deploy dist
```

**Option B: Using Cloudflare Dashboard**
1. Link your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### 4. Configure Environment Variables

In the Cloudflare Dashboard for your Pages project:

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | API key for Resend email service | Yes (for contact form) |

## Alternative: Formspree (No Backend Required)

If you don't want to use Resend, you can use Formspree instead:

1. Sign up at [formspree.io](https://formspree.io)
2. Create a form and get your endpoint
3. Update the form action in `src/components/sections/ContactForm.astro`:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

## Build Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run deploy` | Build and deploy to Cloudflare |
| `npx wrangler pages deploy dist` | Deploy built files |
