

app.directive('usermail', ["$q", "$http", function($q, $http) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {

      ctrl.$asyncValidators.usermail = function(modelValue, viewValue) {
              return $q(function(resolve, reject){
                        $http({
                                method : "GET",
                                url : "includes/systemController.php",
                                params : {get : "emailExists", data : modelValue }
                        }).then(function(response){
                                if(response.data.exists) {
                                  reject(response.data);
                                } else {
                                  resolve(response.data);
                                }
                        });

              });

      };
    }
  };
}]);
//log directive

app.directive("fileread",["$parse",function($parse){
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
          var model = $parse(attrs.fileread);
          var modelSetter = model.assign;

          element.bind('change', function(){
              scope.$apply(function(){

                console.log(element[0].attributes[5]);
                console.log(scope);

                  modelSetter(scope, element[0].attributes[5]);
              });
          });
      }
    }
}]);
app.directive('siteLogo', function() {

  return {
          replace: true,
          template: '<h1> ETevents </h1>'
  };

});

app.directive('organizerControlles', function(){
      return {
        restrict : "E",
        replace : true,
        transclude : true,
        template : "<md-toolbar class='md-tall'> "+
                "<div layout='column' class='md-toolbar-tools-bottom' layout-align='start center'>"+
            "<img ng-src='img/placeholder2.jpg' height='64' width='64'  class='user-avatar'/>"+
            " <div><strong>{{main.currentUser()}} </strong></div>"+
            "<div layout='row' layout-padding layout-align='space-between start'>"+
            "<md-button ng-click='main.showProfile()' > <md-icon class='icon-margin-right'>gear</md-icon>Setting</md-button>"+
            "<md-button ng-click='main.logOut()'><md-icon class='icon-margin-right'>home</md-icon>Log Out</md-button>"+
          "</div>"+
          "</div>"+
        "</md-toolbar>"

      };
});


app.directive("eventManagmentControlles", function(){
      return{
        restrict : "E",
        replace : true,
        transclude : true,
        template :  "<div>" +
        "<md-item ng-click='main.showUserDashboard()' >"+
          "<a>"+
            "<md-item-content  layout='row' layout-align='start center'>"+
              "<div class='inset'>"+
                "<md-icon >dashboard</md-icon>"+
              "</div>"+
              "<span class='inset md-body-2'> Dashboard </span>"+


            "</md-item-content>"+
          "</a>"+
        "</md-item>"+
        "<md-divider class='md-accent'></md-divider>"+
        "<md-item ng-click='main.showUserEvents()'  >"+
          "<a >"+
            "<md-item-content  layout='row' layout-align='start center'>"+
              "<div class='inset'>"+
                "<md-icon >event</md-icon>"+
              "</div>"+
              "<div class='inset md-body-2'>My Events  </div>"+
              "<span flex></span>"+
              "<span class='inset md-secondary'>12  </span>"+
            "</md-item-content>"+
          "</a>"+
        "</md-item>"+
        "</div>"
      }
})
app.directive("telephoneDisplay", function(){

    return {
      restrict : "E",
      scope : {
        phones : "="
      },
      templateUrl : "templates/telephoneList.html"
    };

});



app.directive("defaultControlles", function(){

    return {
        restrict : "E",
        replace : true,
        transclude : true,
        template : "<div>" +
        "<md-item ng-click='main.logIn()' >"+
          "<a>"+
            "<md-item-content  layout='row' layout-align='start center'>"+
              "<div class='inset'>"+
                "<md-icon >public</md-icon>"+
              "</div>"+
              "<div class='inset'>Log In  </div>"+
            "</md-item-content>"+
          "</a>"+
        "</md-item>"+
        "<md-divider class='md-accent'></md-divider>"+
        "<md-item ng-click='main.signUp($event)'  >"+
          "<a >"+
            "<md-item-content  layout='row' layout-align='start center'>"+
              "<div class='inset'>"+
                "<md-icon >public</md-icon>"+
              "</div>"+
              "<div class='inset'>Register  </div>"+
            "</md-item-content>"+
          "</a>"+
        "</md-item>"+
        "</div>"
    }

})
//log directive end
