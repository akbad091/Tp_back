import { Router } from "express";
import { seances, reservations, prochainId, placesRestantes } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.param("id", validerId);

// POST /seances/:id/reservations
router.post("/seances/:id/reservations", (req, res) => {
  const { nom, nbPlaces } = req.body;

  // Vérifier le corps avant l'existence de la séance.
  if (
    typeof nom !== "string" || nom.trim() === "" ||
    !Number.isInteger(nbPlaces) || nbPlaces < 1 || nbPlaces > 10
  ) {
    return res.status(400).json({
      erreur: "nom et nbPlaces (entier entre 1 et 10) sont obligatoires"
    });
  }

  const seance = seances.find((element) => element.id === req.id);

  if (!seance) {
    return res.status(404).json({ erreur: "Séance introuvable" });
  }

  if (placesRestantes(seance) < nbPlaces) {
    return res.status(409).json({ erreur: "Pas assez de places restantes" });
  }

  const nouvelleReservation = {
    id: prochainId(reservations),
    seanceId: seance.id,
    nom: nom.trim(),
    nbPlaces
  };

  reservations.push(nouvelleReservation);
  res.status(201).json(nouvelleReservation);
});

// GET /seances/:id/reservations
router.get("/seances/:id/reservations", (req, res) => {
  const seanceExiste = seances.some((seance) => seance.id === req.id);

  if (!seanceExiste) {
    return res.status(404).json({ erreur: "Séance introuvable" });
  }

  res.json(reservations.filter((reservation) => reservation.seanceId === req.id));
});

// DELETE /reservations/:id
router.delete("/reservations/:id", (req, res) => {
  const index = reservations.findIndex((reservation) => reservation.id === req.id);

  if (index === -1) {
    return res.status(404).json({ erreur: "Réservation introuvable" });
  }

  reservations.splice(index, 1);
  res.status(204).end();
});

export default router;
