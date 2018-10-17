angular.module("umbraco").controller("stripepicker.plan.controller", function ($scope, stripeResources) {
    $scope.data = stripeResources.getPlans();
});