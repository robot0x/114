var indexModule = angular.module("IndexModule", []);

var yellowModule = angular.module("YellowModule", []);

yellowModule.controller('yellowCtrl', function($scope, $http, $state, $stateParams) {
	var apiUrl = 'http://search.teddymobile.cn/v1/api/yellow.api?yellow='+$stateParams.key;
	$http.jsonp(apiUrl+'&callfunc=JSON_CALLBACK')
    .success(function(data) {
    	console.log(data);
    	$scope.yellowList = data;
    })
    .error(function(data){
    	alert('2');
    	//alert(data);
    });
});

indexModule.controller('indexCtrl', function($scope, $http, $state, $stateParams) {
	$('#search_input').focus(function() {
		$('.search-record').css('display', 'block');
		$('.screen').css('display', 'block');
		$(this).css('width', '82%');
		if ($(this).val().length) {
			$('.cancel_btn').removeAttr('style');
			$('#search_btn').css('display', 'block');
		} else {
			$('#search_btn').removeAttr('style');
			$('.cancel_btn').css('display', 'block');
		}
	});
	$('#search_input').blur(function() {
		$('.search-record').removeAttr('style');
		$('.screen').removeAttr('style');
		if (!$(this).val().length) {
			$('.cancel_btn').removeAttr('style');
			$('#search_btn').removeAttr('style');
			$(this).removeAttr('style');
		}
	});
	$('#search_input').bind('input propertychange', function() {
		if ($(this).val().length) {
			$('.cancel_btn').removeAttr('style');
			$('#search_btn').css('display', 'block');
		} else {
			$('#search_btn').removeAttr('style');
			$('.cancel_btn').css('display', 'block');
		}
	});
});