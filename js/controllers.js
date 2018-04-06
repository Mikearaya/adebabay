
//Dialog Controller
function DialogController($scope, $mdDialog) {
      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };

};
//Dialog Controller end

//search controller used for searching events
app.controller('searchCtrl',["$scope", "$http", "$q", "$location",
                            function($scope, $http, $q, $location, $route){

    var searchValue = $scope.searchText;

      $scope.searchItemSelected = function(selected) {
                                $location.path('/eventDetail/'+selected.eventId);
                              };
      $scope.showEventDetail = function(eventId) {
                              $location.path('/eventDetail/'+eventId);
                            };

      $scope.getMatches = function(searchValue ){
                            return $http({
                                            method : 'GET',
                                            url : "includes/systemController.php",
                                            params : {get : "searchEvent", value : searchValue }
                                    })
                                    .then( function mySuccess(response){
                                              return response.data;
                                          },
                                            function myError(response){
                                              return response;
                                          });

                        };

}]);
//Search Controller End

//event thumbnail view Controller
app.controller('viewCtrl',[ "$http", "$location", "$route", "$q", "$mdDialog", "shareService", "imageLocator",
                          function($http, $location, $route, $q, $mdDialog, shareService,imageLocator){
    self = this;

self.events = "";
      $http({
              method : 'GET',
              url : "includes/systemController.php",
              params : {get : "view_catagory", catagoryId : $route.current.params.catagoryId }
            })
            .then( function mySuccess(response){
                    self.events = response.data;
            });
      self.eventImage = function(image){
        return imageLocator.poster(image);
      }
      self.showEventDetail = function(eventId) {
                              $location.path('/eventDetail/'+eventId);
                            };
      self.share = function(eve, id){
                      alert(id);
                    };
      self.openMenu = function($mdMenu, ev) {
                         originatorEv = ev;
                         $mdMenu.open(ev);
                    };

}]);
//viewController End


app.controller("userEventsController", ["$http", "$location", "$route", "session", "imageLocator",
                                        function( $http, $location, $route, session, imageLocator){

      var organizer = "";
      if($route.current.params.organizerId != session.getUserId()){
        $location.path("/");
      }else {
        organizer = $route.current.params.organizerId;
      }
      var self = this;

      self.activeEvents = [];
      self.draftEvents = [];
      self.pastEvents = [];
      self.eventImage = "";

      self.poster = function(eventImage){
          return  imageLocator.poster(eventImage);
      }
      function initialize(data){

        angular.forEach(data, function(evt){

          if(evt.status == "OPEN"){

            self.activeEvents.push(evt);
          }else if(evt.status == "DRAFT"){
            self.draftEvents.push(evt);
          } else if(evt.status == "CLOSED"){
            self.pastEvents.push(evt);
          }

        });
      };
      self.manageEvent = function(evt){
        $location.path("/eventManager/main/"+evt.eventId+"/"+organizer);
      }

        $http({
          method : "GET",
          url : "includes/systemController.php",
          params : {get : "organizerEvents", organizerId : organizer }
        }).then(function(response){
          initialize(response.data);


        })




}]);

app.controller("eventManagerController", [ "$http", "$location", "$route", "session", "transporter",
                                          function( $http, $location, $route, session, transporter){

      if($route.current.params.organizerId != session.getUserId()
        || $route.current.params.eventId === undefined){
          $location.path("/");
        }





      var self = this;
      var organizer = $route.current.params.organizerId;
      var currentEvent = $route.current.params.eventId;
      self.address = "";
      self.event = "";
      self.currentData = "";
      function initialize(data){
        self.event = data;
        self.address = data.subCity+", "+data.city+", "+data.country;
          console.log(data);


      }

      self.updateTickets = function(){
        transporter.set(self.event.tickets);
        $location.path("/updateEvent/ticket/"+currentEvent+"/"+organizer);
      }
      self.updateGuests = function(){
        transporter.set(self.event.guests);
        $location.path("/updateEvent/guest/"+currentEvent+"/"+organizer);
      }
      self.updateSponsors = function(){
        transporter.set(self.event.sponsors);
        $location.path("/updateEvent/sponsor/"+currentEvent+"/"+organizer);
      }
      self.updateGenerals = function(){
        transporter.set(self.event);
        $location.path("/updateEvent/general/"+currentEvent+"/"+organizer);
      }

      self.updateSchedule = function(){
        transporter.set(self.event);
        $location.path("/updateEvent/schedule/"+currentEvent+"/"+organizer);
      }

      self.updateDiscription = function(){
        transporter.set(self.event);
        $location.path("/updateEvent/discription/"+currentEvent+"/"+organizer);
      }

      $http({
        method : "GET",
        url : "includes/systemController.php",
        params : {get : "eventSummary", eventId : currentEvent, organizerId : organizer}
      }).then(function(response){
        initialize(response.data);
      });



}]);

