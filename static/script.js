//Main module to bootstrap our app
var app = angular.module('app', []);

app.controller('AppController', ['$scope',
  function($scope) {

    //Available tools
    $scope.tools = [{
      id: 1,
      name: 'A'
    }, {
      id: 2,
      name: 'B'
    }];
    
    $scope.optionsA = {
      allowedId: 1,
      multiple: false,
      data: []
    };
    
    $scope.optionsB = {
      allowedId: 2,
      multiple: true,
      data: []
    };

  }
]);

// directive to enable dragging. Add this attribute to an element to enable dragging.
// Attribute value will evalutaed with current scope using $eval and passed to dataTransfer as json.
app.directive('uiDraggable', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      
      element.attr('draggable', true);
      
      element.bind('dragstart', function(e) {
        var ev = e.originalEvent || e;
        
        ev.dataTransfer.effectAllowed = 'copy';
        
        var data  = scope.$eval(attrs.uiDraggable);
        ev.dataTransfer.setData('text/plain', angular.toJson(data));
      });
    }
  }
});

// directive to enable drop target. 
app.directive('uiDropable', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      
      var options = scope[attrs.uiDropable];
      
      element.bind('drop', function(e) {
        e.preventDefault();
        var ev = e.originalEvent || e;
        var data = ev.dataTransfer.getData("text/plain");

        var dataobj = angular.fromJson(data);

        //only add if drop target is valid
        if(!element.hasClass('over-invalid')){
          
          //run in $apply to trigger digest because things happening outside Angular world
          scope.$apply(function(){
            options.data.push(dataobj);
          });   
        };

        element.removeClass('over over-invalid');
      });

      //on dragover we want to give user a visual clue if the target is valid drop zone
      element.bind('dragover', function(e) {
        e.preventDefault();
        
        var ev = e.originalEvent || e;
        var data = ev.dataTransfer.getData("text/plain");
        var dataobj = angular.fromJson(data);

        //We do drop target validation here
        //on drop event we just check if target has invalid class
        if(options.allowedId == dataobj.id){
          element.addClass('over');
        }else{
          element.addClass('over-invalid');
        }

        //accept single item 
        if(!options.multiple && hasElement(options.data)){
          element.addClass('over-invalid');
        }
      });
    
      element.bind('dragleave', function(e){
        element.removeClass('over over-invalid');
      });

      function hasElement(options){
        return options.length > 0;
      };

    }
  };
});