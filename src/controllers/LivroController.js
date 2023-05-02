/* eslint-disable no-unused-vars */
import {autores, livros} from "../models/index.js";
import NaoEncontrado from "../erros/naoEncontrado.js";
import { parse } from "dotenv";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {
      
      const buscaLivros = livros.find();

      req.resultado = buscaLivros;

      next();

    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultado !== null) {
        res.status(200).send(livroResultado);
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      next(erro);
    }
  };

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  };

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
      
      const busca = await processaBusca(req.query);

      if(busca !== null){
        const livrosResultado =  livros
          .find(busca)
          .populate("autor");

        req.resultado = livrosResultado;

        res.status(200).send(livrosResultado);
      } else {
        res.status(200).send([]);
      }

      
    } catch (erro) {
      next(erro);
    }
  };
}

function processaBusca(parametros){
  const {editora, titulo, minPaginas, maxPaginas, nomeAutor} = parametros;

  let busca = {};

  if(editora) busca.editora = editora;
  if(titulo) busca.titulo = titulo;

  if(minPaginas || maxPaginas) busca.numeroPaginas = {};

  //gte = Greater than or Equal = Maior ou igual Que
  if(minPaginas) busca.numeroPaginas.$gte = minPaginas;

  //lte = less than or Equal = menor ou igual que
  if(maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if(nomeAutor) {
    const autor = autores.findOne({ nome: nomeAutor});
    if(autor !== null) {
      const autorId = autor._id;
      busca.autor = autorId;
    }else {
      busca = null;
    }
    
  }

  return busca;
}


export default LivroController;