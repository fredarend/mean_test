angular.module('primeiraApp').constant('consts', {
  appName: 'G-SEG Sistemas',
  version: '1.0',
  owner: 'G-SEG',
  year: '2017',
  site: 'http://cod3r.com.br',
  apiUrl: 'http://localhost:3003/api'
}).run(['$rootScope', 'consts', function($rootScope, consts) {
  $rootScope.consts = consts
}])
