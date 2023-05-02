import express from "express";
import autorController from "../controllers/AutorController.js";

const router = express.Router();

router
  .get("/autores", autorController.listarAutores)
  .get("/autores/:id", autorController.listarAutorPorId)
  .post("/autores", autorController.cadastrarAutor)
  .put("/autores/:id", autorController.atualizarAutor)
  .delete("/autores/:id", autorController.excluirAutor);

export default router;