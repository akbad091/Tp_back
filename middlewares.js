export function validerId(req, res, next, valeur) {
    const id = Number(valeur);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "L'id doit être un entier positif" });
    }

    req.id = id;
    next();
}

export function journaliserRequete(req, res, next) {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
}