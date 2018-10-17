angular.module("umbraco.resources").factory("stripeResources", function ($http) {
    var stripeService = {};
    stripeService.products = {};
    stripeService.plans = {};

    stripeService.fetchProducts = function () {
        return $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts");
    };

    stripeService.fetchPlans = function () {
        return $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans");
    };

    stripeService.getProducts = function () {
        if (stripeService.products.ready) return stripeService.products;
        stripeService.products.ready = false;
        stripeService.products.allProducts = [];

        stripeService.fetchProducts().then(function (res) {
            var data = res.data;
            for (var product in data) {
                if (data.hasOwnProperty(product)) {
                    stripeService.products.allProducts.push(data[product]);
                }
            }
        },
            function (res) {
                stripeService.products.error = res.data;
            }
        );
        stripeService.products.ready = true;
        return stripeService.products;
    };

    stripeService.getProducts();
    stripeService.getPlans = function () {
        if (stripeService.plans.ready) return stripeService.plans;

        stripeService.plans.ready = false;
        stripeService.plans.allPlans = [];

        stripeService.fetchPlans().then(function (res) {
            var data = res.data;
            for (var plan in data) {
                if (data.hasOwnProperty(plan)) {
                    var productName = stripeService.getProducts().allProducts.filter(prod => {
                        return prod.Id === data[plan].ProductId
                    })[0].Name;
                    data[plan].FullName = productName + ": " + data[plan].Name;
                    stripeService.plans.allPlans.push(data[plan]);
                }
            }
        },
            function (res) {
                stripeService.plans.error = res.data;
            }
        );
        stripeService.plans.ready = true;
        return stripeService.plans;
    };
    return stripeService;

});