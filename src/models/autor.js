import mongoose from "mongoose";


const autorEschema = new mongoose.Schema(
  {
    id: {type: String},
    nome: {
      type: String,
      required: [true, "O nome do(a) é obrigatório"]},
    nacionalidade: {type: String}
  },
  {
    versionKey: false
  }
);
const autores = mongoose.model("autores", autorEschema);

export default autores;