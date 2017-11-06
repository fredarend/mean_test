angular.module('primeiraApp').controller('AlertasCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  'leafletData',
  AlertasController
])

function AlertasController($scope, $http, $location, msgs, tabs, consts, leafletData) {

  var vm = $scope

  vm.searchAlertas = function() {
    const page = parseInt($location.search().page) || 1
    const url = `${consts.apiUrl}/acoes/searchAlertas/?skip=${(page - 1) * 10}&limit=10`
    $http.get(url).then(function(resp) {
      vm.alertas = resp.data
      vm.alerta = {}
      $http.get(`${consts.apiUrl}/acoes/countAlertas`).then(function(resp) {
        vm.pages = Math.ceil(resp.data.value / 10)
        tabs.show(vm, {tabList: true, tabCreate: true})
      })
    })
  }

  vm.createBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles`;
    $http.post(url, vm.billingCycle).then(function(response) {
      vm.billingCycle = {}
      initCreditsAndDebts()
      vm.getBillingCycles()
      msgs.addSuccess('Operação realizada com sucesso!!')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.showTabUpdate = function(billingCycle) {
    vm.billingCycle = billingCycle
    initCreditsAndDebts()
    tabs.show(vm, {tabUpdate: true})
  }

  vm.updateBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles/${vm.billingCycle._id}`
    $http.put(url, vm.billingCycle).then(function(response) {
      vm.billingCycle = {}
      initCreditsAndDebts()
      vm.getBillingCycles()
      tabs.show(vm, {tabList: true, tabCreate: true})
      msgs.addSuccess('Operação realizada com sucesso!')
    }).catch(function(resp) {
      msgs.addError(resp.data.errors)
    })
  }

  vm.showTabDelete = function(billingCycle) {
    vm.billingCycle = billingCycle
    initCreditsAndDebts()
    tabs.show(vm, {tabDelete: true})
  }

  vm.deleteBillingCycle = function() {
    const url = `${consts.apiUrl}/billingCycles/${vm.billingCycle._id}`
    $http.delete(url, vm.billingCycle).then(function(response) {
       vm.billingCycle = {}
       initCreditsAndDebts()
       vm.getBillingCycles()
       tabs.show(vm, {tabList: true, tabCreate: true})
       msgs.addSuccess('Operação realizada com sucesso!')
    }).catch(function(resp) {
       msgs.addError(resp.data)
    })
  }

  vm.addDebt = function(index) {
    vm.billingCycle.debts.splice(index + 1, 0, {})
  }

  vm.cloneDebt = function(index, {name, value, status}) {
    vm.billingCycle.debts.splice(index + 1, 0, {name, value, status})
    initCreditsAndDebts()
  }

  vm.deleteDebt = function(index) {
    vm.billingCycle.debts.splice(index, 1)
    initCreditsAndDebts()
  }

  vm.addCredit = function(index) {
    vm.billingCycle.credits.splice(index + 1, 0, {name: null, value: null})
  }

  vm.cloneCredit = function(index, {name, value}) {
    vm.billingCycle.credits.splice(index + 1, 0, {name, value})
    initCreditsAndDebts()
  }

  vm.deleteCredit = function(index) {
    vm.billingCycle.credits.splice(index, 1)
    initCreditsAndDebts()
  }

  vm.cancel = function() {
    tabs.show(vm, {tabList: true, tabCreate: true})
    vm.billingCycle = {}
    initCreditsAndDebts()
  }

  vm.calculateValues = function() {
    vm.credit = 0
    vm.debt = 0

    if(vm.billingCycle) {
      vm.billingCycle.credits.forEach(function({value}) {
        vm.credit += !value || isNaN(value) ? 0 : parseFloat(value)
      })

      vm.billingCycle.debts.forEach(function({value}) {
        vm.debt += !value || isNaN(value) ? 0 : parseFloat(value)
      })
    }

    vm.total = vm.credit - vm.debt
  }


  var initCreditsAndDebts = function() {
    if(!vm.billingCycle.debts || !vm.billingCycle.debts.length) {
      vm.billingCycle.debts = []
      vm.billingCycle.debts.push({})
    }

    if(!vm.billingCycle.credits || !vm.billingCycle.credits.length) {
      vm.billingCycle.credits = []
      vm.billingCycle.credits.push({})
    }

    vm.calculateValues()
  }

  //INICIO -- DATE TIME PICKER

  vm.dateTimeRange = function() {
    $('#dataHora').daterangepicker({timePicker: true, timePickerIncrement: 30, format: 'DD/MM/YYYY h:mm A'});
  }

  //FIM -- DATE TIME PICKER

  //INICIO -- ANGULAR-MULTI-SELECT

  vm.ptbrAcao = {
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar ações"
  }  
  vm.ptbrFonte = {
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar fontes"
  }  
  vm.ptbrSuspeito = {
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar suspeitos"
  }        

  vm.tipoAlerta = [
      { name: "Furto", ticked: false  },
      { name: "Roubo armado", ticked: false  },
      { name: "Furto com maçarico", ticked: false  },
      { name: "Roubo com furadeira", ticked: false  },
      { name: "Roubo com explosivo", ticked: false  },
      { name: "Roubo armado", ticked: false  },
      { name: "Estelionato", ticked: false  }
  ];

  vm.fonteAlerta = [
      { name: "Polícia Militar", ticked: false  },
      { name: "Polícia Civil", ticked: false  },
      { name: "Gerente", ticked: false  }
  ];

  vm.suspeito = [
      { name: "Joaquín Guzmán", maker: "(El Chapo)", ticked: false  },
      { name: "Fernandinho Beiramar", ticked: false  },
      { name: "Pablo Escobar", ticked: false  }
  ];
  
  //FIM -- ANGULAR-MULTI-SELECT

  //MAPA 

  vm.markers = new Array();

  vm.buscaLatLong = function() {
    const url = `${consts.apiUrl}/acoes/searchAlertas/`
    $http.get(url).then(function(resp) {
      vm.alertas = resp.data
      angular.forEach(vm.alertas, function(value, key){

        vm.latitude = value.latitude
        vm.longitude = value.longitude

        angular.forEach(value.alertas, function(value, key) {
          vm.tipoAcao = value.tipoAcao
          vm.fonte = value.fonte

          var message = vm.tipoAcao + '<br><br><span>Fonte: ' + vm.fonte + '</span>'
          var icon = 'user'
          var color = 'blue'

          vm.markers.push({
              group: "Santa Catarina",
              lat: vm.latitude,
              lng: vm.longitude,
              message: message,
              icon: {
                  type: 'awesomeMarker',
                  prefix: 'fa',
                  icon: icon,
                  markerColor: color
              },
              label: {
                  options: {
                      noHide: true
                  }
              }
          });

        })
      })
    })
  }


  angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
      center: { // LOCALIZAÇÃO INICIAL  .
          lat: -27.226548,
          lng: -52.018311,
          zoom: 17
      },
      markers: vm.markers,
      defaults: {
          tileLayer: "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          zoomControlPosition: 'topright',
          tileLayerOptions: {
              opacity: 0.9,
              detectRetina: true,
              reuseTiles: true,
              attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy <a href="http://www.openstreetmap.org/copyright">GSEG Sistemas</a>',
          },
          scrollWheelZoom: true,
          minZoom: 3,
          worldCopyJump: true
      }
  });

  vm.ajustarMapa = function() {
      leafletData.getMap().then(function(map) {
          setTimeout(function() {
              map.invalidateSize();
              map._resetView(map.getCenter(), map.getZoom(), true);   
              map.fire('layeradd', {layer: this});

          }, 200);
      });
  };

  vm.ajustarMapa();

  vm.searchAlertas()

}
