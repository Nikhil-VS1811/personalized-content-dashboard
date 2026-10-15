# PulseDash — Personalized Content Dashboard

PulseDash is a production-ready, accessible, personalized content aggregation dashboard built for the **SDE Intern Frontend Assignment**.

- **Phase 1**: Initialized the application shell using Next.js 14 (App Router), TypeScript, Tailwind CSS, Redux Toolkit, typed content models, and persistent local storage.
- **Phase 2**: Replaced fixture-only news and movie content with real API integrations (NewsAPI & TMDB), added an internal mock route for social posts, implemented multi-source 350ms debounced search, per-source pagination with Load More deduplication, independent failure handling with retry actions, and full offline/reload favorites persistence.
- **Phase 3**: Implemented card-level drag-and-drop and keyboard reordering with Framer Motion spring physics, assistive technology live announcements, focus-trapped dialogs, touch-safe scrolling, `prefers-reduced-motion` support, streamlined production UI, and comprehensive Playwright end-to-end testing across desktop and mobile.
- **Phase 4**: Performed comprehensive audit, validated pointer drag across responsive grids, removed invented movie details in favor of graceful omission of unavailable fields, added TMDB and NewsAPI attribution notices, verified zero credential leakage, and prepared complete submission documentation.
- **Phase 5**: Finalized configuration review, audited Git hygiene, established exact Vercel deployment procedures with demo/live mode separation, clarified mobile touch dragging constraints, and packaged final submission deliverables.

---

## 📋 Assignment Coverage Audit & Requirements Matrix

