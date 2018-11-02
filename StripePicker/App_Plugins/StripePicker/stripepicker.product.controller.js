angular.module("umbraco").controller("stripepicker.product.controller", function ($scope, stripeResources) {
    //$scope.data = stripeResources.getProducts();

    stripeResources.getProducts().then(function (data) {
        $scope.data = data;
    });
});