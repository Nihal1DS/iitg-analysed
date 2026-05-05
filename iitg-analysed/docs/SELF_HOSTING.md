# Self-Hosting Guide — IITG Analysed

## Option 1: Vercel (Recommended)

1. Fork the repository on GitHub
2. Import the fork into [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard (copy from `.env.example`)
4. Deploy — Vercel auto-deploys on every push to `main`

## Option 2: Docker

```bash
git clone https://github.com/Nihal1DS/IITG-analysed.git
cd IITG-analysed
cp .env.example .env
# Edit .env as needed
docker-compose up -d
```

Open [localhost:5173](http://localhost:5173).

## Option 3: Manual (Node.js)

```bash
git clone https://github.com/Nihal1DS/IITG-analysed.git
cd IITG-analysed
npm install
cp .env.example .env

# Terminal 1 — API server
npm run server:dev

# Terminal 2 — Relay server
npx tsx watch server/relay.ts

# Terminal 3 — Frontend
npm run dev
```

## Environment Variables

See `.env.example` for full list. Minimum required for basic local operation: **none**.

Optional but recommended:
- `SCOPUS_API_KEY` — enables research publications feed
- `VITE_LLM_BACKEND=ollama` + Ollama running locally — enables AI briefs
