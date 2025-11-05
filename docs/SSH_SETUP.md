# SSH Contact Form Setup Guide

Complete guide for setting up the SSH-accessible terminal contact form for pcstyle.dev.

## Overview

This setup consists of two components:

1. **Vercel API** (`/src/app/api/contact/route.ts`) - Handles form submissions and sends to Discord
2. **SSH Server** (`/ssh-server/`) - Terminal UI that users connect to via SSH

## Prerequisites

- Node.js 20+ installed
- Discord webhook URL
- Vercel account (for API hosting)
- VPS/cloud server for SSH server (Railway, Fly.io, DigitalOcean, etc.)

## Quick Start

### Step 1: Configure Discord Webhook

1. Go to your Discord server
2. Navigate to: **Server Settings → Integrations → Webhooks**
3. Click **New Webhook**
4. Name it "pcstyle Contact Form"
5. Choose the channel where submissions should appear
6. Copy the webhook URL

### Step 2: Deploy Vercel API

1. Create `.env.local` in the main project:
```bash
cp .env.local.example .env.local
```

2. Add your Discord webhook:
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/YOUR_TOKEN
```

3. Test locally:
```bash
npm run dev
```

4. Test the API:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"message":"Test from curl","name":"Adam","source":"ssh"}'
```

5. Deploy to Vercel:
```bash
# If not already deployed
vercel

# Or if already deployed
git add .
git commit -m "feat: add SSH contact form API"
git push
```

6. Add environment variable in Vercel:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DISCORD_WEBHOOK_URL` with your webhook URL
   - Redeploy: `vercel --prod`

### Step 3: Deploy SSH Server

Choose one of the following deployment options:

#### Option A: Railway.app (Easiest)

1. Install Railway CLI:
```bash
npm install -g railway
```

2. Initialize project:
```bash
cd ssh-server
railway login
railway init
```

3. Set environment variables:
```bash
railway variables set API_URL=https://pcstyle.dev/api/contact
railway variables set SSH_PORT=22
railway variables set SSH_HOST=0.0.0.0
```

4. Deploy:
```bash
railway up
```

5. Enable TCP proxy:
   - Go to Railway dashboard
   - Your project → Settings → Networking
   - Enable **Public Networking**
   - Add TCP proxy for port 22

6. Get your server IP/hostname from Railway dashboard

#### Option B: Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Create `fly.toml` in `/ssh-server/`:
```toml
app = "pcstyle-ssh-contact"
primary_region = "ams" # or your preferred region

[build]
  [build.env]
    NODE_VERSION = "20"

[env]
  SSH_PORT = "22"
  SSH_HOST = "0.0.0.0"

[[services]]
  internal_port = 22
  protocol = "tcp"

  [[services.ports]]
    port = 22
```

3. Deploy:
```bash
cd ssh-server
fly launch
fly secrets set API_URL=https://pcstyle.dev/api/contact
fly deploy
```

4. Get your server hostname:
```bash
fly info
```

#### Option C: DigitalOcean Droplet ($6/month)

1. Create a droplet:
   - Image: Ubuntu 22.04
   - Plan: Basic ($6/month)
   - Add your SSH key

2. SSH into server and setup:
```bash
ssh root@your_droplet_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Clone your repo
git clone https://github.com/yourusername/pcstyledev.git
cd pcstyledev/ssh-server

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your API_URL
```

3. Generate host key:
```bash
ssh-keygen -t rsa -b 4096 -f host.key -N ""
```

4. Create systemd service:
```bash
sudo nano /etc/systemd/system/ssh-contact.service
```

Paste:
```ini
[Unit]
Description=pcstyle.dev SSH Contact Form
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/pcstyledev/ssh-server
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

5. Enable and start:
```bash
sudo systemctl enable ssh-contact
sudo systemctl start ssh-contact
sudo systemctl status ssh-contact
```

6. Configure firewall:
```bash
sudo ufw allow 22/tcp
sudo ufw enable
```

### Step 4: Configure DNS

Point your domain to the SSH server:

**For main domain (pcstyle.dev):**
```
Note: This will conflict with web hosting!
Better to use a subdomain (Option B below)
```

**For subdomain (ssh.pcstyle.dev) - RECOMMENDED:**
```
Type: A
Name: ssh
Value: <your-ssh-server-ip>
TTL: 3600
```

Users connect with: `ssh ssh.pcstyle.dev`

