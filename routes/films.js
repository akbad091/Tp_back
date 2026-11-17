import { Router } from "express";
import { films, seances, prochainId } from "../data.js";
import { validerId } from "../middlewares.js";

const router = Router();

router.param("id", validerId);

// Get /films

router.get("/", (req, res) => {
    let resultat = [...films];

    if (req.query.genre) {
        resultat = resultat.filter(film => film.genre === req.query.genre);
    }

    if (req.query.tri === "duree") {
        resultat.sort((a, b) => a.duree - b.duree);
    }

    res.json(resultat);
});

// Get /films/:id

router.get("/:id", (req, res) => {
    const film = films.find(film => film.id === req.id);

    if (!film) {
        return res.status(404).json({ message: "Film non trouve" });
    }

    res.json(film);
});

// get /films/:id/seances

router.get("/:id/seances", (req, res) => {
    const film = films.find(film => film.id === req.id);

    if (!film) {
        return res.status(404).json({ message: "Film non trouve" });
    }

    const seancesDuFilm = seances.filter(seance => seance.filmId === req.id);

    res.json(seancesDuFilm);
});

// POST /films

router.post("/", (req, res) => {
  const { titre, genre, duree } = req.body;

  if (
    typeof titre !== "string" || titre.trim() === "" ||
    typeof genre !== "string" || genre.trim() === "" ||
    typeof duree !== "number" || !Number.isFinite(duree) || duree <= 0
  ) {
    return res.status(400).json({
      erreur: "titre, genre et duree (nombre supérieur à 0) sont obligatoires"
    });
  }

  const existeDeja = films.some(
    (film) => film.titre.toLowerCase() === titre.trim().toLowerCase()
  );

  if (existeDeja) {
    return res.status(409).json({ erreur: "Un film avec ce titre existe déjà" });
  }

  const nouveauFilm = {
    id: prochainId(films),
    titre: titre.trim(),
    duree,
    genre: genre.trim()
  };

  films.push(nouveauFilm);
  res.status(201).json(nouveauFilm);
});

// DELETE /films/:id
router.delete("/:id", (req, res) => {
  const index = films.findIndex((film) => film.id === req.id);

  if (index === -1) {
    return res.status(404).json({ erreur: "Film introuvable" });
  }

  const aDesSeances = seances.some((seance) => seance.filmId === req.id);

  if (aDesSeances) {
    return res.status(409).json({
      erreur: "Impossible de supprimer un film qui possède encore des séances"
    });
  }

  films.splice(index, 1);
  res.status(204).end();
});

export default router;
