angular.module("umbraco").controller("stripepicker.plan.controller", function ($scope, stripeResources) {

    $scope.ready = false;
    $scope.allPlans = [];

    stripeResources.getPlans().then(function (res) {
        var data = res.data;
        for (var plan in data) {
            if (data.hasOwnProperty(plan)) {
                $scope.allPlans.push(data[plan]);
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