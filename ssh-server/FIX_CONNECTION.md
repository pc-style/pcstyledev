# Fix SSH Connection Issue

## Problem
- DNS works: `ssh.pcstyle.dev` → `66.33.22.95` (wxvnwyub.up.railway.app)
- Ping works: Can reach the server
- SSH port 22: **Connection timeout**

## Root Cause
Railway doesn't have TCP proxy configured on port 22, or Railway assigned a different port.

## Solution

### Step 1: Check Railway TCP Proxy Configuration

1. Go to Railway Dashboard: https://railway.app
2. Select your `pcstyle-ssh-contact` service
3. Go to **Settings** → **Networking**
4. Check **Public Networking** section

### Step 2: Configure TCP Proxy

**Option A: If TCP Proxy is missing:**
1. Click **Generate Domain** or **Add Public Port**
2. Configure:
   - **Protocol**: `TCP`
   - **Port**: `22` (or check what Railway assigns)
   - **Service Port**: `22`

**Option B: If Railway assigned different port:**
Railway might show something like:
- TCP Port: `54321` → Service Port: `22`

In this case, connect using Railway's port:
```bash
ssh -p 54321 ssh.pcstyle.dev
```

### Step 3: Alternative - Use Railway's Direct TCP Endpoint

Railway might provide a direct TCP endpoint like:
- `tcp-production-xxxx.up.railway.app:54321`

Connect using:
```bash
ssh -p 54321 tcp-production-xxxx.up.railway.app
```

### Step 4: Check Railway Logs

```bash
railway logs
```

Look for:
- `✓ Listening on 0.0.0.0:22` - Server is running
- Any errors about port binding
- Connection attempts

### Step 5: Verify Environment Variables

Make sure in Railway dashboard → Variables:
- `SSH_PORT=22` (or whatever port Railway assigned)
- `SSH_HOST=0.0.0.0`
- `API_URL=https://pcstyle.dev/api/contact`

### Step 6: Test Connection

Once TCP proxy is configured:
```bash
# Try Railway's assigned port (might not be 22)
ssh -p <railway-port> ssh.pcstyle.dev

# Or Railway's direct TCP endpoint
ssh -p <railway-port> tcp-production-xxxx.up.railway.app
```

## Quick Fix: Use Different Port

If Railway blocks port 22, use port 2222:

1. **Update Railway Variables:**
   - Set `SSH_PORT=2222`

2. **Configure TCP Proxy:**
   - Railway → Networking → Add TCP proxy
   - Port: `2222` → Service Port: `2222`

3. **Connect:**
   ```bash
   ssh -p 2222 ssh.pcstyle.dev
   ```

## Debug Commands

```bash
# Check if port is open (with timeout)
nc -zv -G 5 ssh.pcstyle.dev 22

# Try SSH with verbose output
ssh -v -o ConnectTimeout=5 ssh.pcstyle.dev -p 22

# Check Railway logs
railway logs --tail 50
```

---

**Most likely issue:** Railway hasn't configured TCP proxy yet, or it's using a different port than 22.

Check Railway Dashboard → Settings → Networking → Public Ports to see what's actually configured!

