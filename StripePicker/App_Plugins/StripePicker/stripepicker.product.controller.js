angular.module("umbraco").controller("stripepicker.product.controller", function ($scope, stripeResources) {

    $scope.ready = false;
    $scope.allProducts = [];

    stripeResources.getProducts().then(function (res) {
        var data = res.data;
        for (var product in data) {
            if (data.hasOwnProperty(product)) {
                $scope.allProducts.push(data[product]);
            }
        }
        $scope.ready = true;
    },
        function (res) {
            $scope.error = res.data;
            $scope.ready = true;
        }
    );
});