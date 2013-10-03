describe('Stats Pages', function() {

  beforeEach(module('app.statsPages'));


  describe("StatsPage controller", function() {
      var scope, ctrl, $httpBackend;

      beforeEach(inject(function($rootScope, $controller, _$httpBackend_) {
          $httpBackend = _$httpBackend_;
          scope = $rootScope;
          ctrl = $controller('StatsCtrl', {$scope: scope});
      }));

      it('should default to empty stats', inject(function() {
        expect(scope.stats).toEqual({clients: 0, numProcessed: 0, primesFound: 0});
      }));
  });
});
