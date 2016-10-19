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
var QuickReportAppModule = angular.module('QuickReportApp', ['ngAnimate', 'ngSanitize', 'ngResource', 'ui.bootstrap',
    'ui.bootstrap.datetimepicker', 'ui.dateTimeInput', 'ui.tinymce', 'bsTable']);

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

QuickReportAppModule.controller('ControllerTestOne', function ($scope, mySharedService, $http) {

    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;

        var p = $http({
            method: 'GET',
            url: '/api/v1/echartcase/' + $scope.dtInput
        });
        p.success(function (resp) {
            myChart = echarts.init($('#fbchart').addClass('panel').addClass('panel-default').height(400).get(0));
            myChart.setOption(resp.option)
        });

    });

});

QuickReportAppModule.controller('ControllerTestTwo', function ($scope, mySharedService) {

    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;
    });

});

QuickReportAppModule.controller('ReportDescriptionCtrl', function ($scope, mySharedService) {
    $scope.tinymceOptions = {
        skin: 'lightgray',
        theme: 'modern',
        menubar: false,
        resize: false
    };

});

QuickReportAppModule.controller('MainTableCtrl', function ($scope, $http) {
    $scope.workspaces = [];
    $scope.workspaces.push({name: 'Workspace 1'});
    $scope.workspaces.push({name: 'Workspace 2'});
    $scope.workspaces.push({name: 'Workspace 3'});

    function makeRandomRows(colData) {
        var rows = [];
        for (var i = 0; i < 15; i++) {
            rows.push($.extend({
                index: i,
                id: 'row ' + i,
                name: 'GOOG' + i

            }, colData));
        }
        return rows;
    }

    $scope.workspaces.forEach(function (wk, index) {
        var colData = {workspace: wk.name};
        wk.rows = makeRandomRows(colData);

        wk.bsTableControl = {
            options: {
                data: wk.rows,
                rowStyle: function (row, index) {
                    return {classes: 'none'};
                },
                cache: false,
                striped: true,
                pagination: false,
                search: true,
                showColumns: false,
                showRefresh: false,
                minimumCountColumns: 2,
                clickToSelect: false,
                showToggle: false,
                maintainSelected: false,
                columns: [{
                    field: 'index',
                    title: '#',
                    align: 'right',
                    valign: 'bottom',
                    sortable: false
                }, {
                    field: 'id',
                    title: 'Item ID',
                    align: 'center',
                    valign: 'bottom',
                    sortable: false
                }, {
                    field: 'name',
                    title: 'Item Name',
                    align: 'center',
                    valign: 'middle',
                    sortable: false
                }, {
                    field: 'workspace',
                    title: 'Workspace',
                    align: 'left',
                    valign: 'top',
                    sortable: false
                }, {
                    field: 'flag',
                    title: 'Flag',
                    align: 'center',
                    valign: 'middle',
                    clickToSelect: false,
                    formatter: flagFormatter,
                    // events: flagEvents
                }]
            }
        };
        function flagFormatter(value, row, index) {
            return 'Comment'
        }

    });


    $scope.changeCurrentWorkspace = function (wk) {
        $scope.currentWorkspace = wk;
    };


    //Select the workspace in document ready event
    $(document).ready(function () {
        $scope.changeCurrentWorkspace($scope.workspaces[0]);
        $scope.$apply();
    });

});

