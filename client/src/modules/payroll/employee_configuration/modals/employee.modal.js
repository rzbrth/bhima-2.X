angular.module('bhima.controllers')
  .controller('EmployeeModalController', EmployeeModalController);

EmployeeModalController.$inject = [
  '$state', 'ConfigurationEmployeeService', 'NotifyService', 'appcache',
];

function EmployeeModalController($state, Config, Notify, AppCache) {
  var vm = this;
  vm.employee = {};

  var cache = AppCache('EmployeeModal');

  if ($state.params.creating || $state.params.id) {
    vm.stateParams = cache.stateParams = $state.params;
  } else {
    vm.stateParams = cache.stateParams;
  }
  vm.isCreating = vm.stateParams.creating;

  // exposed methods
  vm.submit = submit;
  vm.closeModal = closeModal;

  if (!vm.isCreating) {
    Config.read(vm.stateParams.id)
      .then(function (employee) {    
        vm.employee = employee;
      })
      .catch(Notify.handleError);
  }

  // submit the data to the server from all two forms (update, create)
  function submit(EmployeeForm) {
    var promise;

    if (EmployeeForm.$invalid || EmployeeForm.$pristine) { return 0; }

    promise = (vm.isCreating) ?
      Config.create(vm.employee) :
      Config.update(vm.employee.id, vm.employee);

    return promise
      .then(function () {
        var translateKey = (vm.isCreating) ? 'FORM.INFO.CREATE_SUCCESS' : 'FORM.INFO.UPDATE_SUCCESS';
        Notify.success(translateKey);
        $state.go('configurationEmployee', null, { reload : true });
      })
      .catch(Notify.handleError);
  }

  function closeModal() {
    $state.go('configurationEmployee');
  }
}