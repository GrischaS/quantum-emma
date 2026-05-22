# GitHub Secrets Setup Guide
## Required for CI/CD Auto-Deploy

### Add secrets at:
https://github.com/GrischaS/quantum-emma/settings/secrets/actions

## Vercel Secrets
VERCEL_TOKEN      -> https://vercel.com/account/tokens
VERCEL_ORG_ID     -> Vercel Team Settings > General
VERCEL_PROJECT_ID -> Vercel Project Settings > General

## Netlify Secrets
NETLIFY_AUTH_TOKEN -> https://app.netlify.com/user/applications/personal-access-tokens
NETLIFY_SITE_ID   -> Netlify Site Settings > General

## Auto-Deploy Flow
push to main -> GitHub Actions -> Build -> Deploy Vercel + Netlify

## How to connect Vercel
1. Go to https://vercel.com/new
2. Import GitHub repo: GrischaS/quantum-emma
3. Framework: Vite | Build: npm run build | Output: dist
4. Deploy -> copy Project ID + Org ID

## How to connect Netlify
1. Go to https://app.netlify.com/start
2. Connect GitHub -> GrischaS/quantum-emma
3. Build: npm run build | Publish: dist
4. Deploy -> copy Site ID

(c) 2026 Grigori Saks - Enterprise v4.1
