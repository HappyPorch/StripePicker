angular.module("umbraco.resources").factory("stripeResources", function ($http) {
    var stripeService = {};

    stripeService.getProducts = function () {
        return $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts");
    };

    stripeService.getPlans = function () {
        return $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans");
    };

    return stripeService;

});