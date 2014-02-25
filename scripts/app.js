(function () {
    "use strict";

    var app;

    app = angular.module("app", ["ngRoute"]);

    app.config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(false).hashPrefix("!");
        $routeProvider.when("/continuous", {
            templateUrl: "partials/continuous-outcome.html",
            controller: "ContinuousOutcomeController"
        }).when("/binary", {
            templateUrl: "partials/binary-outcome.html",
            controller: "BinaryOutcomeController"
        }).when("/survival", {
            templateUrl: "partials/survival-outcome.html",
            controller: "SurvivalOutcomeController"
        }).otherwise({
            redirectTo: "/continuous"
        });
    });

    app.factory("Calculator", function () {
        return {
            standardizeSignificanceLevel: function (a) {
                if (a === 0.1) {
                    return 1.282;
                } else if (a === 0.05) {
                    return 1.645;
                } else if (a === 0.025) {
                    return 1.96;
                } else if (a === 0.005) {
                    return 2.576;
                } else {
                    throw new Error("Argument invalid.");
                }
            },
            standardizePower: function (b) {
                if (b === 0.8) {
                    return 0.842;
                } else if (b === 0.85) {
                    return 1.036;
                } else if (b === 0.9) {
                    return 1.282;
                } else if (b === 0.95) {
                    return 1.645;
                } else {
                    throw new Error("Argument invalid.");
                }
            },
            calculateForContinuousOutcome: function (a, b, k, me, mc, sd, d) {
                return (1 + (1 / k)) * Math.pow(a + b, 2) * Math.pow(sd / (me - mc - d), 2);
            }
        };
    });

    app.controller("ContinuousOutcomeController", function ($scope, Calculator) {
        $scope.calculate = function (values) {
            var a, b, k, me, mc, sd, d;
            a = Calculator.standardizeSignificanceLevel(parseFloat(values.significanceLevel));
            b = Calculator.standardizePower(parseFloat(values.power));
            k = parseFloat(values.allocationRatio);
            me = parseFloat(values.meanExperimentalGroup);
            mc = parseFloat(values.meanControlGroup);
            sd = parseFloat(values.commonStandardDeviation);
            d = parseFloat(values.niMargin);
            $scope.controlGroupSampleSize = Calculator.calculateForContinuousOutcome(a, b, k, me, mc, sd, d);
            $scope.experimentalGroupSampleSize = $scope.controlGroupSampleSize * k;
        };
    });

    app.controller("BinaryOutcomeController", function ($scope) {
    });

    app.controller("SurvivalOutcomeController", function ($scope) {
    });

}());