app.controller("dynamicFieldController", [function(){

    var self = this;

    var guestJSON = { status : "new",
                      firstName : "",
                      lastName : "",
                      akaName : "",
                      image : []
                    };
    var ticketJSON = {  status : "new",
                        type : "" ,
                        ticketName : "",
                        quantity : "",
                        price : "",
                        ticketDiscription : "",
                        saleStart : "",
                        saleEnd : "",
                        showAdvanced : false
                      };
    var sponsorJSON = { status : "new",
                        sponsorName : "",
                        sponsorImage : []
                      };

      self.addGuest = function(guests) {
                      guests.push(guestJSON);
                    };
      self.addTicket = function(tickets) {
                        tickets.push(ticketJSON);
                      };
      self.removeTicket = function(tickets, index) {
                            tickets.splice(index, 1);
                      };
      self.removeGuest = function(guests,index) {
                          guests.splice(index, 1);
                      };
      self.addSponsor = function(sponsors) {
                          sponsors.push(sponsorJSON);
                      };
      self.removeSponsor = function(sponsors, index) {
                          sponsors.splice(index, 1);
                      };


}]);

app.controller("guestUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

          var guestsData = transporter.get();
          var self = this;
          if($route.current.params.eventId === undefined ||
            $route.current.params.organizerId === undefined ||
           $route.current.params.organizerId != session.getUserId()) {
             $location.path("/");
           }

           var organizer =   $route.current.params.organizerId;
           var currentEvent =   $route.current.params.eventId;

           self.guests = [];

           function initialize(data) {

             angular.forEach(data, function(guest){
               guest.status = "updated";
                self.guests.push(guest);


             });

           }


           initialize(guestsData);
          self.saveChanges = function(){
              $http({
                method : "POST",
                url : "includes/systemController.php",
                data : $httpParamSerializerJQLike({
                  form : "eventGuestsUpdate",
                  organizerId : organizer,
                  eventId : currentEvent,
                  data : JSON.stringify(self.guests)
                })
              }).then(function(response){
                if(response.data.success) {
                  notifier.basic("Event guests updated Successfuly!!!");
                } else {
                  notifier.basic("Event guests update Failed!!!");
                }
              })


          };

}]);

//event spoonsors update controller
app.controller("sponsorUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

    var sponsorData = transporter.get();
    var self = this;
    self.sponsors = [];

      if($route.current.params.eventId === undefined ||
         $route.current.params.organizerId === undefined ||
         $route.current.params.organizerId !== session.getUserId()) {
         $location.path("/");
       }

    var organizer = $route.current.params.organizerId;
    var currentEvent = $route.current.params.eventId;


        function initialize(data) {

           angular.forEach(data, function(sponsor){
                  sponsor.status = "updated";
                  self.sponsors.push(sponsor);
                  console.log(sponsor);
           });

        };

    initialize(sponsorData);



        self.saveChanges = function(){
            $http({
                    method : "POST",
                    url : "includes/systemController.php",
                    data : $httpParamSerializerJQLike({
                            form : "eventSponsorsUpdate",
                            organizerId : organizer,
                            eventId : currentEvent,
                            data : JSON.stringify(self.sponsors)
                          })
                  })
                  .then(function(response){

                      if(response.data.success) {
                        notifier.basic("Sponsors Updated Successfuly!!!");
                      } else {
                        notifier.basic("Sponsors Update Failed!!!");
                      }
                  });

        };


}]);

app.controller("eventGeneralUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter","address", "eventCatagory", "notifier",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, address, eventCatagory, notifier){

      var eventData = transporter.get();

        if(eventData === undefined ||
          $route.current.params.eventId === undefined ||
        $route.current.params.organizerId === undefined){
          $location.path("/myEvents");
        }
    var currentEvent = $route.current.params.eventId
    var organizer = $route.current.params.organizerId;
    var self = this;

    self.countries = address.getCountries();
    self.cities = address.getCities();
    self.eventCatagories
    eventCatagory.availableEventCatagories()
                                        .then(function(data){
                                            self.catagories = data;
                                          }
                                        );


    self.event = {
                    eventName : "",
                    catagory : {catagoryId : "", catagoryName : ""},
                    venueName : "",
                    city : "",
                    subCity : "",
                    country : "",
                    location : ""
                  };

      function initialize(data) {
          self.event.eventName = data.eventName;
          self.event.catagory =  data.eventCategory;
          self.event.venueName = data.venue;
          self.event.city = data.city;
          self.event.country = data.country;
          self.event.subCity = data.subCity;
          self.event.location = data.location;
          console.log(data);

      }

        initialize(eventData);
self.saveChanges = function(){
      return $http({
        method : "POST",
        url : "includes/systemController.php",
        data : $httpParamSerializerJQLike({
                form : "eventGeneralUpdate",
                eventId : currentEvent,
                organizerId : organizer,
                data : self.event
              })
      }).then(function(response){
        if(response.data.success){
          notifier.basic("Event Updated Successfuly!!!");
        }else {
          notifier.basic("Event Updated FAILED!!!");
        }
        console.log(response.data);
      })
};

}]);

