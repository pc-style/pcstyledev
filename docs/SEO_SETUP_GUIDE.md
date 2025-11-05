# SEO Setup Guide dla pcstyle.dev

## Co już jest zrobione (Automated SEO)

### 1. **Metadata & Meta Tags**
- Kompletny title z template system
- Rozbudowany description (160+ znaków)
- 30+ dobrze dobranych keywords (pcstyle, Adam Krupa, itp.)
- Open Graph tags dla social media
- Twitter Cards
- Canonical URLs
- Author metadata
- Language tags (pl/en)

### 2. **Structured Data (Schema.org)**
- Person schema dla Adam Krupa (pcstyle)
- ItemList schema dla projektów
- CreativeWork & SoftwareApplication schemas
- JSON-LD format (preferowany przez Google)

### 3. **Technical SEO**
- Dynamic sitemap.xml
- robots.txt optimization
- humans.txt dla human-readable info
- Semantic HTML (h1, main, section)
- SR-only content dla dodatkowego kontekstu
- Fast loading (Next.js optimizations)
- Mobile-first responsive
- Image optimization (AVIF/WebP)

### 4. **Content Optimization**
- Keywords w naturalny sposób w content
- Nazwy "pcstyle" i "Adam Krupa" wszędzie
- Alt texts (jeśli masz images)
- Descriptive URLs
- Internal linking

---

## Następne kroki (Manual Setup Required)

### 1. **Google Search Console** (WAŻNE!)

#### Krok 1: Dodaj stronę do GSC
1. Idź na: https://search.google.com/search-console
2. Kliknij "Add property"
3. Wpisz: `https://pcstyle.dev`

#### Krok 2: Weryfikacja własności
Wybierz metodę weryfikacji (najlepsze 2 opcje):

**Opcja A: HTML Tag (najłatwiejsza)**
1. GSC da Ci meta tag typu:
```html
<meta name="google-site-verification" content="TWÓJ_KOD_TUTAJ" />
```

2. Otwórz `src/app/layout.tsx` i dodaj w metadata:
```typescript
verification: {
  google: 'TWÓJ_KOD_TUTAJ', // wklej kod bez meta tagu
},
```

**Opcja B: HTML File**
1. Pobierz plik .html od Google
2. Wrzuć do folderu `public/`
3. Deploy na Vercel

#### Krok 3: Submit Sitemap
Po weryfikacji:
1. W GSC → Sitemaps
2. Dodaj: `https://pcstyle.dev/sitemap.xml`
3. Submit

#### Krok 4: Request Indexing
1. Wpisz: `https://pcstyle.dev`
2. Kliknij "Request Indexing"
3. Google zaindeksuje w ciągu 1-7 dni

---

### 2. **Google My Business / Google Profile** (opcjonalne)

Jeśli chcesz pojawić się w Google Maps jako developer:
1. Utwórz profil: https://www.google.com/business/
2. Dodaj info o sobie jako freelancer/developer
3. Link do pcstyle.dev

---

### 3. **Backlinks & Social Signals**

#### Dodaj linki do profilu na:
- GitHub bio: https://github.com/pcstyle
- Twitter bio: https://twitter.com/pcstyle
- LinkedIn (jeśli masz)
- Dev.to / Hashnode (jeśli piszesz blogi)

#### Zrób content marketing:
- Napisz blog post o projektach
- Share na Reddit (r/webdev, r/reactjs)
- Post na Twitter z hashtags #webdev #portfolio
- Udostępnij na LinkedIn

---

### 4. **Analytics & Monitoring**

#### Google Analytics 4
1. Utwórz property: https://analytics.google.com
2. Skopiuj Measurement ID (G-XXXXXXXXXX)
3. Dodaj do next.config.ts lub użyj @next/third-parties

#### Plausible / Umami (alternatywa)
Jeśli wolisz privacy-friendly analytics:
- https://plausible.io
- https://umami.is

---

### 5. **Content Updates dla lepszego SEO**

