angular.module('kittyApp')
    .controller('masterController', function($scope, $rootScope, $firebaseArray, $firebaseObject, fbService, fb) {


        //Gets all the users in the firebase service
        fbService.getAllUsers().then(function(response) {
            $rootScope.users = response;
        });

        fbService.getShop().then(function(response) {
            $rootScope.shop = response;
        });

          $('.userloggedin').hide();

        var fbRef = new Firebase(fb.url);

        var shopRef = fbRef.child("shop");

        $scope.gitHubLogin = function() {
            fbRef.authWithOAuthPopup("github", function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $rootScope.gitHubUid = authData.github.id;
                    $rootScope.userData = authData.github;
                    $(".loader").fadeOut("slow");
                    // $rootScope.createUser($rootScope.gitHubUid);

                    $scope.user = $firebaseObject(new Firebase(fb.url + "user/" + $rootScope.gitHubUid));
                    $scope.$apply();
                    $rootScope.currentCoins = parseInt($scope.user.coins);
                    console.log($scope.user.coins);

                    setTimeout(function () {
                      $('.userloggedin').slideDown('slow');
                    }, 200);

                    setTimeout(function () {
                      $('.userloggedin').slideUp('slow');
                    }, 5000);
                }
            });
        };


        $rootScope.id = 0;

        $rootScope.createUser = function(uid) {

            fbRef.child("user").child(uid).set({
                coins: 0,
                inventory: ['null'],
                uid: uid
            });
        };

        $rootScope.addShopItem = function() {

            fbRef.child("shop").child("laserpointer").set({
                name: 'Laser Pointer',
                price: 1000,
                type: 'toy',
                img: 'https://www.iconexperience.com/_img/g_collection_png/standard/512x512/laser_pointer.png',
                increase: 75
            });
        };

        $rootScope.addCoins = function(numCoins) {
            $scope.user.coins = $rootScope.currentCoins + numCoins; //test 3 way binding?wait
            $scope.user.$save();
            $rootScope.currentCoins = parseInt($scope.user.coins);
        };

        $rootScope.removeCoins = function(numCoins) {
          $scope.user.coins = $rootScope.currentCoins - numCoins; //test 3 way binding?wait
          $scope.user.$save();
          $rootScope.currentCoins = parseInt($scope.user.coins);
        };

        // setInterval(function(){
        //   console.log($scope.user, "hit");
        // },1000);

        //   var auth = $firebaseAuth(ref);
        // // login with Facebook
        // auth.$authWithOAuthPopup("facebook").then(function(authData) {
        //   console.log("Logged in as:", authData.uid);
        // }).catch(function(error) {
        //   console.log("Authentication failed:", error);
        // });

    });
