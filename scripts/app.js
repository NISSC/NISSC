(function () {
    "use strict";

    var app;

    app = angular.module("app", ["ngRoute"]);

    app.config(function ($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
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

    app.controller("ContinuousOutcomeController", function ($scope) {
    });

    app.controller("BinaryOutcomeController", function ($scope) {
    });

    app.controller("SurvivalOutcomeController", function ($scope) {
    });

}());
