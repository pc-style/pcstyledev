# Railway SSH Connection Guide

## Setting Up TCP Proxy

Railway gives you an HTTP URL by default (`https://web-production-f171.up.railway.app/`), but SSH needs TCP connection. You need to configure TCP proxy:

### Step 1: Enable Public Networking

1. Go to Railway Dashboard: https://railway.app
2. Select your `pcstyle-ssh-contact` service
3. Go to **Settings** tab
4. Click **Networking**
5. Enable **Public Networking**

### Step 2: Add TCP Proxy

1. In the Networking section, click **Generate Domain** or **Add Public Port**
2. Configure TCP proxy:
   - **Port**: `22`
   - **Protocol**: `TCP`
   - **Service Port**: `22` (or whatever port your SSH server uses)

### Step 3: Get TCP Endpoint

After configuring TCP proxy, Railway will give you:
- **TCP Host**: Something like `tcp-production-xxxx.up.railway.app`
- **TCP Port**: Usually `22` or a random port

## Connecting via SSH

Once TCP proxy is configured, connect using:

```bash
# If Railway assigned port 22:
ssh -p 22 tcp-production-xxxx.up.railway.app

# If Railway assigned a different port (e.g., 54321):
ssh -p 54321 tcp-production-xxxx.up.railway.app

# Or if you set up custom domain:
ssh ssh.pcstyle.dev
```

## Alternative: Use Railway's HTTP URL (if your server supports HTTP)

If Railway only shows HTTP URL and you can't configure TCP:

1. Railway might be detecting this as a web service
2. You might need to check Railway's build settings
3. Or use Railway's **Private Networking** feature

## Quick Check

To see your TCP endpoints:
1. Railway Dashboard → Your Service → Settings → Networking
2. Look for **Public Ports** or **TCP Proxy** section
3. Copy the TCP hostname and port

## Troubleshooting

**"Connection refused"**
- Verify TCP proxy is enabled
- Check that SSH_PORT=22 in environment variables
- Check Railway logs: `railway logs`

**"Port 22 already in use"**
- Railway might assign a different port
- Use the port Railway shows in Networking settings

**"No TCP proxy option"**
- Make sure you're on a paid Railway plan (TCP proxy might require it)
- Or check Railway documentation for current TCP proxy availability

---

**Current HTTP URL:** https://web-production-f171.up.railway.app/  
**This is for HTTP traffic, not SSH!**  
You need TCP proxy configured for SSH connections.





