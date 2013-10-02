describe('Home Pages', function() {

  beforeEach(module('app.homePages'));


  describe("HomePage controller", function() {
      var scope, ctrl, $httpBackend;

      beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
          $httpBackend = _$httpBackend_;
          scope = $rootScope;
          ctrl = $controller('HomeCtrl', {$scope: scope});
      }));


      it('should default to a nonrunning state', inject(function() {
        expect(scope.running).toBeFalsy();
      }));

      it('should toggle running state when "Go!"', inject(function(){
        scope.go();
        expect(scope.running).toBeTruthy();
      }));

      it('should default to an empty array of primes', inject(function() {
        expect(scope.primes).toEqual([]);
      }));

      //TODO karma doesn't resolve the path requested for the webworker correctly and returns a 404
      //it('should add found primes to $scope.primes', inject(function() {
      //  $httpBackend.expectGET("/number").respond({'number': 3});  
      //  scope.go();
      //  $httpBackend.flush();
      //  expect(scope.primes).toEqual([3]);
      //}));
  });

});