app.controller("eventScheduleUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){
        var eventData = transporter.get();
        var self = this;

        if($route.current.params.eventId === undefined ||
          $route.current.params.organizerId === undefined ||
          $route.current.params.organizerId != session.getUserId()) {
            $location.path("/");
          }
      var organizer = $route.current.params.organizerId;
      var currentEvent = $route.current.params.eventId;

        self.schedule = {
          startTime : "",
          startDate : "",
          endTime : "",
          endDate : ""
        };

        function initialize(data) {
          self.schedule.startTime = data.startTime;
          self.schedule.startDate = data.startDate;
          self.schedule.endTime = data.endTime;
          self.schedule.endDate = data.endDate;

          console.log(data);
        }

        initialize(eventData);

        self.saveChanges = function(){
          return $http({
            method : "POST",
            url : "includes/systemController.php",
            data : $httpParamSerializerJQLike({
              form : "eventScheduleUpdate",
              organizerId : organizer,
              eventId : currentEvent,
              data : self.schedule
            })
          }).then(function(response){

              if(response.data.success) {
                notifier.basic("Event Schedule updated Successfuly!!!");
              } else {
                notifier.basic("Event Schedule Update Failed!!!");
              }
              console.log(response);
          });
        };

}]);


app.controller("eventTicketUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){
          var ticketData = transporter.get();
          var self = this;
          if($route.current.params.organizerId === undefined ||
            $route.current.params.organizerId != session.getUserId() ||
            $route.current.params.eventId === undefined) {
              $location.path("/");
            }
          if(ticketData === undefined){

          }
      var organizer = $route.current.params.organizerId;
      var currentEvent = $route.current.params.eventId;
      self.tickets = [];
self.saleStartDefault;
self.saleEndDefault;
        function initialize(data){

          angular.forEach(data, function(ticket, i){
            ticket.price = parseInt(ticket.price);
            ticket.quantity = parseInt(ticket.quantity);
              self.tickets.push(ticket);

          });

          console.log(self.tickets);
        }

        initialize(ticketData);

      self.saveChanges = function(){

        $http({
          method : "POST",
          url : "includes/systemController.php",
          data : $httpParamSerializerJQLike({
            form : "eventTicketsUpdate" ,
            eventId : currentEvent,
            organizerId : organizer,
            data : JSON.stringify(self.tickets)
          })
        }).then(function(response){
          if(response.data.success){
            notifier.basic("Event Tickets Updated Successfuly!!!");
          } else {
            notifier.basic("Event Tickets Update Failed!!!");
          }

          console.log(response);
        });


      };

}]);

app.controller("eventDiscriptionUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

          var eventData = transporter.get();
          var self = this;

          if($route.current.params.eventId === undefined ||
            $route.current.params.organizerId === undefined ||
          $route.current.params.organizerId != session.getUserId()){
            $location.path("/");
          }

          var organizer = $route.current.params.organizerId;
          var currentEvent = $route.current.params.eventId;
          self.eventDiscription = "";

          function initialize(data){
             self.eventDiscription = data.aboutEvent;

          }

          initialize(eventData);



        self.saveChanges = function(){
            return $http({
              method : "POST",
              url : "includes/systemController.php",
              data : $httpParamSerializerJQLike({
                form : "eventDiscriptionUpdate",
                eventId : currentEvent,
                organizerId : organizer,
                data : self.eventDiscription
              })
            }).then(function(response) {

                if(response.data.success){
                  notifier.basic("Event discription updated Successfuly!!!");
                } else {
                  notifier.basic("Event discription update Failed!!!");
                }

                console.log(response);
            })
        };

}]);

app.controller("organizerBioUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

          var organizerData = transporter.get();
          var self = this;

          if($route.current.params.organizerId === undefined ||
          $route.current.params.organizerId != session.getUserId()){
            $location.path("/");
          }

          var organizer = $route.current.params.organizerId;

          self.bio = "";

          function initialize(data){
             self.bio = data;


          }

          initialize(organizerData);



        self.saveChanges = function(){
            return $http({
              method : "POST",
              url : "includes/systemController.php",
              data : $httpParamSerializerJQLike({
                form : "organizerBioUpdate",
                organizerId : organizer,
                data : self.bio
              })
            }).then(function(response) {

                if(response.data.success){
                  notifier.basic("Bio updated Successfuly!!!");
                } else {
                  notifier.basic("Bio update Failed!!!");
                }

                console.log(response);
            })
        };

}]);

