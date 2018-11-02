angular.module("umbraco").controller("stripepicker.coupon.controller", function ($scope, stripeResources) {
    $scope.data = stripeResources.getCoupons();
});