# weather-app

Web app full-stack per il monitoraggio ambientale in tempo reale delle principali città della Liguria.

## Struttura

- `backend/`: API Express con cache in memoria, fetch parallelo e normalizzazione dei dati.
- `frontend/`: App React 18 con Vite, Tailwind CSS, Recharts e Leaflet.

## Avvio in locale

1. Installa le dipendenze dalla root del progetto:

```bash
npm install
```

2. Avvia backend e frontend insieme:

```bash
npm run dev
```

3. Apri la dashboard all'indirizzo:

```text
http://localhost:5173
```

## Endpoint principale

- `GET /api/weather/:city`

Cities supportate: Genova, La Spezia, Savona, Imperia, Sanremo, Rapallo.