app.controller("comapanyProfileUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

          var companyData = transporter.get();
          var self = this;

          if($route.current.params.organizerId === undefined ||
            $route.current.params.organizerId != session.getUserId()){
            $location.path("/");
          }

          var organizer = $route.current.params.organizerId;

          self.company = {
            name : "",
            website : "",
            postNumber : "",
            establishedOn : "",
            service : ""
          };

          function initialize(data){
             self.company.name = data.organizationName;
             self.company.service = data.service;
             self.company.postNumber = data.postNumber;
             self.company.website = data.website;
             self.company.establishedOn = data.establishedOn;
          }

          initialize(companyData);

        self.saveChanges = function(){
            return $http({
              method : "POST",
              url : "includes/systemController.php",
              data : $httpParamSerializerJQLike({
                form : "companyProfileUpdate",
                organizerId : organizer,
                data : JSON.stringify(self.company)
              })
            }).then(function(response) {

                if(response.data.success){
                  notifier.basic("Company Profile update Successfuly!!!");
                } else {
                  notifier.basic("Company Profile update Failed!!!");
                }

                console.log(response);
            })
        };

}]);


app.controller("companyDiscriptionUpdateController", ["$http","$location", "$route", "$httpParamSerializerJQLike","transporter", "notifier", "session",
                                          function($http,$location, $route, $httpParamSerializerJQLike, transporter, notifier, session){

          var companyData = transporter.get();
          var self = this;

          if($route.current.params.organizerId === undefined ||
            $route.current.params.organizationId === undefined ||
          $route.current.params.organizerId != session.getUserId()){
            $location.path("/");
          }

          var organizer = $route.current.params.organizerId;
          var organization = $route.current.params.organizationId;

          self.discription = "";

          function initialize(data){
             self.discription = data;
          }

          initialize(companyData);

        self.saveChanges = function(){
            return $http({
              method : "POST",
              url : "includes/systemController.php",
              data : $httpParamSerializerJQLike({
                form : "companyDiscriptionUpdate",
                organizerId : organizer,
                organizationId : organization,
                data : self.discription
              })
            }).then(function(response) {

                if(response.data.success){
                  notifier.basic("Bio updated Successfuly!!!");
                } else {
                  notifier.basic("Bio update Failed!!!");
                }

                console.log(response);
            })
        };

}]);

//eventDetail viewer page controller
app.controller("detailViewController",["$scope", "$route", "$http", "shareService", "imageLocator", "$location","transporter",
                                function($scope, $route, $http, shareService, imageLocator, $location, transporter){
    var self = this;
      self.selectedTickets = 0;
      self.totalPrice = 0;
      self.tickets = [];
      self.event = "";


      self.order = [];



      self.eventImage = function() {
        return imageLocator.poster(self.event.eventImage);
      };
      self.guestImage = function(image) {
          return imageLocator.guest(image);
      };
      self.sponsorImage = function(image) {
          return imageLocator.sponsor(image);
      };
      self.initialize = function(data){
        self.event.phones = JSON.parse(data.phones);
        self.event.catagory = data.eventCatagory;
        self.event.start = new Date(data.eventStartDate+"T"+data.eventStartTime);
        self.event.end = Date(data.eventEndDate+"T"+data.eventEndTime);




      }

      self.eventTickets = function(ticket) {

          for(var i = 0 ; i <   ticket.length; i++) {
              var t = "";
                      t = { selected : 0,
                            id : ticket[i].ticketId,
                            type : ticket[i].ticketType,
                            name : ticket[i].ticketName,
                            saleStart : ticket[i].saleStart,
                            saleEnd : ticket[i].saleEnd ,
                            discription : ticket[i].aboutTicket ,
                            price : ticket[i].ticketPrice,
                            available : ticket[i].availableTicket
                          };
                  self.tickets.push(t);
              }
      };

      self.checkOut = function(){
        transporter.set(self.order);
          $location.path("/orderForm/event/"+self.event.eventId+"/checkout/");
      }

      self.calculate = function(old, newval) {

          self.totalPrice -= (old * newval.price);
          self.selectedTickets = (self.selectedTickets - old) + newval.selected;
          self.totalPrice += newval.selected * newval.price;

          if(newval.selected === 0 && old !== 0 ){
            self.order.splice(index, 1);
          } else {

              var index = self.order.indexOf(newval);
                if(index !== -1){
                  self.order.splice(index, 1);
                }
              self.order.push(newval);
          }
      };

      $http({
        method : 'GET',
        url : 'includes/systemController.php',
        params : {get : 'eventDetail', eventId : $route.current.params.eventId }
      })
      .then(function success(response) {
            self.event = response.data;
            self.initialize(response.data);
             self.eventTickets(response.data.ticket);
      });

}]);
//detailView Controller end

