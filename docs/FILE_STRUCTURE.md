# Contact API - File Structure

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
│       ├── ContactModal.tsx               (existing)
│       ├── SSHContactModal.tsx            ⭐ SSH contact modal component
│       └── ...
│
├── Documentation
│   ├── API_CONTACT_ENDPOINT.md            ⭐ API endpoint documentation
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

#### `/src/app/api/contact/route.ts` (~150 lines)
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


### Documentation Files

#### `/docs/API_CONTACT_ENDPOINT.md`
**Purpose:** Complete API endpoint documentation

**Contents:**
- Endpoint overview
- Request/response formats
- Rate limiting
- Validation rules
- Discord integration
- Error handling
- Usage examples
- Testing instructions

---

#### `/docs/FILE_STRUCTURE.md` (This file)
**Purpose:** Visual guide to all files

**Contents:**
- Complete directory tree
- File descriptions
- Dependencies
- Key features

---


## Statistics

### Lines of Code

| Component | Lines | Language |
|-----------|-------|----------|
| API Route | ~150 | TypeScript |
| SSH Modal Component | ~145 | TypeScript |
| Documentation | 500+ | Markdown |

### Dependencies Added

**Main Project:**
- `zod` (validation)

## Entry Points

### For API
```
POST https://pcstyle.dev/api/contact
GET https://pcstyle.dev/api/contact (health check)
```

### For Development
```bash
# Main project
npm run dev
```

## Dependencies Flow

```
Website/SSH Client
     ↓
POST /api/contact
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
│   ├── app/
│   │   └── api/
│   │       └── contact/
│   │           └── route.ts  → Deployed as serverless function
│   └── components/
│       └── SSHContactModal.tsx → Website component
```

## 🔍 What Goes Where

### Git Repository
- All source code
- Configuration examples
- Documentation
- `.env` files (gitignored)
- `node_modules/` (gitignored)

### Vercel Deployment
- Environment variable: `DISCORD_WEBHOOK_URL`
- Source: `/src/app/api/contact/route.ts`

---

## Quick Reference

**Need to change API logic?**
→ Edit `src/app/api/contact/route.ts`

**Want to modify SSH modal?**
→ Edit `src/components/SSHContactModal.tsx`

**API documentation?**
→ Read `docs/API_CONTACT_ENDPOINT.md`

---

Made with  for the terminal enthusiasts
