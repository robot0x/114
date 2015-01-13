var indexModule = angular.module('IndexModule', []);

var yellowModule = angular.module('YellowModule', []);

var locateModule = angular.module('LocateModule',[]);

var searchModule = angular.module('SearchModule',[]);

yellowModule.controller('yellowCtrl', function($scope, $http, $state, $stateParams) {
	var apiUrl = 'http://search.teddymobile.cn/v1/api/yellow.api?yellow='+$stateParams.key;
	$http.jsonp(apiUrl+'&callfunc=JSON_CALLBACK')
    .success(function(data) {
    	$scope.yellowList = data;
    	yellowKeyList = [];
    	for(var key in data.list){
    		yellowKeyList.push(key);
    	}
    	$scope.yellowKeyList = yellowKeyList;
    })
    .error(function(data){
    });
});

indexModule.controller('indexCtrl',['$scope','$http','$state','$stateParams',function($scope, $http, $state, $stateParams) {

	if(typeof($stateParams.address) != 'undefined'){
		$scope.location = $stateParams.address;
		$.cookie('cons_location',$stateParams.address);
	}

	var py = cityList[$.cookie('cons_location')];
	$("a[source=gj]").each(function (i, a) {
		$(a).attr('href', "http://txl.3g.ganji.com/" + py + $(a).attr('url')); //生成对应的url
	});

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

searchModule.controller('resultCtrl',function($scope, $http, $state, $stateParams,Result) {
	var keywords = $stateParams.keywords;
	$scope.result = new Result(keywords);
});

searchModule.factory('Result',function($http){
	var Result = function(keywords){
		this.busy = false;
		this.guans = [];
		this.lists = [];
		this.count = 0;
		this.now = 0;
		this.keywords = keywords;
	};

	Result.prototype.nextPage = function(){
		if(this.busy) return;
		this.busy = true;
		//alert(this.now+" "+this.count);
		if(this.now < this.count || (this.now == 0 && this.count == 0)){
			var city = $.cookie('cons_location');
			var log = $.cookie('cons_lng');
			var lat = $.cookie('cons_lat');
			var apiUrl = 'http://search.teddymobile.cn/v1/api/search.api?key='+this.keywords+'&city='+city+'&log='+log+'&lat='+lat+'&offset='+this.now;
			$http.jsonp(apiUrl+'&callfunc=JSON_CALLBACK')
		    .success(function(data) {
		    	console.log(data);
		    	if(typeof(data.guan) != 'undefined'){
		    		for(var i = 0;i < data.guan.length; i++){
		    			this.guans.push(data.guan[i]);	
		    		}
		    	}
		    	for(var i = 0;i < data.list.length; i++){
		    		this.lists.push(data.list[i]);	
		    	}
		    	console.log("length:"+data.list.length+" now:"+this.now);
		    	this.now += data.list.length;
		    	this.count = data.count;
		    	this.busy = false;
		    }.bind(this));
		}else{
			$("#loadingText").text("没有更多数据");
		}
	};
	
    return Result;
});

searchModule.filter('trustHtml', function ($sce) {
	return function (input) {
		return $sce.trustAsHtml(input);
	}
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
