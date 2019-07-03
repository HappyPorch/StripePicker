angular.module("umbraco").controller("stripepicker.taxrate.controller", function ($scope, stripeResources) {
    $scope.data = stripeResources.getTaxRates();
});