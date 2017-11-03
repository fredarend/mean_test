const _ = require('lodash')
const acoes = require('./acoes')

acoes.methods(['get', 'post', 'put', 'delete'])
acoes.updateOptions({new: true, runValidators: true})

//PADRONIZAÇÃO DOS ERROS EM ARRAY.
acoes.after('post', sendErrorsOrNext).after('put', sendErrorsOrNext)

function sendErrorsOrNext(req, res, next) {
  const bundle = res.locals.bundle

  if(bundle.errors) {
    var errors = parseErrors(bundle.errors)
    res.status(500).json({errors})
  } else {
    next()
  }
}

function parseErrors(nodeRestfulErrors) {
  const errors = []
  _.forIn(nodeRestfulErrors, error => errors.push(error.message))
  return errors
}
//FIM PADRONIZAÇÃO DOS ERROS.

//COUNT AÇÕES.

acoes.route('count', function(req, res, next) {
  acoes.count(function(error, value) {
    if(error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json({value})
    }
  })
})

//EVENTOS DE RISCO. GT é utilizado para comparação.
acoes.route('searchEventosDeRisco', function(req, res, next) {
	acoes.find({ eventosDeRisco: { $gt: [] } }, 'dataCadastro eventosDeRisco').sort('-created').exec(function(error, value) {
	    if(error) {
	      res.status(500).json({errors: [error]})
	    } else {
	      res.json({value})
	    }
	})
})

//EVENTOS DE RISCO. GT é utilizado para comparação.
acoes.route('limparBase', function(req, res, next) {
	acoes.remove()
})

module.exports = acoes