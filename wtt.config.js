'use strict';

angular.module('wtt', ['core'])
.config(function ($stateProvider) {
	$stateProvider
	.state('wtt', {
		url: '/wtt',
		templateUrl: 'app/wtt/list.html',
		controller: 'WttListCtrl',
		authenticate: true
	});
});
