


//session Service
app.factory("session", ["$http", "notifier", function($http, notifier){

      var userName = "";
      var userId = "";
      var loged_in = false;

      function createSession(id, name) {

        userName = name;
        userId = id;
        loged_in = true;
        notifier.basic("Welcome "+ userName);
      };

      function getUserName() {
        return userName;
      }
      function getUserId() {
        return userId;
      }

      function destroySession() {
        notifier.basic("Good By "+ userName);
        loged_in = false;
        userName = "";
        userId = "";

        $http({
          method : "GET",
          url : "includes/systemController.php",
          params : {get : "closeSession"}
        }).then(function(response){ });

      };

      function isLoggedIn() {
        return loged_in;
      };

      function refresh() {
         $http({
          method : "GET",
          url : "includes/systemController.php",
          params : {get : "isSessionActive"}
        }).then(function(response){

          if(loged_in = response.data.active) {
            userName = response.data.organizerName;
            userId = response.data.organizerId;
          }

        });

      }

    loged_in = refresh();


  return {
          create : createSession,
          destroy : destroySession,
          isLoggedIn : isLoggedIn,
          getUserName : getUserName,
          getUserId : getUserId
        };

}]);
//session provier end

//service used to pass data between controllers
app.factory("transporter" , function(){

    var data = undefined;

      function set(transport){
          data = transport;
      };

      function get() {
        return data;
      };

  return {
      set : set,
      get : get
  };

});
//transporter service end

//service to provide shareing of events to other sites
app.factory('shareService',["$http", function($http){

    var shareData = {
                      id : "",
                      name : "",
                      image : "",
                      discription : ""
                    };

      function prepare(eventId, eventName, discription, image) {
          shareData.id = eventId;
          shareData.name = eventName;
          shareData.image = image;
          shareData.discription = discription;
      };

      function shareOnFacebook(){

      };

      function shareOnTwitter(){

      };

  return {
    prepare : prepare,
    facebook : shareOnFacebook,
    twitter : shareOnTwitter
  };


}]);
//shareService service end

//service theat return available and all event catagories
app.factory('eventCatagory',["$http", "$q",
                            function($http, $q){

      function availableEventCatagories(){

        return $q(function(resolve, reject){

                  $http({
                          method : 'GET',
                          url : "includes/systemController.php",
                          params : {get : "eventCatagory" }
                        })
                        .then(function onSuccess(response){
                              resolve(response.data);
                        }, function onError(error){
                            reject(error);
                        });
                      });
      };

      function catagories(){
        return $q(function(resolve, reject){

                  $http({
                    method : 'GET',
                    url : "includes/systemController.php",
                    params : {get : "catagory" }
                  })
                  .then(function onSuccess(response){
                        resolve(response.data);
                  }, function onError(error){
                      reject(error);
                  });
                });
      };


  return {
    availableEventCatagories : availableEventCatagories,
    catagories : catagories
  };

}]);
//eventCatagories Service end

//imageLocator used to determine if image exists
// if it does return it's proper location
app.factory("imageLocator", function(){

    var guestImageLocation = "uploads/eventImages/eventGuests/";
    var sponsorImageLocation = "uploads/eventImages/eventSponsors/";
    var eventImageLocation = "uploads/eventImages/";
    var guestImageLocation = "uploads/eventImages/eventGuests/";
    var defaultPlaceholder = "img/placeholder2.jpg";

      function getEventImage(value) {
          var image = "";
            if(value == "null" || !value || value == "false" ) {
                          image = defaultPlaceholder;
            } else {
              image = eventImageLocation+''+value;


            }
        return image;
      };

      function getGuestImage(value) {
          var image = "";
          if(value == "null" || !value || value == "false" ) {
              image = defaultPlaceholder;
          } else {
                  image = guestImageLocation+''+value;

            }
        return image;
      };

      function getSponsorImage(value) {
          var image = "";
            if(value == "null" || !value || value == "false" ) {
                image = defaultPlaceholder;
            } else {
                  image = sponsorImageLocation+''+value;
            }
        return image;
      };

      return {
        sponsor : getSponsorImage,
        guest : getGuestImage,
        poster : getEventImage
      };

});
//imageProcessor service end



app.factory("address", function() {

      function countries(){
        return [
                {"name": "Bosnia and Herzegovina", "code": "BA"},
                {"name": "Botswana", "code": "BW"},
                {"name": "Bouvet Island", "code": "BV"},
                {"name": "Czech Republic", "code": "CZ"},
                {"name": "Denmark", "code": "DK"},
                {"name": "Djibouti", "code": "DJ"},
                {"name": "Dominica", "code": "DM"},
                {"name": "Dominican Republic", "code": "DO"},
                {"name": "Ecuador", "code": "EC"},
                {"name": "Egypt", "code": "EG"},
                {"name": "El Salvador", "code": "SV"},
                {"name": "Equatorial Guinea", "code": "GQ"},
                {"name": "Eritrea", "code": "ER"},
                {"name": "Estonia", "code": "EE"},
                {"name": "Ethiopia", "code": "ET"},
                {"name": "Falkland Islands (Malvinas)", "code": "FK"},
                {"name": "Faroe Islands", "code": "FO"},
                {"name": "Fiji", "code": "FJ"},
                {"name": "Finland", "code": "FI"},
                {"name": "France", "code": "FR"},
                {"name": "French Guiana", "code": "GF"},
                {"name": "French Polynesia", "code": "PF"},
                {"name": "French Southern Territories", "code": "TF"},
                {"name": "Gabon", "code": "GA"},
                {"name": "Gambia", "code": "GM"},
                {"name": "Georgia", "code": "GE"},
                {"name": "Germany", "code": "DE"},
                {"name": "Ghana", "code": "GH"},
                {"name": "Gibraltar", "code": "GI"},
                {"name": "Greece", "code": "GR"},
                {"name": "United Arab Emirates", "code": "AE"},
                {"name": "United Kingdom", "code": "GB"},
                {"name": "United States", "code": "US"},
                {"name": "United States Minor Outlying Islands", "code": "UM"},
                {"name": "Uruguay", "code": "UY"},
                {"name": "Uzbekistan", "code": "UZ"},
                {"name": "Vanuatu", "code": "VU"},
                {"name": "Venezuela", "code": "VE"},
                {"name": "Viet Nam", "code": "VN"},
                {"name": "Virgin Islands, British", "code": "VG"},
                {"name": "Virgin Islands, U.S.", "code": "VI"},
                {"name": "Wallis and Futuna", "code": "WF"},
                {"name": "Western Sahara", "code": "EH"},
                {"name": "Yemen", "code": "YE"},
                {"name": "Zambia", "code": "ZM"},
                {"name": "Zimbabwe", "code": "ZW"}
              ];
      };

      function cities() {
        return ["Addis Ababa", "Nairobi", "Cartum", "Mokadisho"];
      };


  return {
      getCountries : countries,
      getCities : cities
  };

});


//service used to display notification message using toast
app.factory("notifier",["$mdToast", function($mdToast) {

    var notice = "";

      function basicNotice(message){
        notice = message;
          $mdToast.show(
                        $mdToast.simple()
                                .textContent(notice)
                                .position("top right")
                                .hideDelay(5000)
                  );
      };


  return {
          basic : basicNotice
  };

}]);
//notifier service end
