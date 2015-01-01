
var app = angular.module('app', [
	// Angular modules 

	'ng', 'ngRoute', 'ngSanitize'

	// Custom modules 

	// 3rd Party Modules
	, 'kendo.directives'
]);

app.service('ProductsService', ['$http', function ($http) {
	this.getNorthwindProducts = function (skip, top) {
		var _url = 'http://services.odata.org/northwind/northwind.svc/Products?$skip=' + skip + '&$top=' + top //+ '&$orderby=UnitPrice';
		console.log(_url);
		return $http({
			method: 'GET',
			url: _url
		});
	};
}]);

app.controller('spaController', ['$scope', '$location', function ($scope, $location) {
	$scope.title = 'spaController';
}]);

app.controller('ProductsController', ['$scope', 'ProductsService', function ($scope, service) {
	$scope.title = 'ProductsController';
	$scope.northwindProcuts = [];
	$scope.pageSize = 5;
	$scope.pageIndex = 0;
	$scope.reverse = undefined;
	$scope.loadingProducts = false;

	$scope.prevPage = function () {
		if ($scope.pageIndex > 1) {
			$scope.pageIndex--;
			$scope.getProducts();
		}
	};

	$scope.nextPage = function () {
		if ($scope.northwindProcuts.length === $scope.pageSize) {
			$scope.pageIndex++;
			$scope.getProducts();
		}
	};

	$scope.getProducts = function () {
		if ($scope.pageIndex == 0)
			$scope.pageIndex = 1;
		var tempSkip = ($scope.pageIndex - 1) * $scope.pageSize;
		console.log('skip : ', tempSkip, ' top : ', $scope.pageSize);
		$scope.northwindProcuts = [];
		$scope.loadingProducts = true;
		service.getNorthwindProducts(tempSkip, $scope.pageSize).success(function (data, status) {
			console.log('data received with success');
			$scope.northwindProcuts = data.value;
			$scope.loadingProducts = false;
		}).error(function (data, status) {
			console.log('error getting products from odata service');
			console.log(data);
			$scope.loadingProducts = false;
		});
	};

	$scope.clearProducts = function () {
		$scope.northwindProcuts = [];
		$scope.pageSize = 10;
		$scope.pageIndex = 1;
		$scope.filterRecords = false;
	};

	$scope.toggleFilterVisibility = function () {
		$scope.filterRecords = !$scope.filterRecords;
		$scope.search = {};
	};

	$scope.sort = function (fieldName, order) {
		if (fieldName == undefined)
			return;
		$scope.predicate = fieldName;
		if ($scope.reverse === undefined)
			$scope.reverse = false;
		if (order === undefined)
			$scope.reverse = !$scope.reverse;
		else
			$scope.reverse = order;
		console.log('Sorting by : ', fieldName, ' order : ', $scope.reverse);
	}
}]);

app.controller('CustomersController', ['$scope', '$location', function ($scope, $location) {
	$scope.title = 'CustomersController';
}]);

// routing

app.config(['$routeProvider', '$locationProvider',
	function ($routeProvider, $locationProvider) {
		//$locationProvider.html5Mode(true);

		// default
		$routeProvider
			.when('/', {
				templateUrl: '/Scripts/App/Views/Products/ProductsIndex.html',
				controller: 'ProductsController'
			})

			.when('/Customers', {
				templateUrl: '/Scripts/App/Views/Customers/CustomerIndex.html',
				controller: 'CustomersController'
			})

		.when('/About', {
			templateUrl: '/Scripts/App/Views/About/AboutIndex.html'
		})

		//.when(spaBaseUrl + 'ConnectionMethod/AddTo/:consumerTypeId/:consumerId', {
		//	templateUrl: '/Scripts/App/Views/ConnectionMethod/Create.html',
		//	controller: 'connectionMethodController'
		//})

		//.otherwise({
		//	redirectTo: '/'
		//});
	}
]);

// application wide filter

app.filter("asDate", function () {
	return function (input) {
		return new Date(input);
	};
});

app.value('$', $);