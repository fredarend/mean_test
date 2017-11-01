const acoes = require('./acoes')

acoes.methods(['get', 'post', 'put', 'delete'])
acoes.updateOptions({new: true, runValidators: true})

acoes.route('count', function(req, res, next) {
  acoes.count(function(error, value) {
    if(error) {
      res.status(500).json({errors: [error]})
    } else {
      res.json({value})
    }
  })
})

module.exports = acoes