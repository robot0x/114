var indexModule = angular.module('IndexModule', []);

var yellowModule = angular.module('YellowModule', []);

var locateModule = angular.module('LocateModule',[]);

var searchModule = angular.module('SearchModule',[]);

yellowModule.controller('yellowCtrl', function($scope, $http, $state, $stateParams) {
	var apiUrl = 'http://search.teddymobile.cn/v1/api/yellow.api?yellow='+$stateParams.key;
	$http.jsonp(apiUrl+'&callfunc=JSON_CALLBACK')
    .success(function(data) {
    	//console.log(data);
    	$scope.yellowList = data;
    	yellowKeyList = [];
    	for(var key in data.list){
    		yellowKeyList.push(key);
    	}
    	$scope.yellowKeyList = yellowKeyList;
    })
    .error(function(data){
    	//alert('2');
    	//alert(data);
    });
});

indexModule.controller('indexCtrl',['$scope','$http','$state','$stateParams',function($scope, $http, $state, $stateParams) {

	if(typeof($stateParams.address) != 'undefined'){
		$scope.location = $stateParams.address;
		$.cookie('cons_location',$stateParams.address);
	}

}]);

locateModule.controller('locateCtrl', function($scope, $http, $state, $stateParams) {
	$('.procity .listview .collapsed').click(function(event) {
		event.preventDefault();
		if($(this).hasClass('expand')){
			$(this).removeClass('expand');
			$(this).next('.collapsed-content').removeAttr('style');
		}
		else{
			$(this).addClass('expand');
			$(this).next('.collapsed-content').css('display','block');
		}
	});
});

searchModule.controller('resultCtrl',function($scope, $http, $state, $stateParams) {
	console.log($stateParams);
});


searchModule.controller('searchCtrl',function($scope, $http, $state, $stateParams) {
	if(typeof($.cookie('cons_location')) != 'undefined'){
		$scope.location = $.cookie('cons_location');
	}else{
		$scope.location = $scope.cons_city;
	}

	$('#search_input').focus(function() {
		$('.search-record').css('display', 'block');
		$('.screen').css('display', 'block');
		$(this).css('width', '84%');
		$(this).next('.r').css({'right':'16%','margin-right':'.2em'});
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
		$(this).next('.r').removeAttr('style');
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