**Using SRV record (advanced):**
```
Type: SRV
Service: _ssh._tcp
Priority: 0
Weight: 5
Port: 22
Target: ssh.pcstyle.dev
```

### Step 5: Test End-to-End

1. Connect via SSH:
```bash
# If using subdomain
ssh ssh.pcstyle.dev

# If using port 2222 (development)
ssh -p 2222 your-server-ip

# If using main domain
ssh pcstyle.dev
```

2. Fill out the form:
   - Type your message (required)
   - Fill optional fields: name, email, discord, phone, facebook
   - Tab/Arrow keys to navigate
   - Enter to submit

3. Verify:
   - Check Discord channel for the message
   - Should appear as a rich embed with cyan color (SSH source)

## Configuration Reference

### Environment Variables

**Vercel (Main Project)**
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

**SSH Server**
```env
API_URL=https://pcstyle.dev/api/contact
SSH_PORT=22
SSH_HOST=0.0.0.0
SSH_PASSWORD=  # Optional: leave empty for open access
```

### Port Configuration

| Port | Use Case | Requires Root |
|------|----------|---------------|
| 22   | Production (standard SSH) | Yes (Linux) |
| 2222 | Development/testing | No |

**To bind to port 22 without root:**
```bash
sudo setcap 'cap_net_bind_service=+ep' $(which node)
```

## Customization

### Change Colors

Edit `/ssh-server/ui.js`:
```javascript
style: {
  fg: 'cyan',        // Change to 'magenta', 'yellow', etc.
  bg: 'black',
  border: {
    fg: 'cyan',
  }
}
```

### Modify ASCII Art

Edit the `ASCII_ART` constant in `/ssh-server/ui.js`:
```javascript
const ASCII_ART = `
Your custom ASCII art here
`;
```

Generate ASCII art: https://patorjk.com/software/taag/

### Add/Remove Form Fields

1. Edit `/ssh-server/ui.js` - Add input fields
2. Edit `/ssh-server/server.js` - Update formData object
3. Edit `/src/app/api/contact/route.ts` - Update validation schema

## Monitoring

### View SSH Server Logs

**Systemd:**
```bash
sudo journalctl -u ssh-contact -f
```

**Railway:**
```bash
railway logs
```

**Fly.io:**
```bash
fly logs
```

### View API Logs

Vercel Dashboard → Your Project → Logs

### Monitor Discord Submissions

Check your Discord channel for incoming messages!

## Common Issues

### "Connection refused" when connecting via SSH
```bash
# Check if server is running
sudo netstat -tulpn | grep 22

# Check firewall
sudo ufw status

# Check logs
sudo journalctl -u ssh-contact -n 50
```

### API returns 500 error
```bash
# Check environment variables
railway variables  # or fly secrets list

# Test API directly
curl -X POST https://pcstyle.dev/api/contact \
  -H "Content-Type: application/json" \
  -d '{"message":"test","source":"ssh"}'
```

### Discord webhook not working
1. Verify webhook URL is correct
2. Check Vercel environment variables
3. Test webhook directly:
```bash
curl -X POST "YOUR_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content":"Test message"}'
```

### Rate limit errors (429)
Wait 60 seconds, or adjust rate limits in `/src/app/api/contact/route.ts`:
```typescript
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // requests per window
```

## 🔐 Security Best Practices

1. **Use strong host key**: Generate 4096-bit RSA key
2. **Enable password auth**: Set `SSH_PASSWORD` for production
3. **Rate limiting**: Already implemented (5 req/min)
4. **Monitor logs**: Watch for suspicious activity
5. **Keep updated**: Regular security updates
6. **HTTPS only**: Ensure API uses HTTPS
7. **Validate input**: Already implemented with Zod
8. **Environment secrets**: Never commit `.env` files

## Usage Examples

### Basic Connection
```bash
ssh ssh.pcstyle.dev
```

### With Specific User
```bash
ssh user@ssh.pcstyle.dev
```

### With Custom Port
```bash
ssh -p 2222 ssh.pcstyle.dev
```

### Bypass Host Key Check (testing only)
```bash
ssh -o StrictHostKeyChecking=no ssh.pcstyle.dev
```

##  Success!

Once everything is set up, users can contact you by simply running:

```bash
ssh pcstyle.dev
```

The message will appear in your Discord channel instantly!

## Support

If you encounter issues:
1. Check the logs
2. Review the troubleshooting section
3. Verify all environment variables are set
4. Test each component individually

---

Made with  by Adam Krupa
https://pcstyle.dev
