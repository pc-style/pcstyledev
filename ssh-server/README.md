# pcstyle.dev SSH Contact Server

SSH-accessible terminal contact form that allows users to send messages directly from their terminal.

## Features

- **Terminal-based UI** - Beautiful ASCII art interface using blessed
- **Real-time validation** - Character counter and field validation
- **Discord integration** - Submissions sent directly to Discord via webhook
- **Rate limiting** - Prevents spam (5 requests per minute per IP)
- **Flexible contact fields** - Message (required) + optional name, email, Discord, phone, Facebook
- **Source tracking** - Differentiates between SSH and web submissions

## Installation

```bash
npm install
```

## Configuration

Environment variables are pre-configured in `.env` for Railway deployment:

```env
API_URL=https://pcstyle.dev/api/contact
SSH_PORT=22
SSH_HOST=0.0.0.0
NODE_ENV=production
```

For local development, copy `.env.example` to `.env.local` and adjust values.

## Running Locally

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

Connect via SSH:
```bash
ssh -p 2222 localhost
```

## Railway Deployment

This repository is configured for Railway deployment:

1. **Connect Railway to this GitHub repo:**
   - Go to Railway dashboard
   - New Project → Deploy from GitHub repo
   - Select this repository

2. **Environment variables are already configured** in `.env` file

3. **Configure TCP proxy:**
   - Railway dashboard → Service → Settings → Networking
   - Enable Public Networking
   - Add TCP proxy for port 22

4. **Set up DNS:**
   - Add A record: `ssh.pcstyle.dev` → Railway IP
   - Or use Railway domain: `ssh.pcstyle.up.railway.app`

## Security

- Generate SSH host key: `ssh-keygen -t rsa -b 4096 -f host.key -N ""`
- Host key is auto-generated if missing (development only)
- Rate limiting: 5 requests per minute per IP
- Optional password authentication via `SSH_PASSWORD` env var

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `API_URL` | Vercel API endpoint | `http://localhost:3000/api/contact` |
| `SSH_PORT` | SSH server port | `2222` |
| `SSH_HOST` | Host binding | `0.0.0.0` |
| `SSH_PASSWORD` | Optional password auth | `null` (open access) |
| `NODE_ENV` | Environment | `production` |

## Troubleshooting

### "Connection refused"
- Check if server is running
- Verify firewall allows the port
- Check Railway logs: `railway logs`

### "Host key verification failed"
- Remove old key: `ssh-keygen -R ssh.pcstyle.dev`
- Or use: `ssh -o StrictHostKeyChecking=no ssh.pcstyle.dev`

### "API submission failed"
- Verify `API_URL` is correct
- Check Discord webhook URL in Vercel environment variables
- Test API: `curl -X POST https://pcstyle.dev/api/contact -H "Content-Type: application/json" -d '{"message":"test","source":"ssh"}'`

## License

MIT © 2025 Adam Krupa

---

Made by pcstyle  
https://pcstyle.dev
