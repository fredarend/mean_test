const restful = require('node-restful')
const mongoose = restful.mongoose


// SUSPEITOS - INICIO //
const suspeitosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
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


// ALERTAS - INICIO //
const alertasSchema = new mongoose.Schema({
  tipoAcao: { type: String },
  fonte: { type: String },
  bo: { type: String },
  numeroBo: { type: Number },
  imagem: { type: String },
  relato: { type: String },
  modus: { type: String },
  falhasApuradas: { type: String },
  dataOcorrencia: { type: Date }  
})


// AÇÕES CRIMINOSAS - INICIO //
const acoesCriminosasSchema = new mongoose.Schema({
  tipoAcao: { type: String },
  fonte: { type: String },
  bo: { type: String },
  numeroBo: { type: Number },
  imagem: { type: String },
  relato: { type: String },
  modus: { type: String },
  falhasApuradas: { type: String },
  dataOcorrencia: { type: Date } 
})


// EVENTOS DE RISCO - INICIO //
const eventosDeRiscoSchema = new mongoose.Schema({
  tipoEvento: { type: String },
  fonte: { type: String },
  bo: { type: String },
  numeroBo: { type: Number },
  imagem: { type: String },
  relato: { type: String },
  modus: { type: String },
  falhasApuradas: { type: String },
  dataOcorrencia: { type: Date } 
})


// ACOES //
const acoesSchema = new mongoose.Schema({
  dataCadastro: { type: Date, default: Date.now },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  suspeitos: [suspeitosSchema],
  veiculos: [veiculosSchema],
  alertas: [alertasSchema],
  acoesCriminosas: [acoesCriminosasSchema],
  eventosDeRisco: [eventosDeRiscoSchema]
})

module.exports = restful.model('acoes', acoesSchema)
