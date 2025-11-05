# SSH Contact Form - Quick Start Guide

Ultra-condensed guide to get your SSH contact form live ASAP.

## ⚡ 5-Minute Local Test

```bash
# 1. Get Discord webhook URL (Discord → Server Settings → Integrations → Webhooks)

# 2. Set up API
echo "DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_ID/YOUR_TOKEN" > .env.local
npm run dev

# 3. In another terminal, set up SSH server
cd ssh-server
npm install
./test-local.sh

# 4. In another terminal, connect
ssh -p 2222 localhost

# 5. Fill form, check Discord!
```

## 🚀 Deploy to Production (Railway - Easiest)

### Step 1: Deploy API to Vercel
```bash
# Add Discord webhook in Vercel dashboard
# Settings → Environment Variables → Add:
# DISCORD_WEBHOOK_URL = your_webhook_url

# Commit and push (auto-deploys)
git add .
git commit -m "feat: add SSH contact form"
git push
```

### Step 2: Deploy SSH Server to Railway

```bash
# Install Railway CLI
npm install -g railway

# Deploy
cd ssh-server
railway login
railway init
railway variables set API_URL=https://pcstyle.dev/api/contact
railway variables set SSH_PORT=22
railway up

# Enable TCP proxy in Railway dashboard:
# Project → Settings → Networking → Public Networking → Enable
# Add TCP proxy for port 22

# Get your server IP from Railway dashboard
```

### Step 3: Configure DNS

Add A record in your DNS provider:
```
Type: A
Name: ssh
Value: <railway-server-ip>
TTL: 3600
```

### Step 4: Test!

```bash
ssh ssh.pcstyle.dev
```

## 🎯 That's It!

Your terminal contact form is live. Share it everywhere:
- GitHub README: `Contact: ssh ssh.pcstyle.dev`
- Website: Add a terminal icon with the SSH command
- Social media: Post a demo video

## 📚 Full Documentation

- **Complete setup guide:** `SSH_SETUP.md`
- **Project overview:** `PROJECT_SUMMARY.md`
- **SSH server docs:** `ssh-server/README.md`

## 🔧 Environment Variables

### Vercel (.env.local)
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

### Railway (ssh-server)
```env
API_URL=https://pcstyle.dev/api/contact
SSH_PORT=22
SSH_HOST=0.0.0.0
```

## 🐛 Quick Troubleshooting

**Can't connect?**
```bash
# Check if server is running
railway logs

# Check if port 22 is exposed
# Railway dashboard → Networking → TCP proxy enabled?
```

**API not working?**
```bash
# Test API directly
curl -X POST https://pcstyle.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{"message":"test","source":"ssh"}'

# Check Vercel logs
# Dashboard → Logs
```

**Discord not receiving?**
```bash
# Verify webhook URL is correct in Vercel
# Test webhook directly:
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test"}'
```

## 💰 Cost

- **Vercel:** Free
- **Railway:** ~$5/month
- **Total:** ~$5/month

## 🎉 Success!

When someone runs `ssh ssh.pcstyle.dev`, they'll see your beautiful terminal UI and can send you a message instantly!

---

Need more details? Check `SSH_SETUP.md` for complete instructions.
