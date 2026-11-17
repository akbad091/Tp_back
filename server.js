import express from "express";
import filmsRouter from "./routes/films.js";
import seancesRouter from "./routes/seances.js";
import reservationsRouter from "./routes/reservations.js";
import { journaliserRequete } from "./middlewares.js";
import "dotenv/config";

const app = express();

app.use(express.json());
app.use(journaliserRequete);

app.use("/films", filmsRouter);
app.use("/seances", seancesRouter);
app.use("/", reservationsRouter);

// Toute route qui n'a correspondu à aucun routeur.
app.use((req, res) => {
  res.status(404).json({ erreur: "Route inconnue" });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Serveur sur http://localhost:${PORT}`);
});