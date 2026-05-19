const express = require("express");
const cors = require("cors");

const { weatherRouter } = require("./routes/weatherRoutes");
const {
  notFoundHandler,
  globalErrorHandler,
} = require("./middleware/errorHandlers");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware base per accettare richieste dal frontend e leggere JSON in ingresso.
app.use(cors());
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Tutte le rotte applicative passano dal layer /api.
app.use("/api", weatherRouter);

// Il fallback finale evita risposte silenziose e centralizza gli errori.
app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`Backend avviato sulla porta ${PORT}`);
});
