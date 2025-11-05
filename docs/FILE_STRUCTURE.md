# SSH Contact Form - File Structure

## 📁 Complete Project Structure

```
pcstyledev/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── contact/
│   │   │       └── route.ts              ⭐ NEW - API endpoint for form submissions
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   │
│   └── components/
│       ├── ContactModal.tsx               (existing, can be enhanced)
│       └── ...
│
├── ssh-server/                            ⭐ NEW - Complete SSH server project
│   ├── server.js                          Main SSH server logic
│   ├── ui.js                              Terminal UI with blessed
│   ├── package.json                       Dependencies
│   ├── .env.example                       Configuration template
│   ├── .gitignore                         Git exclusions
│   ├── README.md                          SSH server documentation
│   ├── Dockerfile                         Container configuration
│   ├── docker-compose.yml                 Local Docker setup
│   └── test-local.sh                      Quick testing script
│
├── Documentation (NEW)
│   ├── SSH_SETUP.md                       ⭐ Complete deployment guide
│   ├── PROJECT_SUMMARY.md                 ⭐ Project overview
│   ├── QUICK_START.md                     ⭐ Fast setup guide
│   └── FILE_STRUCTURE.md                  ⭐ This file
│
├── Configuration
│   ├── .env.local.example                 ⭐ NEW - API environment variables
│   ├── .env.local                         (create this, gitignored)
│   ├── package.json                       (updated with zod)
│   ├── next.config.ts
│   ├── vercel.json
│   └── ...
│
└── Existing Files
    ├── data/
    ├── public/
    └── ...
```

## New Files Details

### API Backend

#### `/src/app/api/contact/route.ts` (391 lines)
**Purpose:** Handle contact form submissions and send to Discord

**Key Features:**
- POST endpoint for submissions
- Input validation with Zod
- Rate limiting (5 req/min per IP)
- Discord webhook integration
- Rich embed formatting
- Source tracking (web vs SSH)
- Comprehensive error handling
- GET health check endpoint

**Dependencies:** `next`, `zod`

**Environment Variables:** `DISCORD_WEBHOOK_URL`

---

### SSH Server Project

#### `/ssh-server/server.js` (143 lines)
**Purpose:** Main SSH server handling connections and authentication

**Key Features:**
- SSH2 server implementation
- Optional password authentication
- Host key generation/loading
- Connection logging
- Session management
- Graceful shutdown
- API submission handler

**Dependencies:** `ssh2`, `axios`, `dotenv`, `crypto`, `fs`

**Environment Variables:** `API_URL`, `SSH_PORT`, `SSH_HOST`, `SSH_PASSWORD`

---

#### `/ssh-server/ui.js` (219 lines)
**Purpose:** Terminal UI using blessed library

**Key Features:**
- ASCII art header (neo-brutalist design)
- Interactive form with 6 fields
- Real-time character counter
- Tab/Arrow key navigation
- Input validation
- Color-coded feedback
- Submit button
- Success/error messages

**Dependencies:** `blessed`

---

#### `/ssh-server/package.json`
**Purpose:** Node.js project configuration

**Scripts:**
- `npm start` - Start server
- `npm run dev` - Auto-reload mode

**Dependencies:**
- `ssh2` (^1.15.0)
- `blessed` (^0.1.81)
- `axios` (^1.7.7)
- `dotenv` (^16.4.7)

---

#### `/ssh-server/.env.example`
**Purpose:** Configuration template

**Variables:**
```env
API_URL=https://pcstyle.dev/api/contact
SSH_PORT=22
SSH_HOST=0.0.0.0
SSH_PASSWORD=  # Optional
```

---

#### `/ssh-server/README.md` (450+ lines)
**Purpose:** Comprehensive SSH server documentation

**Sections:**
- Installation
- Configuration
- Running locally
- Production deployment (Railway, Fly.io, DigitalOcean)
- Security considerations
- DNS configuration
- Troubleshooting
- Monitoring

---

#### `/ssh-server/Dockerfile`
**Purpose:** Container configuration for Docker deployment

**Features:**
- Multi-stage build
- Alpine base (minimal size)
- Host key generation
- Health check
- Port 22 exposure

---

#### `/ssh-server/docker-compose.yml`
**Purpose:** Local Docker development setup

**Features:**
- Port mapping (2222:22)
- Environment variables
- Volume for host key
- Health checks
- Auto-restart

---

