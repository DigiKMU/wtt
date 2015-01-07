'use strict';

angular.module('wtt')
.controller('WttListCtrl', function ($scope, $log, $http, uiGridConstants, $translate, $translatePartialLoader, AppConfig, cfg) {
	AppConfig.setCurrentApp('WTT', 'fa-clock-o', 'wtt', 'app/wtt/menu.html');
	$translatePartialLoader.addPart('wtt');

	$scope.msg = {};

	$scope.gridOptions = {
		minRowsToShow: 20,
		enableSorting: true,
		enableFiltering: true,
		enableHiding: true,
		enableColumnMenus: true,
		enableGridMenu: true,
		// pagingPageSizes: [25, 50, 75],
		// pagingPageSize: 25,
		enableCellEdit: true,
		enableSelectAll: true,
		// csv export -> not working, default 'download.csv' is taken
		// exporterCsvFilename: 'wtt.csv',

		columnDefs: [
			{ 	name: 'datum', field: 'datum', displayName: 'Date', visible: true, width: '*', 
				sort: { direction: uiGridConstants.ASC }}, 
			{ 	name: 'from', field: 'from', visible: true, width: '*' },
			{ 	name: 'to', field: 'to', visible: true, width: '*' },
			{ 	name: 'typ', field: 'ptype', displayName: 'Type', visible: true, width: '*', 
				editDropdownFilter: 'translate', cellFilter: 'translate',
				editableCellTemplate: 'ui-grid/dropdownEditor', 
				editDropdownOptionsArray: [
					{ id: 1, value: 'PTBirthday'},
					{ id: 2, value: 'PTXmas'},
					{ id: 3, value: 'PTOstern'},
					{ id: 4, value: 'PTMatur'},
					{ id: 5, value: 'PTKonfirmation'},
					{ id: 6, value: 'PTHochzeit'},
					{ id: 7, value: 'PTOther'}
				]
			},
			{ name: 'comment', field: 'comment', enableSorting: false, visible: true, width: '*', minWidth: 20 }
		],
		exporterCsvLinkElement: angular.element(document.querySelectorAll('.custom-csv-link-location')),

		onRegisterApi: function(gridApi) {
			$scope.gridApi = gridApi;
			gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
				$scope.msg.lastCellEdited = 'edited row id: ' + rowEntity.id + ' Column: ' + colDef.name + ' newValue: ' + newValue + ' oldValue: ' + oldValue;
				$scope.apply();
			});
		}
	};

	// TODO: export visible / all data as csv / pdf
	// TODO: import data
	// TODO: add / remove rows
	// TODO: update/edit rows inline
	// TODO: translate the columni headers ->  displayName = $translate.instant('ColDate')
	// TODO: implement tests on test data

	var _wttListUri = 	cfg.OPENCRX_URI + cfg.WTT_SVC_PATH + 
						'/provider/' + cfg.OPENCRX_PROVIDER + 
						'/segment/' + cfg.OPENCRX_MANDANT + '/activityTracker';

	var _promise = $http.get(_wttListUri);
	/*
	var _promise = $http({
		method: 'GET',
		url: 	_wttListUri,
		auth: 	cfg.OPENCRX_AUTH,
		headers: { 'Content-Type': 'application/json' }
	});
*/

	_promise.success(function(data, status) {
		var i = 0;
		for(i=0; i < data.length; i++) {
			data[i].datum = new Date(data[i].datum).toLocaleDateString(AppConfig.getCurrentLanguageKey());
		}
		$scope.gridOptions.data = data;
		$log.log('**** SUCCESS: GET(' + _wttListUri + ') returns with ' + status);
    	//$log.log('data=<' + data + '>');
	});

	_promise.error(function(data, status) {
  		// called asynchronously if an error occurs or server returns response with an error status.
    	$log.log('**** ERROR:  GET(' + _wttListUri + ') returns with ' + status);
    	$log.log('data=<' + data + '>');
  	});	

  	$scope.export = function() {
  		if ($scope.exportFormat === 'csv') {
  			var myElement = angular.element(document.querySelectorAll('.custom-csv-link-location'));
  			$scope.gridApi.exporter.csvExport($scope.exportRowType, $scope.exportColumnType, myElement);
  		} else if ($scope.exportFormat === 'pdf') {
  			$scope.gridApi.exporter.pdfExport($scope.exportRowType, $scope.exportColumnType);
  		} else {
  			$log.log('**** ERROR: PresentsListCtrl.export(): unknown exportFormat: ' + $scope.exportFormat);
  		}
  	};

	$scope.getLang = function() {
		// $log.log('PresentsListCtrl.getLang() = ' + AppConfig.getCurrentLanguageKey());
		return AppConfig.getCurrentLanguageKey();
	};
});

