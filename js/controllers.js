var indexModule = angular.module('IndexModule', []);

var yellowModule = angular.module('YellowModule', []);

var locateModule = angular.module('LocateModule',[]);

var searchModule = angular.module('SearchModule',[]);

//加入友盟统计代码
function onKVEvent(tag,map,duration) {
    map.id = tag;
    map.duration = duration;
    prompt("ekv", JSON.stringify(map));
}

yellowModule.controller('yellowCtrl', function($scope, $http, $state, $stateParams) {
	var apiUrl = 'http://search.teddymobile.cn/v1/api/yellow.api?yellow='+$stateParams.key+'&device='+$scope.G_DEVICE;
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
	var py;
	if(typeof($.cookie('cons_location')) != 'undefined'){
		py = $.cookie('cons_location');
	}else{
		py = $scope.G_CITY;
	}
	py = cityList[py];
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
	$scope.result = new Result(keywords,$scope);
	var history = new Object();
	var current;
	if(typeof($.cookie('history')) != 'undefined'){
		current = JSON.parse($.cookie('history'));
	}else{
		current = new Array();
	}
	history.keywords = keywords;
	var flag= true;
	for(var i=0;i<current.length;i++){
		if(history.keywords == current[i].keywords){
			flag = false;
		}
	}
	if(flag){
		current.push(history);
	}
	//保存3天
	$.cookie('history',JSON.stringify(current),{expires:3});
});

searchModule.factory('Result',function($http){
	var Result = function(keywords,$scope){
		this.busy = false;
		this.guans = [];
		this.lists = [];
		this.count = 0;
		this.now = 0;
		this.keywords = keywords;
		this.flag = true;
		if(typeof($.cookie('cons_location')) != 'undefined'){
			this.G_CITY = $.cookie('cons_location');
		}else{
			this.G_CITY = $scope.G_CITY;
		}
		this.G_LOG = $scope.G_LOG;
		this.G_LAT = $scope.G_LAT;
	};

	Result.prototype.nextPage = function(){
		if(this.busy) return;
		this.busy = true;
		if((this.now < this.count || (this.now == 0 && this.count == 0)) && this.flag){
			var apiUrl = 'http://search.teddymobile.cn/v1/api/search.api?key='+this.keywords+'&city='+this.G_CITY+'&log='+this.G_LOG+'&lat='+this.G_LAT+'&offset='+this.now;
			$http.jsonp(apiUrl+'&callfunc=JSON_CALLBACK')
		    .success(function(data) {
		    	//console.log(data);
		    	if(typeof(data.guan) != 'undefined'){
		    		for(var i = 0;i < data.guan.length; i++){
		    			this.guans.push(data.guan[i]);	
		    		}
		    	}
		    	if(typeof(data.list) != 'undefined'){
		    		for(var i = 0;i < data.list.length; i++){
			    		this.lists.push(data.list[i]);	
			    	}
			    	this.now += data.list.length;
			    	this.count = data.count;
			    	if(this.count == 0)
			    		this.flag = false;
		    	}else{
		    		$("#loadingText").text("没有搜索到结果。。。");
		    		this.flag = false;
		    		this.busy = true;
		    	}
		    	this.busy = false;
		    }.bind(this));
		    if(this.now == 0 && this.count == 0){
		    	onKVEvent('click',{'item':'搜索','key':this.keywords});
		    }
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
		$scope.location = $scope.G_CITY;
	}
	if(typeof($.cookie('history')) != 'undefined'){
		var current = new Array();
		var historys = new Array();
		current = JSON.parse($.cookie('history'));
		for(var i = current.length ; (i > 0) && (i > current.length-3) ; i--){
			historys.push(current[i-1].keywords);
		}
		$scope.history_flag = true;
		$scope.historys = historys;
	}else{
		$scope.history_flag = false;
	}

	//切换城市
	$('.locate_btn').click(function(){
		onKVEvent('click',{'item':'选择城市'});
	});

	//首页链接
	$(".quicklink a").click(function () {
    	onKVEvent('click',{'item' : $(this).find('h3').html()});
    });

    $(".grid-a a").click(function(){
    	onKVEvent('click',{'item' : $(this).html()});
    });
	
    //搜索框获得焦点，显示 取消/搜索 按钮和下拉历史记录
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
	//搜索框拾取焦点，输入框恢复原状 隐藏 取消/搜索 按钮
	$('#search_input').blur(function() {
		// $('.search-record').removeAttr('style');  //历史记录列表
		// $('.screen').removeAttr('style');
		// $(this).next('.r').removeAttr('style');
		// if (!$(this).val().length) {
		// 	$('.cancel_btn').removeAttr('style');
		// 	$('#search_btn').removeAttr('style');
		// 	$(this).removeAttr('style');
		// }
		$('#cancel_btn').click(function() {
			onKVEvent('click',{'item':'取消搜索'});
			$('.search-record').removeAttr('style');  //历史记录列表
			$('.screen').removeAttr('style');
			$('#search_input').next('.r').removeAttr('style');
			$(this).removeAttr('style');
			$('#search_btn').removeAttr('style');
			$('#search_input').removeAttr('style');
		});
	});

	//依据搜索框值的变化显示 取消或搜索按钮
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
