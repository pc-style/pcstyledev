# pcstyle.dev SSH Contact Form Server

An SSH-accessible terminal contact form that allows users to send messages directly from their terminal.

## 🚀 Features

- **Terminal-based UI** - Beautiful ASCII art interface using blessed
- **Real-time validation** - Character counter and field validation
- **Discord integration** - Submissions sent directly to Discord via webhook
- **Rate limiting** - Prevents spam (5 requests per minute per IP)
- **Flexible contact fields** - Message (required) + optional name, email, Discord, phone, Facebook
- **Source tracking** - Differentiates between SSH and web submissions

## 📦 Installation

```bash
cd ssh-server
npm install
```

## ⚙️ Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` and configure:
```env
# Your Vercel API endpoint (production)
API_URL=https://pcstyle.dev/api/contact

# For local development
# API_URL=http://localhost:3000/api/contact

# SSH server configuration
SSH_PORT=2222        # Use 22 for production (requires root/sudo)
SSH_HOST=0.0.0.0

# Optional: Require password authentication
# SSH_PASSWORD=your_secret_password
```

3. Generate SSH host key (for production):
```bash
ssh-keygen -t rsa -b 4096 -f host.key -N ""
```

**Note:** If you don't generate a key, the server will create one automatically (development only).

## 🏃 Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start and display:
```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 pcstyle.dev SSH Contact Form Server                     ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝

✓ Listening on 0.0.0.0:2222
✓ API endpoint: https://pcstyle.dev/api/contact
✓ Authentication: Open access

Connect with:
  ssh -p 2222 localhost
```

## 🔌 Testing Locally

1. Start your Next.js development server (in the main project):
```bash
npm run dev
```

2. In another terminal, start the SSH server:
```bash
cd ssh-server
npm run dev
```

3. Connect via SSH:
```bash
ssh -p 2222 localhost
```

4. Fill out the form and submit!

## 🌐 Production Deployment

### Option 1: Railway.app (Recommended)

1. Install Railway CLI:
```bash
npm install -g railway
```

2. Login and initialize:
```bash
railway login
railway init
```

3. Add environment variables:
```bash
railway variables set API_URL=https://pcstyle.dev/api/contact
railway variables set SSH_PORT=22
```

4. Deploy:
```bash
railway up
```

5. Expose SSH port (port 22):
   - Go to Railway dashboard
   - Settings > Networking > Public Networking
   - Enable TCP proxy for port 22

### Option 2: Fly.io

1. Install Fly CLI:
```bash
curl -L https://fly.io/install.sh | sh
```

2. Create `fly.toml`:
```toml
app = "pcstyle-ssh-contact"

[build]
  builder = "heroku/buildpacks:20"

[[services]]
  internal_port = 22
  protocol = "tcp"

  [[services.ports]]
    port = 22
```

3. Deploy:
```bash
fly launch
fly secrets set API_URL=https://pcstyle.dev/api/contact
fly deploy
```

### Option 3: DigitalOcean Droplet / VPS

1. Create a small droplet ($6/month)
2. SSH into the server
3. Install Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

4. Clone and setup:
```bash
git clone <your-repo>
cd ssh-server
npm install
```

5. Create systemd service (`/etc/systemd/system/ssh-contact.service`):
```ini
[Unit]
Description=pcstyle.dev SSH Contact Form
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/ssh-server
ExecStart=/usr/bin/node server.js
Restart=always
Environment=NODE_ENV=production
Environment=SSH_PORT=22

[Install]
WantedBy=multi-user.target
```

6. Enable and start:
```bash
sudo systemctl enable ssh-contact
sudo systemctl start ssh-contact
```

## 🔒 Security Considerations

### Production Checklist:

- [ ] Generate proper RSA host key (4096-bit)
- [ ] Set `SSH_PORT=22` (requires root privileges)
- [ ] Consider enabling password authentication via `SSH_PASSWORD`
- [ ] Set up firewall rules (allow port 22)
- [ ] Configure Discord webhook URL as environment variable
- [ ] Enable HTTPS for API endpoint
- [ ] Monitor logs for suspicious activity
- [ ] Set up log rotation
- [ ] Consider adding DDoS protection

### Rate Limiting

The API includes built-in rate limiting:
- **5 requests per minute** per IP address
- Returns 429 status code when exceeded
- Rate limit window: 60 seconds

## 📝 DNS Configuration

### Point pcstyle.dev to SSH server:

**Option A: Direct A record (single server)**
```
Type: A
Name: @
Value: <your-server-ip>
TTL: 3600
```

**Option B: Subdomain (recommended)**
```
Type: A
Name: ssh
Value: <your-server-ip>
TTL: 3600
```

Users would connect: `ssh ssh.pcstyle.dev`

**Option C: SRV record (advanced)**
```
Type: SRV
Name: _ssh._tcp
Priority: 0
Weight: 5
Port: 22
Target: ssh.pcstyle.dev
```

**Note:** Your web server (Vercel) and SSH server can coexist:
- Web traffic (HTTP/HTTPS) → Vercel (ports 80/443)
- SSH traffic → Your SSH server (port 22)

## 🐛 Troubleshooting

### "Connection refused"
- Check if server is running: `sudo netstat -tulpn | grep 2222`
- Verify firewall allows the port: `sudo ufw status`
- Check if port is already in use

### "Permission denied"
- For port 22, you need root: `sudo node server.js`
- Or use `setcap`: `sudo setcap 'cap_net_bind_service=+ep' $(which node)`

### "Host key verification failed"
- Remove old key: `ssh-keygen -R [localhost]:2222`
- Or use: `ssh -o StrictHostKeyChecking=no -p 2222 localhost`

### "API submission failed"
- Check API_URL is correct
- Verify Discord webhook URL is set in Vercel environment variables
- Check API logs in Vercel dashboard
- Test API endpoint: `curl -X POST https://pcstyle.dev/api/contact -H "Content-Type: application/json" -d '{"message":"test","source":"ssh"}'`

## 📊 Monitoring

View server logs:
```bash
# If running with systemd
sudo journalctl -u ssh-contact -f

# If running directly
# Output is already in the terminal
```

## 🔄 Updating

```bash
cd ssh-server
git pull
npm install
# Restart the service
sudo systemctl restart ssh-contact
```

## 📄 License

MIT

## 🤝 Contributing

This is a personal project, but feel free to fork and adapt for your own use!

---

Made with ❤️ by Adam Krupa
https://pcstyle.dev
