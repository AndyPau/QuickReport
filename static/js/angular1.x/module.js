// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// Angular Module
var QuickReportAppModule = angular.module('QuickReportApp', ['ngAnimate', 'ngSanitize', 'ui.bootstrap',
    'ui.bootstrap.datetimepicker', 'ui.dateTimeInput', 'ui.tinymce']);

QuickReportAppModule.factory('mySharedService', function ($rootScope) {
    var sharedService = {};

    sharedService.message = '';

    sharedService.prepForBroadcast = function (msg) {
        this.message = msg;
        this.broadcastItem();
    };

    sharedService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return sharedService;
});

QuickReportAppModule.controller('GenerateInputCtrl', function ($scope, mySharedService) {

    $scope.GenerateClick = function () {
        var dtInput = $scope.data.dtInput.Format('yyyy-MM-dd');
        mySharedService.prepForBroadcast(dtInput);
    }

    $scope.$on('handleBroadcast', function () {
        $scope.message = mySharedService.message;
    });

});

QuickReportAppModule.controller('ControllerTestOne', function ($scope, mySharedService) {

    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;
    });

});

QuickReportAppModule.controller('ControllerTestTwo', function ($scope, mySharedService) {

    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;
    });

});