//ticket checkout page controller
app.controller("orderController",["$scope", "$route", "$http", "$q", "transporter", "$location", "$httpParamSerializerJQLike",
                                  function($scope, $route, $http,$q, transporter, $location, $httpParamSerializerJQLike ){


        if($route.current.params.eventId === undefined){
          $location.path("/");
        };
    var self = this;
    var currentEvent = $route.current.params.eventId;
    self.orders = [];
    self.attendee = {
                firstName : "",
                lastName : "",
                mobileNumber : "",
                paymentProvider : "",
                email : ""

                };


  self.orders =  transporter.get();
  if(!self.orders) {
    $location.path("/");
  }



  self.completeOrder = function() {
        var order = {
          tickets : JSON.stringify(self.orders),
          attendee : self.attendee
        }
        return $http({
                        method : "POST",
                        url : "includes/systemController.php",
                        data : $httpParamSerializerJQLike({
                                          form : "orderForm",
                                          data : order,
                                          eventId : currentEvent
                                        })
        }).then(function(response){
              console.log(response);
        });

      };

}]);
//order controller end

//home page controller
app.controller('mainController', ["$scope", "$rootScope", "$location", "$mdSidenav", "$mdDialog", "$http",
                                  "eventCatagory", "notifier", "session",
                                  function($rootScope, $scope, $location, $mdSidenav,
                                            $mdDialog, $http, eventCatagory, notifier, session){

var self = this;
      eventCatagory.availableEventCatagories()
                    .then(function(catagoryList){
                            self.eventCatagories = catagoryList;
                    });

      self.isLogged = function() {
                        return session.isLoggedIn();
                  };
    self.currentUser = function(){
       return session.getUserName();
     };
     self.showProfile = function(){
       $location.path("/userProfile");
     }
      self.logOut = function() {

                      session.destroy();
                };
      self.showEvents = function(catag) {
                          $location.path('/events/id/'+catag.catagoryId+'/catagory/'+catag.catagoryName);
                    };

      self.createEvent = function(ev){
        if(self.isLogged()){
          $location.path("/eventForm/id/"+session.getUserId());
        }else{
         $location.path("/signUp/create");
       }
     };




      self.signUp = function(ev) {
        $location.path("/signUp/register");
      };
      self.logIn = function(ev) {
                     $mdDialog.show({
                                     templateUrl: 'templates/logIn.html',
                                     parent: angular.element(document.body),
                                     targetEvent: ev,
                                     clickOutsideToClose:false
                                })
                               .then(function(answer) {
                                 $scope.status = 'You said the information was "' + answer + '".';
                               });

                 };

    // Needed for the loading screen
      $rootScope.$on('$routeChangeStart', function(angularEvent, next, current) {
          $rootScope.loading = true;
      });
      $rootScope.$on('$routeChangeSuccess',
                      function() {
                                    $rootScope.loading = false;
                      });


      // Right Sidebar
      self.toggleSidenav = function(menuId) {
                              $mdSidenav(menuId).toggle();
                          };

      self.showUserEvents = function(){
        $location.path("/myEvents/"+session.getUserId());
      }

}]);
//main Controller End

//log in Controller
app.controller('logInController', ["$scope", "$http", "$httpParamSerializerJQLike", "session", "$mdDialog",
                            function($scope, $http, $httpParamSerializerJQLike, session, $mdDialog){
    var self = this;

    self.user = {
                  password: "",
                  email: ""

              };
      self.hide = function() {
        $mdDialog.hide();
      };
      self.cancel = function() {
        $mdDialog.cancel();
      };
      self.answer = function(answer) {
        $mdDialog.hide(answer);
      };

      self.Submit = function(){
                          return $http({
                                          method : "POST",
                                          url : "includes/systemController.php",
                                          data : $httpParamSerializerJQLike({form : "log_in", data : self.user })
                                  })
                                  .then(function(response){
                                    console.log(response);
                                    session.create(response.data.organizerId, response.data.organizerName);
                                    self.hide();
                                  });
                      };

}]);
//log in Controller

app.controller('homeCtrl',["$scope",
                          function($scope){

}]);
``
app.controller("phoneEditerController",["$scope", "$route", "$http", "transporter", "session",
"$location", "$httpParamSerializerJQLike", "notifier",
                              function($scope, $route, $http, transporter, session,
                                 $location, $httpParamSerializerJQLike, notifier){

    var self = this;
    var organizer = $route.current.params.organizerId;
    var organization = $route.current.params.organizationId;

    self.phones = transporter.get();
    self.removedPhones = [];
      if(organizer != session.getUserId() || self.phones === undefined ){
        $location.path("/userProfile");
      }

      self.deletePhone = function(index){
        self.removedPhones.push(self.phones.splice(index,1));

      }

      self.undoDelete = function(){
        self.phones.push(self.removedPhones.splice(0, self.removedPhones.length ));
      }
      self.saveChanges = function(){

              $http({
                      method : "POST",
                      url : "includes/systemController.php",

                      data : $httpParamSerializerJQLike({form : "updatePhoneNumber",
                      organizerId : organizer , organizationId : organization , data : JSON.stringify(self.phones) })
          }).then(function(response){

            if(response.data.success){
              notifier.basic("Phone Number Updated Successfuly");
              $location.path("/userProfile");
            } else {
              notifier.basic("Error Updating phone numbers");
            }
          }, function(error){
            console.log(error);
          })
      }

self.phoneTypes = [{type : "Mobile",icon : "phone"},
{type : "Office",  icon : "business"},
{type : "Land Line", icon : "phone"}];

      self.addPhone = function(){
        self.phones.push({type : "", number : "", icon : ""});
      }


}]);


