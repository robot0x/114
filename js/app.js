var app114 = angular.module('app114', ['ui.router','YellowModule','IndexModule','LocateModule','SearchModule','infinite-scroll']);
/**
 * 由于整个应用都会和路由打交道，所以这里把$state和$stateParams这两个对象放到$rootScope上，方便其它地方引用和注入。
 * 这里的run方法只会在angular启动的时候运行一次。
 * @param  {[type]} $rootScope
 * @param  {[type]} $state
 * @param  {[type]} $stateParams
 * @return {[type]}
 */
app114.run(function($rootScope, $state, $stateParams) {
    //$rootScope.cons_city = remote_ip_info['city'];
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    //定义系统全局变量
    //城市名称
    $rootScope.G_CITY = '南通';
    //经纬度
    $rootScope.G_LOG = 120.913183;
    $rootScope.G_LAT = 32.013195;
    //设备ID
    $rootScope.G_DEVICE = '123456';
});

/**
 * 配置路由。
 * 注意这里采用的是ui-router这个路由，而不是ng原生的路由。
 * ng原生的路由不能支持嵌套视图，所以这里必须使用ui-router。
 * @param  {[type]} $stateProvider
 * @param  {[type]} $urlRouterProvider
 * @return {[type]}
 */
app114.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider, $urlRouterProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/index');
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'tpls/index.html',
                    controller: 'indexCtrl'
                },
                'search@index':{
                    templateUrl:'tpls/search.html',
                    controller:'searchCtrl'
                }
            }
        })
        .state('index/address', {
            url: '/index/address:address',
            views: {
                '': {
                    templateUrl: 'tpls/index.html',
                    controller: 'indexCtrl'
                },
                'search@index/address':{
                    templateUrl:'tpls/search.html',
                    controller:'searchCtrl'
                }
            }
        })
        .state('yellow',{
            url: '/yellow/:key',
            templateUrl: 'tpls/list.html',
            controller: 'yellowCtrl'
        })
        .state('locate',{
            url:'/locate',
            templateUrl:'tpls/locate.html',
            controller: 'locateCtrl'
        })
        .state('result',{
            url:'/result:keywords',
            views:{
                '':{
                    templateUrl:'tpls/result.html',
                    controller:'resultCtrl'
                },
                'search@result':{
                    templateUrl:'tpls/search.html',
                    controller:'searchCtrl'
                }
            }
        })
}]);
