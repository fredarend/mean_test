angular.module('primeiraApp').controller('AlertasCtrl', [
  '$scope',
  '$http',
  '$location',
  'msgs',
  'tabs',
  'consts',
  AlertasController
])

function AlertasController($scope, $http, $location, msgs, tabs, consts) {

  var vm = $scope

  vm.getBillingCycles = function() {
    const page = parseInt($location.search().page) || 1
    const url = `${consts.apiUrl}/billingCycles?skip=${(page - 1) * 10}&limit=10`
    $http.get(url).then(function(resp) {
      vm.billingCycles = resp.data
      vm.billingCycle = {}
      initCreditsAndDebts()
      $http.get(`${consts.apiUrl}/billingCycles/count`).then(function(resp) {
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


  vm.getBillingCycles()

}