app.controller("userProfileController", ["$scope", "$http", "$q", "session", "imageLocator",
                                        "$location", "transporter",
                                        function($scope, $http, $q, session, imageLocator,
                                          $location, transporter){
      var self = this;
      var currentUser = session.getUserId();
      self.data = {};
      self.organizer = {
        firstName : "", lastName : "", email : "", profilePic : "",
        gender : "", birthdate : "", position : "", prefix : ""
      };

      self.company = {
        name : "", socials : [], address : "", registeredOn : "", establishedOn : "",
        address : [], phoneNumbers : [], discription : ""
      }

      self.organizationId ="";
      self.organizerId = "";

      self.initialize = function(data){
          self.organizationId = data.organizationId;
          self.organizerId = data.organizerId;
          self.organizer.email = data.email;
          self.organizer.birthdate = data.birthdate;
          self.organizer.firstName = data.firstName;
          self.organizer.lastName = data.lastName;
          self.organizer.gender = data.gender;
          self.organizer.prefix = data.title;
          self.organizer.position = data.organizerPosition;
          self.organizer.bio = data.aboutOrganizer;
          self.company.name = data.organizationName;
          self.company.registeredOn = data.registeredOn;
          self.company.service = data.service;
          self.company.website = data.website;
          self.company.discription = data.aboutOrganization;
          self.company.phoneNumbers = JSON.parse(data.phoneNumber);
          self.company.socials = JSON.parse(data.social);
          self.company.address = JSON.parse(data.address);
          self.company.establishedOn = JSON.parse(data.establishedOn);
          console.log(data);


      }

      self.fullName = function() {
        return self.organizer.prefix +" "+self.organizer.firstName+" "+ self.organizer.lastName
      }

      self.updateCompanyProfile = function(){
        transporter.set(self.company);
        $location.path("/editCompany/profile/"+self.organizerId);
      }

      self.editProfile = function(data){
        transporter.set(data);
        $location.path("/editCompany/myprofile/"+self.organizerId+"/"+self.organizationId);
      }

      self.editBio = function(){
        transporter.set(self.organizer.bio);

        $location.path("/editCompany/myBio/"+self.organizerId+"/"+self.organizationId);
      }

      self.editPhones = function(){
        transporter.set(self.company.phoneNumbers);
        $location.path("/editCompany/phone/"+self.organizerId+"/"+self.organizationId);
      }

      self.editAddress = function(data){
        transporter.set(data);
        $location.path("/editCompany/address/"+self.organizerId+"/"+self.organizationId);
      }

      self.editSocialAddress = function(data) {
        transporter.set(data);
        $location.path("/editCompany/social/"+self.organizerId);
      }

      self.editEmail = function(){
        transporter.set(self.company.email);
        $location.path("/editCompany/email/"+self.organizerId);
      }

      self.editWebsite = function(){
        transporter.set(self.company.website);
        $location.path("/editCompany/website/"+self.organizerId);
      }
      self.updateDiscription = function(){
        transporter.set(self.company.discription);
        $location.path("/editCompany/discription/"+self.organizerId+"/"+self.organizationId);
      }

      self.updateBillingAddress = function(){
        
      }


      $http({
        method : "GET",
        url : "includes/systemController.php",
        params : {get : "organizer_info", organizerId : currentUser }
      }).then(function(response){
        console.log(response);
        self.initialize(response.data);
      } ,function(error){
      });


}]);

app.controller("websiteEditerController", ["$scope", "$http", "$route", "$location", "$httpParamSerializerJQLike",
                                          "transporter", "notifier", "session",
                                      function($scope, $http, $route, $location, $httpParamSerializerJQLike, transporter,
                                      notifier, session){

          if($route.current.params.organizerId === undefined ){
            $location.path("/userProfile");
          }

    var self = this;
    self.website = "";

    if(transporter.get() !== undefined){
      self.website = transporter.get();
    }


      self.saveChanges = function(){
        $http({
          method : "POST",
          url : "includes/systemController.php",
          data : httpParamSerializerJQLike({form : "updateCompanyWebsite", organizerId : organizer,
                                              data : self.website})
        }).then(function(response){
          if(response.data.success){
            notifier.basic("Website updated Successfuly");
            $location.path("/userProfile");
          } else {
            console.log(response);
          }
        })
      }


}]);

