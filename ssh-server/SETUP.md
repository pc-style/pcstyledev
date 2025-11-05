# Setup Guide for Railway Deployment

## Quick Start

This repository is ready to deploy on Railway. Follow these steps:

### 1. Create Private GitHub Repository

```bash
# Make sure you're in the ssh-server directory
cd ssh-server

# Create the repo on GitHub (via web or CLI)
gh repo create pcstyle-ssh-contact --private --source=. --remote=origin --push
```

Or manually:
1. Go to https://github.com/new
2. Repository name: `pcstyle-ssh-contact` (or your preferred name)
3. Set to **Private**
4. Don't initialize with README (we already have one)
5. Click "Create repository"

### 2. Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/pcstyle-ssh-contact.git

# Or if you prefer SSH:
git remote add origin git@github.com:YOUR_USERNAME/pcstyle-ssh-contact.git

# Commit initial files
git add .
git commit -m "Initial commit: SSH contact server ready for Railway"

# Push to GitHub
git push -u origin main
```

### 3. Deploy on Railway

1. **Go to Railway Dashboard:**
   - Visit https://railway.app
   - Click "New Project"

2. **Deploy from GitHub:**
   - Select "Deploy from GitHub repo"
   - Choose your `pcstyle-ssh-contact` repository
   - Railway will automatically detect it's a Node.js project

3. **Environment Variables:**
   - Railway will automatically read `.env` file from the repo
   - Verify in Railway dashboard → Variables that these are set:
     - `API_URL=https://pcstyle.dev/api/contact`
     - `SSH_PORT=22`
     - `SSH_HOST=0.0.0.0`
     - `NODE_ENV=production`

4. **Configure TCP Proxy:**
   - Go to Railway dashboard → Your Service → Settings
   - Click "Networking"
   - Enable "Public Networking"
   - Add TCP proxy:
     - Port: `22`
     - Protocol: `TCP`

5. **Get Public IP:**
   - Railway dashboard → Service → Settings → Networking
   - Copy the public IP address

6. **Set up DNS:**
   - Add A record in your DNS provider:
     - Type: `A`
     - Name: `ssh`
     - Value: `<railway-public-ip>`
     - TTL: `3600`

### 4. Test Connection

```bash
ssh ssh.pcstyle.dev
```

You should see the contact form!

## Updating Environment Variables

If you need to change environment variables:

1. **Update `.env` file locally:**
```bash
# Edit .env file
nano .env
```

2. **Commit and push:**
```bash
git add .env
git commit -m "Update environment variables"
git push
```

3. **Railway will auto-deploy** from the updated repo

Or manually set in Railway dashboard:
- Service → Variables → Add/Edit variables

## Files Included

- `.env` - Production environment variables (included in private repo)
- `.env.example` - Template for environment variables
- `server.js` - Main SSH server
- `package.json` - Dependencies and scripts
- `Procfile` - Railway process definition
- `app.json` - Railway app configuration
- `README.md` - Full documentation

## Security Notes

- `.env` is included because this is a **private repository**
- SSH host keys (`host.key`) are NOT committed (auto-generated on deploy)
- Never commit sensitive keys/tokens to public repos
- Railway secrets are more secure than `.env` for production - consider using Railway Variables instead

## Troubleshooting

**Railway can't find the repo:**
- Make sure Railway is connected to your GitHub account
- Dashboard → Settings → Connections → GitHub

**Environment variables not loading:**
- Check Railway dashboard → Variables
- Railway reads `.env` automatically, but you can also set them manually

**SSH connection fails:**
- Verify TCP proxy is enabled on port 22
- Check Railway logs: `railway logs`
- Verify DNS is pointing to correct IP

---

Ready to deploy!





