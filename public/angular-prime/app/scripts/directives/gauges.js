angular.module("app.directives", [])
    .factory("googleVisualization", function($q, $rootScope) {
        var deferred = $q.defer();
        google.load('visualization', '1', {packages:['gauge'], callback: function(){
            $rootScope.$apply(deferred.resolve);
        }});
        return deferred.promise;
    })
    .directive('appGauges', function($timeout, googleVisualization) {
       return {
         restrict: 'C',
         link: function(scope, element, attributes) {
            var chartData, timeoutId;
            chartData = google.visualization.arrayToDataTable([
                ['meter', 'value'],
                ['Processed/Sec.', 0],
                ['Avg. Proc', 0]
            ]);
            
            var options = {width: 400, height: 200, minorTicks: 5};
            var chart = new google.visualization.Gauge(element[0]);

            //TODO this is what renders.  A watch will have to be on chart data and call this
            updateCharts();
    
            scope.$watch(attributes.numPerSec, function(value) { chartData.setValue(0,1,value); });
            scope.$watch(attributes.avg, function(value) { chartData.setValue(1,1,value); });
            
            function timer(){
               timeoutId = $timeout(function(){
                    updateCharts();
                    timer();
                }, 1000); 
            }

            function updateCharts(){
                chart.draw(chartData,options);
            }
            
            element.on('$destroy', function(){ $timeout.cancel(timeoutId); });

            timer();
         }
       }
    });
