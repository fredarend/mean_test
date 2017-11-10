angular.module('primeiraApp').controller('AlertasCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  'leafletData',
  '$timeout',
  "leafletMarkerEvents",
  AlertasController
])

function AlertasController($scope, $http, $location, msgs, tabs, consts, leafletData, $timeout, leafletMarkerEvents) {

  var vm = $scope

  vm.searchAlertas = function() {
    const page = parseInt($location.search().page) || 1
    const url = `${consts.apiUrl}/acoes/searchAlertas`    
    $http.get(url).then(function(resp) {

      vm.alertas = resp.data
      vm.final = new Array()
      angular.forEach(vm.alertas, function(value, key){
          vm.alert = value.alertas
          angular.forEach(vm.alert, function(value, key){
            vm.acoes = value.tipoAcao
            angular.forEach(vm.acoes, function(value, key){ 
              vm.tipoAcao = value.name
            })
          })     
          vm.final.push(vm.tipoAcao)
          console.log(vm.final)
      })


      vm.alerta = {}
      $http.get(`${consts.apiUrl}/acoes/countAlertas`).then(function(resp) {
        vm.pages = Math.ceil(resp.data.value / 5)
        tabs.show(vm, {tabList: true, tabCreate: true})
      })
    })
  }

  //INICIO -- DATE TIME PICKER

  vm.dateTimeRange = function() {
    $('#dataHora').datepicker({timePicker: true, timePickerIncrement: 30, format: 'dd/mm/yyyy'});
    $('#timePicker').timepicker();
  }

  //FIM -- DATE TIME PICKER
  vm.marcarPosicaoAcao = function() {

    vm.markers2 = {
        sicoob: {
            lat: -27.226785483109737,
            lng: -52.01850950717926,
            draggable: true,
            icon: {
                type: 'awesomeMarker',
                prefix: 'fa',
                icon: 'exclamation',
                iconColor: 'white',
                markerColor: 'blue'
            },
            focus: true
        }
    };

    vm.events2 = {
        markers: {
            enable: leafletMarkerEvents.getAvailableEvents(),
        }
    };

    vm.eventDetected = "No events yet...";
    var markerEvents = leafletMarkerEvents.getAvailableEvents();
    for (var k in markerEvents){
        var eventName = 'leafletDirectiveMarker.' + markerEvents[k];
        vm.$on(eventName, function(event, args){
            vm.eventDetected = event.name;
        });
    }
  }

  angular.extend(vm, { // EXTENDE AS PROPRIEDADES DO MAP (MARCADORES, LOCALIZAÇÃO INCIAL..)
      center2: { // LOCALIZAÇÃO INICIAL  .
          lat: -27.226548,
          lng: -52.018311,
          zoom: 17
      },
      markers2: vm.markers2,
      defaults2: {
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


  vm.cadastrarAlerta = function() {
    const url = `${consts.apiUrl}/acoes`;
    $http.post(url, vm.alerta).then(function(response) {
      vm.alerta = {}
      //initCreditsAndDebts()
      vm.searchAlertas()
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

  //INICIO -- ANGULAR-MULTI-SELECT

  vm.ptbrAcao = {
      selectAll: "Todos",
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar ações"
  }  
  vm.ptbrFonte = {
      selectAll: "Todos",
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar fontes"
  }  
  vm.ptbrSuspeito = {
      selectAll: "Todos",
      selectNone: "Limpar",
      search: "Pesquisar...",
      nothingSelected: "Selecionar suspeitos"
  }        

  vm.suspeitos = [
      { name: "Super Homem"  },
      { name: "Batman"  },
      { name: "Homem Aranha"  }
  ];

  vm.tipoAlerta = [
      { name: "Furto"  },
      { name: "Roubo armado"  },
      { name: "Furto com maçarico"  },
      { name: "Roubo com furadeira"  },
      { name: "Roubo com explosivo"  },
      { name: "Roubo armado"  },
      { name: "Estelionato"  }
  ];

  vm.fonteAlerta = [
      { name: "Polícia Militar"  },
      { name: "Polícia Civil"  },
      { name: "Gerente"  }
  ];

  
  //FIM -- ANGULAR-MULTI-SELECT

  //MAPA 

  vm.markers = new Array();

  vm.buscaLatLong = function() {
    const url = `${consts.apiUrl}/acoes/searchAlertas/`
    $http.get(url).then(function(resp) {
      vm.alertas = resp.data
      angular.forEach(vm.alertas, function(value, key){

        vm.latitude = parseFloat(value.latitude)
        vm.longitude = parseFloat(value.longitude)

        angular.forEach(value.alertas, function(value, key) {
          vm.tipoAcao = "Estelionato"
          vm.fonte = "Gerente"

          var message = vm.tipoAcao + '<br><br><span>Fonte: ' + vm.fonte + '</span>'

          vm.markers.push({
              group: "Santa Catarina",
              lat: vm.latitude,
              lng: vm.longitude,
              message: message,
              icon: {
                  type: 'awesomeMarker',
                  prefix: 'fa',
                  icon: 'exclamation',
                  iconColor: 'white',
                  markerColor: 'blue'
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

  vm.$on('$destroy', function () { 
      console.log("destruiu")
      leafletMarkersHelpers.resetCurrentGroups(); 
  });

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

  vm.ajustarMapa()
  vm.searchAlertas()

}
