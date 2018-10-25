angular.module("umbraco.resources").factory("stripeResources", function ($http) {
    var stripeService = {};
    stripeService.products = {};
    stripeService.products.ready = false;
    stripeService.products.allProducts = [];

    stripeService.plans = {};
    stripeService.plans.ready = false;
    stripeService.plans.allPlans = [];

    stripeService.skus = {};
    stripeService.skus.ready = false;
    stripeService.skus.allSkus = [];

    stripeService.fetchProducts = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts");

    stripeService.fetchPlans = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans");

    stripeService.fetchSkus = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetSkus");

    function subscriptionProducts(p) {
        return p.Type === "service";
    }

    function getCurrencySign(currency) {
        switch (currency) {
            case "gbp":
                return "£";
            case "usd":
                return "$";
            case "eur":
                return "€";
            default:
                return currency;
        }
    }

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
            stripeService.products.allSubscriptionProducts = stripeService.products.allProducts.filter(subscriptionProducts);
        }
        catch (error) {
            stripeService.products.error = error.data.ExceptionMessage;
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
                        return prod.Id === data[plan].ProductId;
                    })[0].Name;
                    var currencySign = getCurrencySign(data[plan].Currency);
                    data[plan].FullName = productName + ": " + data[plan].Name + " (" + currencySign
                        + "" + data[plan].Amount/100 + "/" + data[plan].Interval + ")";
                    stripeService.plans.allPlans.push(data[plan]);
                }
            }
        }
        catch (error) {
            stripeService.plans.error = error.data.ExceptionMessage;
        }

        stripeService.plans.ready = true;
        return stripeService.plans;
    };

    stripeService.getSkus = async () => {
        if (stripeService.skus.ready) return stripeService.skus;

        var skus = await stripeService.getProducts();

        var res;
        try {
            res = await stripeService.fetchSkus;
            var data = res.data;
            for (var sku in data) {
                if (data.hasOwnProperty(sku)) {
                    var productName = skus.allProducts.filter(prod => {
                        return prod.Id === data[sku].ProductId;
                    })[0].Name;
                    var currencySign = getCurrencySign(data[sku].Currency);
                    data[sku].FullName = productName + " (" + currencySign + "" + data[sku].Price/100 + ")";
                    stripeService.skus.allSkus.push(data[sku]);
                }
            }
        }
        catch (error) {
            stripeService.skus.error = error.data.ExceptionMessage;
        }
        stripeService.skus.ready = true;
        return stripeService.skus;
    };

    return stripeService;

});