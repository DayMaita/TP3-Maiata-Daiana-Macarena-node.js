const express = require("express");
const path = require("node:path");
const { leerJson } = require("./archivos.js");

const PORT = 3000;
const rutaDatos = path.join(__dirname, "..", "datos", "instrumentos.json");

async function main() {
  try {
    const instrumentos = await leerJson(rutaDatos);
    const app = express();

    app.use(express.json());

    app.get("/", (req, res) => {
      res.status(200).json({ mensaje: "API de instrumentos disponible" });
    });

    app.get("/api/instrumentos", (req, res) => {
      const { familia } = req.query;

      if (!familia) {
        return res.status(200).json(instrumentos);
      }

      const resultado = instrumentos.filter(
        (instrumento) =>
          instrumento.familia.toLowerCase() === String(familia).toLowerCase()
      );

      res.status(200).json(resultado);
    });

    app.get("/api/instrumentos/:id", (req, res) => {
      const id = Number(req.params.id);
      const instrumento = instrumentos.find((elemento) => elemento.id === id);

      if (!instrumento) {
        return res.status(404).json({ error: "Instrumento no encontrado" });
      }

      res.status(200).json(instrumento);
    });

    app.post("/api/instrumentos", (req, res) => {
      const { nombre, familia, origen, descripcion, disponible } = req.body;

      if (
        !nombre ||
        !familia ||
        !origen ||
        !descripcion ||
        disponible === undefined
      ) {
        return res.status(400).json({
          error: "nombre, familia, origen, descripcion y disponible son obligatorios"
        });
      }

      const ultimoId =
        instrumentos.length === 0
          ? 0
          : instrumentos[instrumentos.length - 1].id;

      const nuevoInstrumento = {
        id: ultimoId + 1,
        nombre,
        familia,
        origen,
        descripcion,
        disponible
      };

      instrumentos.push(nuevoInstrumento);

      res.status(201).json(nuevoInstrumento);
    });

    app.listen(PORT, () => {
      console.log(`Servidor disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`No se pudo iniciar el servidor: ${error.message}`);
    process.exitCode = 1;
  }
}

main();
