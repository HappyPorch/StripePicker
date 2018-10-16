angular.module("umbraco").controller("stripepicker.controller", function ($scope, stripeResource) {

    $scope.allProducts = [];

    // Use stripeResource service to call surface controller
    // Once the data is returned create array of products (allProducts)
    // Each product will contain several properties
    stripeResource.getProducts().then(function (res) {
        var data = res.data;
        for (var product in data) {
            if (data.hasOwnProperty(product)) {
                $scope.allProducts.push([product, data[product]]);
            }
        }
    });

});

angular.module("umbraco.resources").factory("stripeResource", function ($http) {
    var stripeService = {};

    // Service makes an ajax call to 
    // umbraco surface controller and returns the result
    stripeService.getProducts = function () {
        return $http.get("/umbraco/StripePicker/GetProducts");
    };

    stripeService.getPlans = function () {
        return $http.get("/umbraco/StripePicker/GetPlans");
    };

    return stripeService;

});