app.controller("profileEditerController", ["$scope","$http", "$route", "$location", "$httpParamSerializerJQLike",
                                            "session", "notifier", "transporter",
                                            function($scope, $http, $route, $location, $httpParamSerializerJQLike,
                                            session, notifier, transporter){

        if($route.current.params.organizerId === undefined ||
          $route.current.params.organizationId === undefined ||
          transporter.get() === undefined) {
          $location.path("/userProfile");
        }

      var self = this;
      var organizer = $route.current.params.organizerId;
      var organization = $route.current.params.organizationId;

      self.user = transporter.get();


    self.saveChanges = function() {
        $http({
          method : "POST",
          url : "includes/systemController.php",
          data : $httpParamSerializerJQLike({form : "updateOrganizerInfo", organizerId : organizer , data : self.user })
        }).then(function(response){
                if(response.data.success) {
                  $location.path("/userProfile");
                  notifier.basic("Information updated Successfuly");
                }

        }, function(error){

        })


    };


    self.positions = [{abriv :"CEO", position : "Chefe Executive Officer" },
                      {abriv :"COO", position : "Chefe Executive Officer" },
                    {abriv :"CMO", position : "Chefe Executive Officer" }];
   self.prefixes = ["Mr.", "Mrs.", "Dr", "Pr","Ms."];


}]);

app.controller("addressEditerController", ["$scope", "$http", "$httpParamSerializerJQLike","$location",
                                            "$route", "notifier", "session", "transporter", "address",
                                          function($scope, $http, $httpParamSerializerJQLike, $location,
                                            $route, notifier, session, transporter, address){

      if($route.current.params.organizerId === undefined ||
      $route.current.params.organizerId != session.getUserId()){
        $location.path("/currentUser")
      };
      var self = this;
      var addressJson = {
        location : "",
        subCity : "",
        city : {
                  code : "",
                  name : ""
                },
        country : {
          code : "",
          name : ""
        }
      }

      var organizer = $route.current.params.organizerId;
      var organization = $route.current.params.organizationId;
self.address = [];
      if(transporter.get() === undefined){
        self.address = [];
      } else {
        self.address = transporter.get();
      }

      self.removed = [];

      self.countries = address.getCountries();
      self.cities = address.getCities();
      self.saveChanges = function(){

          $http({
            method : "POST",
            url : "includes/systemController.php",
            data : $httpParamSerializerJQLike({form : "updateCompanyAddress",
            organizerId : organizer, companyId : organization, data : JSON.stringify(self.address)})
          }).then(function(response){

              if(response.data.success){
                notifier.basic("address updated Successfuly");
                $location.path("/userProfile");
              } else {
                console.log(response.data.message);
              }
          }, function(error){

          });

      }
      self.addAddress = function(){
        self.address.push(addressJson);
      }
      self.deleteAddress = function(index) {
        self.removed.push(self.address.splice(index, 1));


      }
      self.undoRemove = function(){
        angular.forEach(self.removed, function(address){
          self.address.push(address);
        });
      }



}]);


app.controller("comanySocialEditerController", ["$scope", "$route", "$http", "$location", "$httpParamSerializerJQLike",
                                                "transporter", "session", "notifier",
                                              function($scope, $route, $http, $location, $httpParamSerializerJQLike,
                                              transporter, session, notifier){

          if($route.current.params.organizerId === undefined
            || $route.current.params.organizerId != session.getUserId()) {
              $location.path("/userProfile");
            }

      var self = this;
      var organizer = $route.current.params.organizerId;
      var removedsocials = [];
      var socialTemplate = {
        address : "",
        site : {name : "", icon : ""}
      };
      self.socialSites = [{
        name : "facebook",
        icon : "build"
      }, {
        name : "twitter",
        icon : "home"
      },
      {
        name : "youtube",
        icon : "person"
      }];

      self.addSocialAddress = function(){
        self.social.push(socialTemplate);
      }
      self.removeSocialAddress = function(index){
          removedsocials.push(index);
          self.social.splice(index, 1);
      }

      if(transporter.get() === undefined){
        self.social = [];
      } else {
        self.social = transporter.get();
      }


      self.saveChanges = function(){
        $http({
          method : "POST",
          url : "includes/systemController.php",
          data : $httpParamSerializerJQLike({
                  form : "updateSocialMedia", organizerId : organizer, data : JSON.stringify(self.social)})
        }).then(function(response){
          console.log(response);
          if(response.data.success) {
            notifier.basic("Social address updated Successfuly");
          } else {
            console.log(response);
          }

        }, function(error){
          console.log("error");
          console.log(error);
        })
      };

}]);


