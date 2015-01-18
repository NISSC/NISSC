(function () {
    "use strict";

    var app;

    app = angular.module("app", ["ngRoute"]);

    app.config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(false).hashPrefix("!");
        $routeProvider.when("/introduction", {
            templateUrl: "partials/introduction.html"
        }).when("/about", {
            templateUrl: "partials/about.html"
        }).when("/continuous", {
            templateUrl: "partials/continuous-outcome.html",
            controller: "ContinuousOutcomeController"
        }).when("/binary", {
            templateUrl: "partials/binary-outcome.html",
            controller: "BinaryOutcomeController"
        }).when("/survival", {
            templateUrl: "partials/survival-outcome.html",
            controller: "SurvivalOutcomeController"
        }).otherwise({
            redirectTo: "/introduction"
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
                } else if (a === 0.01) {
                    return 2.326;
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
            },
            calculateForBinaryOutcome: function (a, b, k, pe, pc, d) {
                return Math.pow((b * Math.sqrt(((pe * (1 - pe)) / k) + (pc * (1 - pc))) + a * Math.sqrt(((pe * (1 - pe)) / k) + (pc * (1 - pc)))) / (pe - pc + d), 2);
            },
            calculateForSurvivalOutcome: function (a, b, prope, pe, pc, h, d) {
                return Math.pow(a + b, 2) / (Math.pow(Math.log(h) - Math.log(d), 2) * (1 - prope) * prope * ((1 - prope) * pc + prope * pe));
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
            $scope.totalSampleSize = $scope.controlGroupSampleSize + $scope.experimentalGroupSampleSize;
        };
    });

    app.controller("BinaryOutcomeController", function ($scope, Calculator) {
        $scope.calculate = function (values) {
            var a, b, k, ee, ec,  d;
            a = Calculator.standardizeSignificanceLevel(parseFloat(values.significanceLevel));
            b = Calculator.standardizePower(parseFloat(values.power));
            k = parseFloat(values.allocationRatio);
            ee = parseFloat(values.eventRateExperimentalGroup);
            ec = parseFloat(values.eventRateControlGroup);
            d = parseFloat(values.niMargin);
            $scope.controlGroupSampleSize = Calculator.calculateForBinaryOutcome(a, b, k, ee, ec, d);
            $scope.experimentalGroupSampleSize = $scope.controlGroupSampleSize * k;
            $scope.totalSampleSize = $scope.controlGroupSampleSize + $scope.experimentalGroupSampleSize;
        };
    });

    app.controller("SurvivalOutcomeController", function ($scope, Calculator) {
        $scope.calculate = function (values) {
            var a, b, prope, pe, pc, h, d;
            a = Calculator.standardizeSignificanceLevel(parseFloat(values.significanceLevel));
            b = Calculator.standardizePower(parseFloat(values.power));
            prope = parseFloat(values.propExperimentalGroup);
            pe = parseFloat(values.probEventExperimentalGroup);
            pc = parseFloat(values.probEventControlGroup);
            h = parseFloat(values.hazardRatio);
            d = parseFloat(values.niMargin);
            $scope.totalSampleSize = Calculator.calculateForSurvivalOutcome(a, b, prope, pe, pc, h, d);
            $scope.experimentalGroupSampleSize = $scope.totalSampleSize * prope;
            $scope.controlGroupSampleSize = $scope.totalSampleSize * (1 - prope);
            $scope.expectedEvents = $scope.totalSampleSize * ((1 - prope) * pc + prope * pe);
        };
    });

    app.controller("NavigationController", function ($scope, $location) {
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    });

 // Collapse menu when link is pressed.
    $(document).on("click", ".navbar-collapse.in", function (e) {
        if ($(e.target).is("a")) {
            $(this).collapse("hide");
        }
    });

}());
