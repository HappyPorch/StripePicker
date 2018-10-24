angular.module("umbraco").controller("stripepicker.sku.controller", function ($scope, stripeResources) {
    $scope.data = stripeResources.getSkus();
});