#### `/ssh-server/test-local.sh`
**Purpose:** Quick local testing script

**Actions:**
- Checks for .env file
- Installs dependencies
- Generates host key
- Starts server on port 2222
- Shows connection instructions

---

#### `/ssh-server/.gitignore`
**Purpose:** Exclude sensitive and generated files

**Excludes:**
- `node_modules/`
- `.env` files
- `host.key` files
- Logs
- OS files

---

### Documentation Files

#### `/SSH_SETUP.md` (600+ lines)
**Purpose:** Complete step-by-step deployment guide

**Contents:**
- Overview and architecture
- Prerequisites
- Vercel API setup
- SSH server deployment (3 options)
- DNS configuration
- Testing procedures
- Customization guide
- Troubleshooting
- Security checklist

---

#### `/PROJECT_SUMMARY.md` (500+ lines)
**Purpose:** High-level project overview

**Contents:**
- What was built
- Architecture diagram
- Component breakdown
- Technology stack
- Deployment options
- Setup checklist
- Security features
- Cost estimates
- Future enhancements
- Testing instructions

---

#### `/QUICK_START.md` (150 lines)
**Purpose:** Ultra-fast setup guide

**Contents:**
- 5-minute local test
- Railway deployment steps
- DNS configuration
- Quick troubleshooting
- Cost summary

---

#### `/FILE_STRUCTURE.md` (This file)
**Purpose:** Visual guide to all files

**Contents:**
- Complete directory tree
- File descriptions
- Dependencies
- Line counts
- Key features

---

#### `/.env.local.example` (New)
**Purpose:** Main project environment variables template

**Variables:**
```env
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

---

## Statistics

### Lines of Code

| Component | Lines | Language |
|-----------|-------|----------|
| API Route | 391 | TypeScript |
| SSH Server | 143 | JavaScript |
| Terminal UI | 219 | JavaScript |
| Documentation | 1,500+ | Markdown |
| **Total** | **~2,250** | Mixed |

### Files Created

- **Code files:** 8
- **Config files:** 6
- **Documentation:** 5
- **Total:** 19 new files

### Dependencies Added

**Main Project:**
- `zod` (validation)

**SSH Server:**
- `ssh2` (SSH protocol)
- `blessed` (terminal UI)
- `axios` (HTTP client)
- `dotenv` (config)

## Entry Points

### For Users
```bash
ssh ssh.pcstyle.dev
```

### For API
```
POST https://pcstyle.dev/api/contact
```

### For Development
```bash
# Main project
npm run dev

# SSH server
cd ssh-server && npm start
```

## Dependencies Flow

```
User Terminal
     ↓
ssh-server/server.js
     ↓
ssh-server/ui.js (blessed)
     ↓
User fills form
     ↓
ssh-server/server.js (axios)
     ↓
src/app/api/contact/route.ts
     ↓
Discord Webhook
     ↓
Your Discord Channel
```

## Deployment Structure

### Vercel (Main Project)
```
pcstyledev/
├── src/
│   └── app/
│       └── api/
│           └── contact/
│               └── route.ts  → Deployed as serverless function
```

### Railway/Fly.io (SSH Server)
```
ssh-server/
├── server.js         → Main process
├── ui.js            → Required by server.js
├── package.json     → Dependencies definition
├── host.key         → Generated at runtime
└── .env             → Environment config
```

## 🔍 What Goes Where

### Git Repository
- All source code
- Configuration examples
- Documentation
- `.env` files (gitignored)
- `host.key` files (gitignored)
- `node_modules/` (gitignored)

### Vercel Deployment
- Environment variable: `DISCORD_WEBHOOK_URL`
- Source: `/src/app/api/contact/route.ts`

### SSH Server Deployment
- Environment variables: `API_URL`, `SSH_PORT`, `SSH_HOST`
- Source: `/ssh-server/*` (entire directory)
- Runtime: Port 22 (or 2222 for dev)

---

## Quick Reference

**Want to modify the terminal UI?**
→ Edit `ssh-server/ui.js`

**Need to change API logic?**
→ Edit `src/app/api/contact/route.ts`

**Deployment instructions?**
→ Read `SSH_SETUP.md`

**Quick testing?**
→ Run `ssh-server/test-local.sh`

**Architecture overview?**
→ Read `PROJECT_SUMMARY.md`

**Fast deployment?**
→ Follow `QUICK_START.md`

---

Made with  for the terminal enthusiasts