| Requirement / Specification | Implementation Location | Verification Evidence | Status |
|:---|:---|:---|:---:|
| **Personalized News Recommendations** | [`src/app/api/news/route.ts`](file:///Users/nikhilvs/untitled%20folder/src/app/api/news/route.ts), [`src/lib/server/newsService.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/server/newsService.ts) | Normalized to `NewsItem` model, filtered by user categories; verified in `tests/normalizers.test.ts` & `e2e/preferences.spec.ts` | **Complete** |
| **Movie Recommendations by Genre** | [`src/app/api/movies/route.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/server/movieService.ts), [`src/lib/server/genreMap.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/server/genreMap.ts) | Queries TMDB discover with `with_genres` mapping; verified in `tests/genreMap.test.ts` & `tests/normalizers.test.ts` | **Complete** |
| **Accurate Movie Details (No Invented Data)**| [`src/components/cards/MovieDetailsModal.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/cards/MovieDetailsModal.tsx), [`src/lib/server/normalizers.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/server/normalizers.ts) | Omits unavailable runtime/director/cast fields without placeholder invention; verified in `tests/normalizers.test.ts` | **Complete** |
| **Explicitly Mocked Social Content** | [`src/app/api/social/route.ts`](file:///Users/nikhilvs/untitled%20folder/src/app/api/social/route.ts), [`src/lib/server/socialService.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/server/socialService.ts) | Served via internal route, clearly labeled "Mock Route" in demo badge | **Complete** |
| **Unified Feed View** | [`src/components/dashboard/FeedView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/FeedView.tsx) | Interleaved stream of news, movies, and social posts with source filter tabs | **Complete** |
| **Trending & Favorites Sections** | [`TrendingView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/TrendingView.tsx), [`FavoritesView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/FavoritesView.tsx) | Populated with trending metrics; favorites persist across reload; verified in `e2e/favorites.spec.ts` | **Complete** |
| **Settings & Preferences Panel** | [`src/components/dashboard/SettingsView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/SettingsView.tsx) | Categories, genres, source toggles, compact view toggle; verified in `e2e/preferences.spec.ts` | **Complete** |
| **Debounced Multi-Source Search** | [`src/components/dashboard/SearchModal.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/SearchModal.tsx), [`src/store/api/contentApi.ts`](file:///Users/nikhilvs/untitled%20folder/src/store/api/contentApi.ts) | 350ms debounce across news, movies, and social with race condition protection; verified in `e2e/search.spec.ts` | **Complete** |
| **Accessible Load More Pagination** | [`src/components/dashboard/FeedView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/FeedView.tsx) | Independent source pagination, ID deduplication; verified in `e2e/feed_pagination.spec.ts` & `tests/pagination.test.ts` | **Complete** |
| **Desktop Pointer Drag-and-Drop Reordering**| [`src/components/dashboard/FeedView.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/dashboard/FeedView.tsx), [`src/components/cards/CardDragHandle.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/cards/CardDragHandle.tsx) | Drag handle reorders cards across multi-column grid; verified in Playwright desktop test `e2e/reorder.spec.ts` | **Complete** |
| **Native Mobile Touch Dragging** | [`src/components/cards/CardDragHandle.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/cards/CardDragHandle.tsx) | Touch screens do not fire HTML5 `dragstart`/`drop` natively without synthetic polyfills; tap-to-reorder buttons and keyboard arrows are provided and verified | **Pending / Unverified** |
| **Keyboard & Quick-Step Reordering** | [`src/components/cards/CardDragHandle.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/cards/CardDragHandle.tsx) | ArrowUp/Down keyboard reorder, step buttons, `aria-live` announcements; verified in `e2e/reorder.spec.ts` | **Complete** |
| **Order Persistence & Reset Action** | [`src/store/slices/feedOrderSlice.ts`](file:///Users/nikhilvs/untitled%20folder/src/store/slices/feedOrderSlice.ts) | Custom ID array persisted to `localStorage`; "Reset Order" action; verified in `e2e/reorder.spec.ts` | **Complete** |
| **Dark Mode & Responsive Layout** | [`src/store/slices/themeSlice.ts`](file:///Users/nikhilvs/untitled%20folder/src/store/slices/themeSlice.ts), [`src/app/globals.css`](file:///Users/nikhilvs/untitled%20folder/src/app/globals.css) | Tailwind CSS custom properties, system preference check, zero layout overflow; verified in `e2e/theme.spec.ts` | **Complete** |
| **Redux Toolkit & Safe Hydration** | [`src/store/index.ts`](file:///Users/nikhilvs/untitled%20folder/src/store/index.ts), [`StoreProvider.tsx`](file:///Users/nikhilvs/untitled%20folder/src/components/providers/StoreProvider.tsx) | 5 typed slices, RTK Query base API, zero Next.js hydration mismatch | **Complete** |
| **Unit & Integration Tests** | `tests/*.test.ts` (6 test suites) | 23 automated tests verifying normalizers, genre mapping, pagination, race conditions, and source failure | **Complete** |
| **Playwright E2E Tests** | `e2e/*.spec.ts` (7 spec files) | 17 passed browser tests across Chromium Desktop and Mobile emulators | **Complete** |
| **Dialog Accessibility (Focus Trap)** | [`src/lib/useFocusTrap.ts`](file:///Users/nikhilvs/untitled%20folder/src/lib/useFocusTrap.ts) | Focus trapping, Escape key closing, and focus restoration to initiating trigger | **Complete** |
| **Server-Side API Credential Security** | `src/app/api/**`, `.env.example`, `.gitignore` | Credentials kept strictly server-side; zero secrets in client bundles or git | **Complete** |
| **Live Upstream API Verification** | External third-party network calls | Depends on evaluator adding valid keys into `.env.local`; demo mode runs automatically | **Pending (Awaiting user keys)** |

---

## 🚀 Quick Start & Setup Instructions

### Prerequisites
- **Node.js**: v18.17+ or v20+ (tested on Node v20.20.2)
- **npm**: v9+ or v10+

### 1. Installation

```bash
cd "/Users/nikhilvs/untitled folder"
npm install
```

### 2. Environment Configuration

Create a `.env.local` file from `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` to configure your API keys (optional; demo mode activates automatically if keys are omitted):

```env
# NewsAPI (https://newsapi.org/register)
# Note: Free developer plan permits requests strictly from localhost.
NEWS_API_KEY=your_news_api_key_here

# TMDB (https://www.themoviedb.org/settings/api)
TMDB_API_KEY=your_tmdb_api_key_here

# Optional: Force Demo Mode (true/false)
DEMO_MODE=false
```

> **Security Guarantee**: All API secrets are strictly server-side. Upstream keys are never prefixed with `NEXT_PUBLIC_` and `.env*.local` is ignored in `.gitignore`.

### 3. Development Server

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Running Checks & Automated Tests

```bash
# 1. Run unit & integration test suite (Vitest) - 23 tests
npm test

# 2. Run Playwright End-to-End browser tests (Desktop & Mobile) - 17 passed, 1 skipped appropriately
npm run test:e2e

# 3. Run TypeScript typecheck
npx tsc --noEmit

# 4. Run ESLint checks
npm run lint

# 5. Create production build and run standalone
npm run build
npm run start
```

---

## 🏗️ Architecture & State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                       │
│  ┌───────────────────────┐       ┌───────────────────────┐  │
│  │   UI Dashboard Pages  │       │  Internal API Routes  │  │
│  │   (React Server/      │  ───> │  /api/news            │  │
│  │    Client Components) │       │  /api/movies          │  │
│  └───────────┬───────────┘       │  /api/social          │  │
│              │                   └───────────┬───────────┘  │
│              │                               │              │
│  ┌───────────▼───────────┐       ┌───────────▼───────────┐  │
│  │   Redux Toolkit Store │       │  Upstream Providers   │  │
│  │   - navigationSlice   │       │  - NewsAPI.org        │  │
│  │   - preferencesSlice  │       │  - The Movie Database │  │
│  │   - favoritesSlice    │       │  - Mock Community DB  │  │
│  │   - feedOrderSlice    │       └───────────────────────┘  │
│  │   - themeSlice        │                                  │
│  │   - RTK Query Base API│                                  │
│  └───────────┬───────────┘                                  │
│              │                                              │
│  ┌───────────▼───────────┐                                  │
│  │ localStorage (Client) │                                  │
│  │ Safe Hydration Hooks  │                                  │
│  └───────────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

### State Management Choices:
1. **Redux Toolkit**: Chosen for centralized management of cross-cutting client concerns (navigation state, user category/genre preferences, bookmarked favorites, theme mode, and custom card order sequence).
2. **RTK Query Base API**: Handles data fetching, normalized caching, and automatic request deduplication. Query arguments incorporate search terms, category filters, and pagination parameters to maintain cache integrity.
3. **Safe Client Hydration (`StoreProvider.tsx`)**: Stored preferences and bookmarks are hydrated safely inside `useEffect` on client mount. Server-rendered markup renders default baseline values, avoiding Next.js SSR hydration mismatch warnings.
4. **Order ID Array Only**: Custom card ordering stores solely an array of stable item IDs (`string[]`) in Redux and localStorage (`content_dashboard_feed_order_v1`). Fetched feed payloads are never redundantly stored.

---

## 🎯 Drag-and-Drop, Accessibility & Reordering Controls

### 1. Pointer Drag-and-Drop (Desktop & Mouse)
- Reorder any card in the multi-column responsive grid using its dedicated `GripVertical` drag handle.
- The drag handle has `touch-action: none` applied solely to itself. Links, movie detail modal buttons, and favorite buttons remain completely unobstructed.
- Cards animate with Framer Motion spring physics (`type: 'spring', stiffness: 350, damping: 25`).
- Moving cards across the grid updates the custom order sequence and highlights active drop targets.

### 2. Keyboard & Screen Reader Controls (`aria-live="polite"`)
- Focus the drag handle using `Tab` and press:
  - `ArrowUp` or `ArrowLeft`: Move the card one position earlier in the feed.
  - `ArrowDown` or `ArrowRight`: Move the card one position later in the feed.
- Live announcements are broadcast to assistive technology via a dedicated `role="status"` live region (e.g., *"Moved Interstellar to position 1 of 12"*).

### 3. Accessible Quick-Step Buttons (Touch & Mouse)
- Small chevron buttons (`ArrowUp` / `ArrowDown`) on the drag handle provide one-tap accessible repositioning on mobile and touch screens without blocking vertical page scrolling.
- Touch screens that do not dispatch native HTML5 drag-and-drop events use these accessible step buttons for reordering.

### 4. Dialog Focus Trapping (`useFocusTrap`)
- `MovieDetailsModal` and `SearchModal` capture initial focus, trap `Tab` / `Shift+Tab` cycles strictly inside the dialog, close immediately on `Escape`, and automatically return focus to the initiating trigger button upon closing.

### 5. Order Persistence & Reset
- Custom order is preserved across category filter changes and page reloads.
- A visible **Reset Order** button appears in the feed header whenever a custom order is active, allowing instant restoration of the default algorithmic stream.

---

## 🌐 Provider Deployment Terms & Hosting Configuration

### 1. NewsAPI Deployment Restrictions
- **Localhost Developer Tier**: Under [NewsAPI's official terms](https://newsapi.org/pricing), Developer accounts are intended strictly for local development on `localhost`. Deployments to cloud hosting providers (e.g. Vercel, Netlify, Render, AWS) require an upgraded commercial plan according to NewsAPI's terms of service; developer-tier requests made from non-localhost environments are subject to restriction or refusal by NewsAPI.
- **Hosting Plan Requirement**: Hosting a live cloud demo with external NewsAPI calls requires a paid commercial NewsAPI tier.
- **Practical Hosting Configuration**: To accommodate standard hosting platforms without requiring a paid subscription, the application includes an **explicitly labeled Demo Mode** (`DEMO_MODE=true` or automatically enabled if keys are omitted). Demo content is visibly badged as "Demo Data" with tooltips explaining the configuration.
- **Category Mapping for "Design"**: NewsAPI supports 7 standard categories: `business`, `entertainment`, `general`, `health`, `science`, `sports`, `technology`. To prevent `400 Bad Request`, the user's `Design` preference is mapped to the `general` category with a query filter `q=design`.

### 2. The Movie Database (TMDB) Terms & Attribution
- TMDB permits server-side production requests on free developer keys.
- **Attribution Notice**: TMDB requires visual notice that the product uses TMDB but is not endorsed or certified. This attribution is permanently rendered in the dashboard footer:
  > *"PulseDash Content Dashboard • News sourced via NewsAPI • Film metadata powered by TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB."*
- **Pagination Limit**: TMDB enforces a hard ceiling of 500 pages with 20 items per page.
- **Accurate Details**: Movie details do not display invented placeholder strings for director, cast, or runtime; missing fields from TMDB discovery are cleanly omitted.

---

## 🚀 Vercel Deployment Instructions

Follow these exact steps to deploy PulseDash to Vercel:

1. **Import Git Repository**:
   - Push your code to a private or public GitHub repository.
   - Go to [Vercel Dashboard](https://vercel.com/new) and select **Import Project**.
   - Select your GitHub repository.
2. **Project Settings**:
   - **Framework Preset**: `Next.js` (detected automatically)
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. **Environment Variables**:
   Choose the appropriate configuration:
   - **Option A: Demo Deployment (Recommended for free cloud hosting)**:
     - `DEMO_MODE=true`
     > **Important Notice**: A demo deployment showcases all UI workflows (preferences, category switching, search debounce, card drag-and-drop, favorites, dark mode, pagination) using sample data and internal routes with visible "Demo Data" labeling; it does not establish successful live API integration.
   - **Option B: Live Deployment (Commercial/Supported Tier)**:
     - `TMDB_API_KEY`: Your TMDB API Key
     - `NEWS_API_KEY`: Your NewsAPI Commercial Key (compatible with cloud hosting)
     - `DEMO_MODE=false`
4. **Deploy**:
   - Click **Deploy**. Vercel will build and assign a production URL.

---

## 🧪 Verification Results Summary

### Vitest Unit & Integration Suite (`npm test`)
- **`tests/feedOrder.test.ts`**: Reorder state updates, keyboard move bounds, screen reader announcements, order reset (5 tests).
- **`tests/normalizers.test.ts`**: News, movie, and social normalization, omission of unavailable director/cast without placeholder invention, stable IDs (9 tests).
- **`tests/genreMap.test.ts`**: TMDB genre IDs mapping and discover query formulation (3 tests).
- **`tests/pagination.test.ts`**: Load More deduplication and boundary calculations (2 tests).
- **`tests/search.test.ts`**: Keyword matching across fields and race condition protection (2 tests).
- **`tests/sourceFailure.test.ts`**: Partial-source failure isolation and non-silent error propagation (2 tests).
- **Total**: **23 passed, 0 failed**.

### Playwright End-to-End Suite (`npm run test:e2e`)
- **`e2e/reorder.spec.ts`**: Pointer drag-and-drop across grid, reload persistence, favorite button toggle without drag interference, keyboard reordering with `aria-live` announcement, quick-step touch reordering, order reset (Desktop: 3 passed; Mobile: 2 passed, 1 skipped appropriately for pointer drag).
- **`e2e/favorites.spec.ts`**: Bookmarking cards, navigating to Favorites, persisting after reload (Desktop & Mobile: 2 passed).
- **`e2e/feed_pagination.spec.ts`**: Clicking Load More appends results without duplicate IDs (Desktop & Mobile: 2 passed).
- **`e2e/preferences.spec.ts`**: Toggling category preferences, updating feed, and persisting after reload (Desktop & Mobile: 2 passed).
- **`e2e/search.spec.ts`**: 350ms debounce, match display, clearing search, empty results handling, Escape closing (Desktop & Mobile: 2 passed).
- **`e2e/source_failure.spec.ts`**: Simulating 502 error on news, confirming movies/social still render, testing Retry button recovery (Desktop & Mobile: 2 passed).
- **`e2e/theme.spec.ts`**: Dark/light theme toggling and html class persistence across reload (Desktop & Mobile: 2 passed).
- **Total**: **17 passed, 1 skipped, 0 failed**.

---

## 📹 2–3 Minute Demo Video Script

| Time | Scene / Action | Spoken Narration |
|:---|:---|:---|
| **0:00 – 0:30** | **Overview & Feed Personalization**<br>Start at Feed view on desktop. Click "Customize Preferences". Uncheck "Business", add "Science", toggle movie genres. Return to feed. | *"Welcome to PulseDash, a personalized content dashboard built with Next.js 14 and Redux Toolkit. Our unified feed streams articles from NewsAPI, movie recommendations from TMDB, and community insights from mock social routes. When I change category or genre preferences in Settings, the feed updates instantly with relevant content, and these preferences persist safely in localStorage without hydration warnings."* |
| **0:30 – 1:00** | **Card Reordering (Drag & Drop + Keyboard)**<br>Grab the drag handle of the first card and drag it past the second card. Note the spring animation and 'Custom Order Active' badge. Focus the handle with keyboard and press ArrowDown. Click 'Reset Order'. | *"Cards can be reordered directly in the grid. Each card has an explicit drag handle with touch-action: none so page scrolling is never blocked. Watch as I drag this card across the grid using pointer drag—Framer Motion provides smooth spring physics, and screen readers receive an immediate live announcement. Keyboard users can also press Arrow Up and Down to reorder, and clicking 'Reset Order' restores the default stream."* |
| **1:00 – 1:30** | **Debounced Multi-Source Search & Movie Details**<br>Press `/` or click search. Type `technology`, show live matches across news and movies. Clear search. Click a movie card to open details. | *"Pressing slash opens our accessible search dialog, which traps focus and debounces queries by 350ms across all sources with race condition protection. Slower responses can never overwrite newer queries. Clicking a movie card opens its details dialog—notice our streaming disclaimer and that all metadata is strictly verified without invented director or cast placeholders."* |
| **1:30 – 2:00** | **Favorites & Dark Mode Persistence**<br>Favorite a movie and an article. Navigate to Favorites view. Reload the page. Toggle Dark Mode in header. | *"Bookmarking cards saves them to our Redux favorites slice. In the Favorites view, saved items survive a full page reload because full item metadata is persisted. Our dark mode toggle uses CSS custom properties and Tailwind to provide instantaneous, contrast-compliant theme switching that also persists across reloads."* |
| **2:00 – 2:30** | **Responsive Mobile Layout & Error Recovery**<br>Switch browser tools to mobile viewport. Show bottom navigation. Simulate a source error and click Retry. | *"On mobile screens, the sidebar transitions smoothly into an accessible bottom navigation bar with quick-step reorder controls. Finally, our architecture guarantees source isolation: if NewsAPI experiences a network timeout or upstream 502, Movie and Social cards continue rendering uninterrupted, and the user can easily recover using the inline Retry button."* |

---

## 💼 Interview Explanation (Design Choices & Tradeoffs)

### Architecture & Design Decisions
> *"When building PulseDash, I focused on three core engineering principles: source isolation, accessible predictability, and strict data integrity.*
> 
> *First, for state management, I paired Redux Toolkit with RTK Query. Rather than bundling all source fetching into a monolithic request, I decoupled News, Movies, and Social queries. This ensures that an upstream failure on NewsAPI never breaks the feed for movies or social content, and allows each source to maintain independent pagination and retry states.*
> 
> *Second, for card reordering, I separated interaction intent. Instead of making entire cards draggable—which degrades touch scrolling and conflicts with links and favorite buttons—each card features an explicit drag handle with `touch-action: none`. On desktop, users get intuitive pointer dragging with Framer Motion spring physics; on keyboard and mobile touch, users have arrow keys and quick-step controls backed by `aria-live="polite"` screen reader announcements. Crucially, order persistence stores only an array of stable IDs (`string[]`), never redundant feed payloads.*
> 
> *Third, for API integration and deployment, all API keys remain strictly server-side inside Next.js route handlers. When examining NewsAPI's deployment restrictions, I noted that their free developer tier returns HTTP 426 on cloud hosting. To handle this gracefully without inventing data, I built an explicitly badged Demo Mode that transparently activates when keys are omitted, while providing a seamless bridge to live upstream data once credentials are provided."*

---

## 📬 Concise Submission Message Template

```markdown
Hi [Reviewer/Team],

Here is my submission for the SDE Intern Frontend Assignment: **PulseDash — Personalized Content Dashboard**.

- **GitHub Repository**: [Insert GitHub Repository URL]
- **Live Hosted Application**: [Insert Vercel / Hosted URL]
- **Demo Video (2–3 mins)**: [Insert Video Recording URL]

### Highlights:
- **Framework & State**: Built on Next.js 14 App Router, TypeScript, Tailwind CSS, Redux Toolkit, and RTK Query with safe localStorage hydration.
- **Multi-Source Personalization**: Independent feeds and 350ms debounced search across NewsAPI, TMDB, and mock community routes with complete failure isolation and retries.
- **Interactive Card Reordering**: Framer Motion spring physics with explicit drag handles (`touch-action: none`), keyboard arrow controls, screen reader announcements (`aria-live="polite"`), and order persistence.
- **Accessibility & Quality**: Focus-trapped dialogs (`useFocusTrap`), contrast compliance, `prefers-reduced-motion` support, 23 Vitest unit tests, and 17 Playwright E2E browser tests across desktop and mobile.

Thank you for your time and review!
```

---

## 📦 Concise Submission Checklist

- [x] Next.js 14 App Router, TypeScript, Tailwind CSS, ESLint configured.
- [x] Redux Toolkit store with 5 slices and safe localStorage hydration without SSR warnings.
- [x] Server-side Next.js route handlers for `/api/news`, `/api/movies`, and `/api/social`.
- [x] Multi-source 350ms debounced search with race condition prevention.
- [x] Per-source pagination with Load More deduplication.
- [x] Card drag-and-drop reordering with Framer Motion spring physics and explicit drag handles.
- [x] Keyboard reordering (`ArrowUp`/`ArrowDown`) with `aria-live="polite"` announcements.
- [x] Order ID persistence in localStorage and visible "Reset Order" action.
- [x] Accessible dialogs with `useFocusTrap`, Escape handling, and focus restoration.
- [x] Omission of unavailable movie director/cast/duration fields without invented placeholders.
- [x] TMDB and NewsAPI attribution notices included in application footer.
- [x] Clean `.gitignore` protecting `.env*.local` and test artifacts.
- [x] 23/23 Vitest unit tests passing (`npm test`).
- [x] 17 passed / 1 skipped on mobile touch emulation / 0 failed Playwright E2E tests (`npm run test:e2e`).
- [x] Clean TypeScript typecheck (`npx tsc --noEmit`) and ESLint (`npm run lint`).
- [x] Clean production build (`npm run build`).
