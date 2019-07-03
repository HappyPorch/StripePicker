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

    stripeService.coupons = {};
    stripeService.coupons.ready = false;
    stripeService.coupons.allCoupons = [];

    stripeService.taxRates = {};
    stripeService.taxRates.ready = false;
    stripeService.taxRates.allTaxRates = [];

    stripeService.fetchProducts = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetProducts");

    stripeService.fetchPlans = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetPlans");

    stripeService.fetchSkus = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetSkus");

    stripeService.fetchCoupons = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetCoupons");

    stripeService.fetchTaxRates = $http.get("/umbraco/backoffice/StripePickerPlugin/StripePicker/GetTaxRates");

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
            stripeService.products.allProducts = stripeService.products.allProducts.sort(function (a, b) {
                var x = a.Name.toLowerCase();
                var y = b.Name.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
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
            stripeService.plans.allPlans = stripeService.plans.allPlans.sort(function (a, b) {
                var x = a.FullName.toLowerCase();
                var y = b.FullName.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
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
            stripeService.skus.allSkus = stripeService.skus.allSkus.sort(function (a, b) {
                var x = a.FullName.toLowerCase();
                var y = b.FullName.toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            });
        }
        catch (error) {
            stripeService.skus.error = error.data.ExceptionMessage;
        }
        stripeService.skus.ready = true;
        return stripeService.skus;
    };

    stripeService.getCoupons = async () => {
        if (stripeService.coupons.ready) return stripeService.coupons;

        var res;
        try {
            res = await stripeService.fetchCoupons;
            var data = res.data;
            for (var coupon in data) {
                if (data.hasOwnProperty(coupon)) {
                    stripeService.coupons.allCoupons.push(data[coupon]);
                }
            }
            stripeService.coupons.allCoupons = stripeService.coupons.allCoupons.sort(function (a, b) {
                var x = a.Name !== undefined ? a.Name.toLowerCase() : '';
                var y = b.Name !== undefined ? b.Name.toLowerCase() : '';
                return x < y ? -1 : x > y ? 1 : 0;
            });
        }
        catch (error) {
            stripeService.coupons.error = error.data.ExceptionMessage;
        }
        stripeService.coupons.ready = true;
        return stripeService.coupons;
    };

    stripeService.getTaxRates = async () => {
        if (stripeService.taxRates.ready)
            return stripeService.taxRates;

        var res;

        try {
            res = await stripeService.fetchTaxRates;
            var data = res.data;

            for (var taxRate in data) {
                if (data.hasOwnProperty(taxRate)) {
                    data[taxRate].UmbDisplayName = data[taxRate].Description + " - " + data[taxRate].DisplayName + " (" + data[taxRate].Percentage + "%)";
                    stripeService.taxRates.allTaxRates.push(data[taxRate]);
                }
            }
        }
        catch (err) {
            stripeService.taxRates.error = error.data.ExceptionMessage;
        }

        stripeService.taxRates.ready = true;

        return stripeService.taxRates;
    };

    return stripeService;
});