#### A. Blog / Case Studies (opcjonalne ale MEGA pomaga)
Utwórz `/src/app/blog/` z postami:
- "Jak stworzyłem Clock Gallery używając React"
- "Neo-brutalizm w web design — mój approach"
- "PoliCalc: Open source projekt dla studentów PCz"

**Dlaczego?** Fresh content = wyższy ranking.

#### B. About Page
Rozważ `/about` z więcej info:
- Twoja historia
- Skills & technologie
- Kontakt
- CV do pobrania

#### C. Project Pages
Zamiast tylko linków, stwórz `/projects/[slug]`:
- `/projects/clock-gallery`
- `/projects/aimdrift`
- itp.

Każda strona = więcej keywords = więcej traffic.

---

## Monitoring & Tracking

### Sprawdzaj co tydzień:
1. **Google Search Console**
   - Impressions (ile razy pojawiłeś się w wynikach)
   - Clicks (ile kliknięć)
   - Average position
   - Top queries (jakie frazy ludzie wpisują)

2. **Google Analytics**
   - User flow
   - Most visited pages
   - Traffic sources

3. **Manual Search**
   - Wpisz: `site:pcstyle.dev` (ile stron Google zaindeksował)
   - Wpisz: `pcstyle` (jaka pozycja?)
   - Wpisz: `adam krupa developer` (jaka pozycja?)

---

## Expected Timeline

| Timeline | Co się stanie |
|----------|---------------|
| **1-3 dni** | Google zaindeksuje sitemap |
| **1 tydzień** | Pojawisz się w wynikach dla "pcstyle.dev" |
| **2-4 tygodnie** | Ranking dla "pcstyle" |
| **1-2 miesiące** | Ranking dla "adam krupa" |
| **3+ miesiące** | Top positions dla głównych keywords |

**Uwaga:** SEO to maraton, nie sprint. Consistent effort > jednorazowa optymalizacja.

---

## Quick Wins (zrób dzisiaj!)

1. **Submit do Google Search Console** (10 min)
2. **Dodaj link do bio na GitHub/Twitter** (5 min)
3. **Share portfolio na social media** (5 min)
4. **Ask friends to visit & share** (social signals pomogą!)

---

## Resources

- [Google Search Console](https://search.google.com/search-console)
- [Schema.org Validator](https://validator.schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Open Graph Debugger](https://developers.facebook.com/tools/debug/)

---

## Pro Tips

1. **Content is King** — więcej unique content = wyższy ranking
2. **Update regularnie** — Google lubi fresh content (dodaj "Last Updated" dates)
3. **Mobile-first** — Twoja strona już jest responsive, ale testuj na prawdziwych urządzeniach
4. **Speed matters** — Next.js już jest szybki, ale monitoruj Core Web Vitals
5. **Build authority** — Guest posts, open source contributions, conference talks

---

## Troubleshooting

### "Nie pojawiam się w Google po tygodniu"
- Sprawdź GSC czy są błędy crawl
- Sprawdź czy robots.txt nie blokuje
- Force re-index w GSC

### "Ranking jest niski"
- Dodaj więcej contentu (blog!)
- Get backlinks (share na social media)
- Optimize Core Web Vitals
- Patience — SEO takes time

### "Konkurencja jest wyżej"
- Analyze co oni mają (użyj inspect element)
- Create unique value (twoje projekty!)
- Build personal brand (Twitter, GitHub activity)

---

**Good luck, pcstyle! **

*Pamiętaj: SEO to proces. Pierwsze efekty zobaczysz za tydzień, ale prawdziwa magia dzieje się po 2-3 miesiącach consistent work.*

---

## Checklist

- [ ] Submit do Google Search Console
- [ ] Add verification code do layout.tsx
- [ ] Submit sitemap.xml
- [ ] Request indexing
- [ ] Add links to social profiles
- [ ] Share na social media
- [ ] Set up Analytics
- [ ] Monitor rankings weekly
- [ ] Consider adding blog (optional but powerful)
- [ ] Ask friends/colleagues to link to your site

**Po zrobieniu checklist — relax i czekaj na rezultaty! 😎**

