# Architettura del progetto

Questo progetto implementa una dashboard full-stack per il monitoraggio ambientale in tempo reale delle principali citta della Liguria.

## Panoramica

- Il frontend React dialoga solo con il backend locale.
- Il backend Express aggrega i dati da API pubbliche esterne.
- Le risposte del backend vengono normalizzate e cache-ate in memoria per 10 minuti.

## Flusso dei dati

1. L'utente seleziona una citta dalla lista o dalla mappa.
2. Il frontend chiama `GET /api/weather/:city`.
3. Il backend recupera in parallelo dati meteo, qualita dell'aria, mare e terremoti.
4. Ogni blocco che fallisce viene degradato a `null` senza interrompere gli altri risultati.
5. Il frontend mostra card dedicate e fallback eleganti quando una sezione non e disponibile.

## Backend

- `backend/server.js`: bootstrap di Express, CORS, health check e gestione errori globale.
- `backend/routes/weatherRoutes.js`: espone il routing dell'endpoint aggregato.
- `backend/controllers/weatherController.js`: inoltra la richiesta al service e restituisce il JSON standardizzato.
- `backend/services/dataService.js`: coordina fetching parallelo, cache in memoria e normalizzazione dei payload.
- `backend/utils/formatters.js`: converte codici e valori tecnici in etichette leggibili in italiano.

## Frontend

- `frontend/src/components/Dashboard.jsx`: gestisce stato della citta, refresh manuale e composizione della UI.
- `frontend/src/components/CompareSelector.jsx`: abilita la modalita confronto e sceglie le due citta.
- `frontend/src/components/CompareDashboard.jsx`: mostra i due pannelli affiancati e coordina il grafico comparativo.
- `frontend/src/components/CompareHourlyChart.jsx`: confronta la temperatura delle prossime 24 ore con due linee.
- `frontend/src/components/CurrentWeatherCard.jsx`: mostra condizioni meteo correnti.
- `frontend/src/components/HourlyChart.jsx`: visualizza l'andamento delle prossime 24 ore con Recharts.
- `frontend/src/components/AirQualityWidget.jsx`: evidenzia PM2.5, PM10 e AQI con tono dinamico.
- `frontend/src/components/CityMap.jsx`: permette la selezione della citta tramite mappa interattiva.
- `frontend/src/components/ErrorFallback.jsx`: gestisce il fallback quando una sezione e assente.

## Confronto in tempo reale

- Endpoint backend: `GET /api/compare?city1=genova&city2=laspezia`
- Il backend esegue le due aggregazioni in parallelo e restituisce un oggetto con due risultati separati.
- La cache combinata viene usata solo quando entrambi i lati hanno avuto successo.
- Se una citta fallisce, l'altra rimane visibile nel frontend e il messaggio di errore copre solo la colonna interessata.

## Citta supportate

- Genova
- La Spezia
- Savona
- Imperia
- Sanremo
- Rapallo

## Note operative

- Il backend usa coordinate hardcoded per evitare dipendenze extra lato client.
- La formattazione del tempo segue il fuso orario della citta selezionata.
- Le chiamate esterne sono protette da timeout per non bloccare la UX.
