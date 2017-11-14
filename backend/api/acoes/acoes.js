const restful = require('node-restful')
const mongoose = restful.mongoose


// SUSPEITOS - INICIO //
const suspeitosSchema = new mongoose.Schema({
  name: { type: Array },
  sexo: { type: String },
  corPele: { type: String },
  altura: { type: String },
  peso: { type: String },
  tamanhoCabelo: { type: String },
  corCabelo: { type: String }
})


//VEICULO - SUSPEITO//
const veiculosSchema = new mongoose.Schema({
  marca: { type: String, required: true },
  modelo: { type: String },
  cor: { type: String },
  ano: { type: String },
  estadoConservacao: { type: String },
  placa: { type: String },
  ocupantes: { type: String }
})

// AÇÕES CRIMINOSAS - INICIO //
const acoesCriminosasSchema = new mongoose.Schema({
  tipoAcao: { type: String }
})


// EVENTOS DE RISCO - INICIO //
const eventosDeRiscoSchema = new mongoose.Schema({
  tipoEvento: { type: String }
})


// ACOES //
const acoesSchema = new mongoose.Schema({
  dataCadastro: { type: Date, default: Date.now },
  fonte: { type: Array },
  bo: { type: String },
  numeroBo: { type: Number },
  imagem: { type: String },
  relato: { type: String },
  modus: { type: String },
  falhasApuradas: { type: String },
  dataOcorrencia: { type: Date }, 
  latitude: { type: String, default: '-27.226520' },
  longitude: { type: String, default: '-52.018375' },
  suspeitos: [suspeitosSchema],
  veiculos: [veiculosSchema],
  tipoAcao: { type: String, required: true },
  acoesCriminosas: [acoesCriminosasSchema],
  eventosDeRisco: [eventosDeRiscoSchema]
})

module.exports = restful.model('acoes', acoesSchema)
