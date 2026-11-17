import { Router } from "express";
import { films, seances, reservations, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.param("id", validerId);

// POST /seances
router.post("/", (req, res) => {
  const { filmId, date, heure, salle, places } = req.body;

  if (
    !Number.isInteger(filmId) || filmId <= 0 ||
    typeof date !== "string" || date.trim() === "" ||
    typeof heure !== "string" || heure.trim() === "" ||
    typeof salle !== "string" || salle.trim() === "" ||
    !Number.isInteger(places) || places < 1
  ) {
    return res.status(400).json({
      erreur: "filmId, date, heure, salle et places (entier d'au moins 1) sont obligatoires"
    });
  }

  const filmExiste = films.some((film) => film.id === filmId);

  if (!filmExiste) {
    return res.status(404).json({ erreur: "Film introuvable" });
  }

  const nouvelleSeance = {
    id: prochainId(seances),
    filmId,
    date: date.trim(),
    heure: heure.trim(),
    salle: salle.trim(),
    places
  };

  seances.push(nouvelleSeance);
  res.status(201).json(nouvelleSeance);
});

// GET /seances/:id
router.get("/:id", (req, res) => {
  const seance = seances.find((element) => element.id === req.id);

  if (!seance) {
    return res.status(404).json({ erreur: "Séance introuvable" });
  }

  res.json({
    ...seance,
    placesRestantes: placesRestantes(seance)
  });
});

export default router;