app.controller('signUpController', ["$scope", "$http", "$httpParamSerializerJQLike", "notifier", "session", "$mdDialog", "$route", "$location",
                            function($scope, $http, $httpParamSerializerJQLike, notifier, session, $mdDialog,$route, $location){

var action = $route.current.params.action;

console.log($route.current.params.action);

    var self = this;
    self.user = {
                    password: "",
                    email: "",
                    firstName : "",
                    lastName : "",
                    confirmationPassword : ""

                  };

      self.hide = function() {
        $mdDialog.hide();
      };
      self.cancel = function() {
        $mdDialog.cancel();
      };
      self.answer = function(answer) {
        $mdDialog.hide(answer);
      };
      self.Submit = function() {

        return $http({
                      method : "POST",
                      url : "includes/systemController.php",
                      data : $httpParamSerializerJQLike({form : "sign_up", user : self.user})
                })
                .then(function(response){

                          if(response.data.success) {
                            session.create(response.data.organizerId, self.user.firstName);

                            if(action == 'create') $location.path("/eventForm/id/"+session.getUserId());
                          }else {
                            notifier.basic(response.data.message);

                          }
                },function(){

                });

      }

}]);
//signup Controller End

//comment controller
app.controller("commentController", ["$scope","$http",
                                    function($scope, $http){

    var self = this;

    this.viewer = {
      fullName : "",
      comment : ""
    };

    this.postComment = function(){

    };


}]);
//event creation page Controller
app.controller('eventCtrl',["$scope", "$http", "address", "session", "eventCatagory",
                            "$httpParamSerializerJQLike", "$route", "$location",
                            function($scope, $http, address, session, eventCatagory,
                              $httpParamSerializerJQLike, $route,$location) {

                                $scope.$watch('eventImage.length',function(newVal,oldVal){
                                           console.log($scope.eventImage);
                                       });


          if($route.current.params.organizer != session.getUserId()) {
            $location.path("/");
          }
    var self = this;
    var organizer = session.getUserId();
    self.submitEvent = function() {
      console.log(self.event.eventImage);
      var formdata = new FormData();
/*
      angular.forEach(self.event, function(value, key){

          formdata.append(key, value);
            console.log(key+ "  "+value);

      });

      */
      angular.forEach(self.event.eventImage,function(obj){
                     if(!obj.isRemote){
                         formdata.append('eventImage', obj.lfFile);
                     }
                     });

       angular.forEach(self.event.eventGuests,function(obj){
                      if(obj.guestImage[0]){
                          formdata.append('guestImage[]', obj.guestImage[0].lfFile);
                      }
        });
      angular.forEach(self.event.eventSponsors,function(obj){
                     if(obj.sponsorImage[0]){
                         formdata.append('sponsorImage[]', obj.sponsorImage[0].lfFile);
                     }
              });

      formdata.append("form", "new_event");
      formdata.append("organizer", organizer);
      formdata.append("data", JSON.stringify(self.event));

        $http({
          method : "POST",
          url : "includes/systemController.php",
          data : formdata,
          headers : {"Content-Type" : undefined, "Process-Data" : false },
          transformRequest : angular.identity
        }).then(function(response){
          console.log(response);
        }, function(error){
          console.log(error);
        });



    }
    self.saleStartDefault = "";
    self.saleEndDefault = "";

    self.seeTime = function(t) {

      var d = new Date();
      d.setHours(t.substr(0, t.indexOf(":")));
      d.setMinutes(t.substr( t.indexOf(":")+1));
        d.setSeconds(0);


    };
    self.event = {
                  eventName : "",
                  eventDiscription : "",
                  catagory : "",
                  eventEndDate : "",
                  eventEndTime : "",
                  eventStartDate : new Date(),
                  eventStartTime : "",
                  eventImage : [],
                  address : { city : "",
                              country : "",
                              location : "",
                              subCity : "",
                              venueName : ""
                            },
                  eventTickets : [{
                                    type : "" ,
                                    ticketName : "",
                                    quantity : "",
                                    price : "",
                                    ticketDiscription : "",
                                    saleStart : "",
                                    saleEnd : "",
                                    showAdvanced : false
                                }],
                  eventGuests : [],
                  eventSponsors : []


                };

        self.addTicket = function() {
                          self.event.eventTickets.push({type : "" , ticketName : "", quantity : "",
                                    price : "", ticketDiscription : "",  saleStart : "", saleEnd : "", showAdvanced : false});
                        };
        self.removeTicket = function(index) {
                            self.event.eventTickets.splice(index, 1);
                        };
        self.addGuest = function() {

                        self.event.eventGuests.push({firstName : "", lastName : "", akaName : "", guestImage : [] } );

                      };
        self.removeGuest = function(index) {
                            self.event.eventGuest.splice(index, 1);
                        };
        self.addSponsor = function() {
                          self.event.eventSponsors.push({sponsorName : "", sponsorImage : []});
                        };
        self.removeSponsor = function(index) {
                          self.event.eventSponsors.splice(index, 1);
                        };


    self.minDate = new Date(
                            this.event.eventStartDate.getFullYear(),
                            this.event.eventStartDate.getMonth(),
                            this.event.eventStartDate.getDate()
                          );

    eventCatagory.catagories()
                              .then(function(catagory){
                                    self.catagories = catagory;
                                  });

    self.countries = address.getCountries();
    self.cities = address.getCities();

}]);
//event controller End
