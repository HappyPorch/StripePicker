angular.module("umbraco.resources").factory("stripeResources", function ($http) {
    var stripeService = {};
    stripeService.products = {};
    stripeService.products.ready = false;
    stripeService.products.allProducts = [];

    stripeService.plans = {};
    stripeService.plans.ready = false;
    stripeService.plans.allPlans = [];

    stripeService.fetchProducts = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts");

    stripeService.fetchPlans = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans");

    async function getProducts() {
        if (stripeService.products.ready) return stripeService.products;

        var res;
        try {
            res = await stripeService.fetchProducts;
            var data = res.data;
            for (var product in data) {
                if (data.hasOwnProperty(product)) {
                    stripeService.products.allProducts.push(data[product]);
                }
            }
        }
        catch (error) {
            stripeService.products.error = error;
        }

        stripeService.products.ready = true;
        return stripeService.products;
    }
    stripeService.getProductsCache = getProducts();

    stripeService.getProducts = async () => {
        return stripeService.getProductsCache;
    };

    stripeService.getPlans = async () => {
        if (stripeService.plans.ready) return stripeService.plans;

        var products = await stripeService.getProducts();
        
        var res;
        try {
            res = await stripeService.fetchPlans;
            var data = res.data;
            for (var plan in data) {
                if (data.hasOwnProperty(plan)) {
                    var productName = products.allProducts.filter(prod => {
                        return prod.Id === data[plan].ProductId
                    })[0].Name;
                    data[plan].FullName = productName + ": " + data[plan].Name;
                    stripeService.plans.allPlans.push(data[plan]);
                }
            }
        }
        catch (error) {
            stripeService.plans.error = res.data;
        }

        stripeService.plans.ready = true;
        return stripeService.plans;
    };
    return stripeService;

});