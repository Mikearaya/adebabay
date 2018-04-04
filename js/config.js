//configuring default header for post request
app.config(["$httpProvider"  , function ($httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    $httpProvider.useApplyAsync(true);

}]);
//post request header config end

//configure default app theme
app.config(["$mdThemingProvider", function($mdThemingProvider) {

  var customBlueMap = $mdThemingProvider.definePalette('amazingPaletteName', {
                           '50': 'ffebee',
                           '100': 'ffcdd2',
                           '200': 'ef9a9a',
                           '300': 'e57373',
                           '400': 'ef5350',
                           '500': 'f44336',
                           '600': 'e53935',
                           '700': 'd32f2f',
                           '800': 'c62828',
                           '900': 'b71c1c',
                           'A100': 'ff8a80',
                           'A200': 'ff5252',
                           'A400': 'ff1744',
                           'A700': 'd50000',
                           'contrastDefaultColor': 'dark',    // whether, by default, text (contrast)
                                                               // on this palette should be dark or light

                           'contrastDarkColors': ['50', '100', //hues which contrast should be 'dark' by default
                            '200', '300', '400', 'A100'],
                           'contrastLightColors': "light"    // could also specify this if default was 'dark'
                         });

/*
    $mdThemingProvider.definePalette('amazingPaletteName', customBlueMap);
    $mdThemingProvider.theme('default')
                      .primaryPalette('blue', {
                                                      'default': '400',
                                                      'hue-1': '100',
                                                      'hue-2': '600',
                                                      'hue-3': 'A100'
                    })
                      .accentPalette('pink')
                      .backgroundPalette('blue', {
                                                      'default': '50',
                                                      'hue-1': '100',
                                                      'hue-2': '600',
                                                      'hue-3': 'A100'
                    });

    $mdThemingProvider.theme('input', 'default')
                      .primaryPalette('grey');

    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
    $mdThemingProvider.theme('dark-green').backgroundPalette('green').dark();
    $mdThemingProvider.theme('dark-yellow').backgroundPalette('yellow').dark();
*/


$mdThemingProvider.enableBrowserColor({
  theme : "default",
  palette : "primary",
  hue : "200"

});


      $mdThemingProvider.theme('default')
                        .primaryPalette('blue', {
                                                'default': '900',
                                                'hue-1': '100',
                                                'hue-2': '500',
                                                'hue-3': '600'
                        })
                        .accentPalette('deep-purple', {
                                                        'default' : '500',
                                                         'hue-1' :'300',
                                                         'hue-2' : "600",
                                                         "hue-3" : "A700"
                       })
                        .warnPalette('red', {
                                            'default' : '500',
                                             'hue-1' :'100',
                                             'hue-2' : "400",
                                             "hue-3" : "800"
                       })
                        .backgroundPalette("grey", {
                                                    'default': '100',
                                                    'hue-1': '50',
                                                    'hue-2': '400',
                                                    'hue-3': '900'
                      });

}]);
//default theme config end

//application routing configuration
app.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

    $locationProvider.hashPrefix('');
    $routeProvider.caseInsensitiveMatch = true;

    $routeProvider.when('/', {templateUrl: "templates/home.html"})
                  .when('/signUp/:action', { templateUrl: 'templates/signUp.html' })
                  .when('/eventManager/:action/:eventId/:organizerId', { templateUrl: 'templates/eventManagment.html' })
                  .when('/updateEvent/schedule/:eventId/:organizerId', { templateUrl: 'templates/eventScheduleUpdater.html' })
                  .when('/updateEvent/general/:eventId/:organizerId', { templateUrl: 'templates/eventGeneralUpdater.html' })
                  .when('/updateEvent/ticket/:eventId/:organizerId', { templateUrl: 'templates/eventTicketUpdater.html' })
                  .when('/updateEvent/discription/:eventId/:organizerId', { templateUrl: 'templates/eventDiscriptionUpdater.html' })
                  .when('/updateEvent/guest/:eventId/:organizerId', { templateUrl: 'templates/eventGuestUpdater.html' })
                  .when('/updateEvent/sponsor/:eventId/:organizerId', { templateUrl: 'templates/eventSponsorUpdater.html' })
                  .when('/myEvents/:organizerId', { templateUrl: 'templates/userEvents.html' })
                  .when('/editCompany/website/:organizerId', { templateUrl: 'templates/companyWebsiteEdit.html' })
                  .when('/editCompany/email/:organizerId', { templateUrl: 'templates/companyEmailEdit.html' })
                  .when('/editCompany/social/:organizerId', { templateUrl: 'templates/companySocialEdit.html' })
                  .when('/editCompany/profile/:organizerId', { templateUrl: 'templates/companyProfileUpdater.html' })
                  .when('/editCompany/address/:organizerId/:organizationId', { templateUrl: 'templates/addressEditer.html' })
                  .when('/editCompany/myprofile/:organizerId/:organizationId', { templateUrl: 'templates/userProfileEditer.html' })
                  .when('/editCompany/phone/:organizerId/:organizationId', { templateUrl: 'templates/organizerPhone.html' })
                  .when('/editCompany/discription/:organizerId/:organizationId', { templateUrl: 'templates/companyDiscriptionUpdater.html' })
                  .when('/logIn', { templateUrl : 'templates/logIn.html' })
                  .when('/events/id/:catagoryId/catagory/:catagoryName', {templateUrl : 'templates/events.html' })
                  .when('/userProfile', { templateUrl: 'templates/userProfile.html' })
                  .when('/editCompany/myBio/:organizerId/:organizationId', { templateUrl: 'templates/organizerBioUpdater.html' })
                  .when('/eventForm/id/:organizer/', {templateUrl : 'templates/eventForm.html' })
                  .when('/eventDetail/:eventId/', {templateUrl : 'templates/eventDetail.html' })
                  .when('/orderForm/event/:eventId/checkout/', {templateUrl : "templates/orderForm.html"})
                  .otherwise({templateUrl : "templates/home.html"});

}]);
//routing configuration end
