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
    'ui.bootstrap.datetimepicker', 'ui.dateTimeInput', 'ui.tinymce', 'bsTable', 'ngWebSocket']);

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

    $scope.SyncDB = function () {
        // var socket = io.connect('http://' + document.domain + ':' + location.port);
        // socket.on('connect', function () {
        //     socket.emit('syncdb', {data: 'baoguoqiang'});
        // });

        var p = $http({
            method: 'GET',
            url: '/api/v1/syncdb/' + $scope.dtInput
        });
        p.success(function (result) {
            if (result instanceof String) {
                alert('Data Sync Successfully' + result)
            }
        });
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
        p.success(function (result) {
            myChart = echarts.init($('#fbchart').addClass('panel').addClass('panel-default').height(300).get(0));
            // myChart.showLoading()
            myChart.setOption(result.option)
        });

    });

});

QuickReportAppModule.controller('ControllerTestTwo', function ($scope, mySharedService, $http) {

    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;

        var p = $http({
            method: 'GET',
            url: '/api/v1/echartcase/' + $scope.dtInput
        });
        p.success(function (result) {
            myChart = echarts.init($('#yhchart').addClass('panel').addClass('panel-default').height(300).get(0));
            myChart.setOption(result.option)
        });

    });

});

QuickReportAppModule.controller('ReportDescriptionCtrl', function ($scope, mySharedService) {
    $scope.$on('handleBroadcast', function () {
        $scope.dtInput = mySharedService.message;
        $scope.tinymceOptions = {
            skin: 'lightgray',
            theme: 'modern',
            menubar: false,
            resize: false
        };
    });

});

QuickReportAppModule.controller('MainTableCtrl', function ($scope, $http, mySharedService) {

        $scope.$on('handleBroadcast', function () {
            $scope.dtInput = mySharedService.message;
            var $table = $('#table');

            // $table.on('post-body.bs.table', function () {
            //     $table.bootstrapTable('mergeCells', {
            //         index: 2,
            //         field: 'id',
            //         rowspan: 2,
            //         colspan: 1
            //     });
            // });

            function initTable() {
                $table.bootstrapTable({
                    url: '/api/v1/tablecase/' + $scope.dtInput,
                    method: 'GET',
                    detailView: false,
                    showExport: true,
                    exportDataType: 'all',
                    exportTypes: ['png'],
                    rowStyle: function (row, index) {
                        var classes = ['active', 'success', 'info', 'warning', 'danger'];
                        if (index % 2 === 0 && index / 2 < classes.length) {
                            return {
                                classes: classes[index / 2]
                            };
                        }
                        return {};
                    },

                    cellStyle: function (value, row, index, field) {
                        var classes = ['active', 'success', 'info', 'warning', 'danger'];

                        if (index === 1 && row === 1) {
                            return {
                                classes: classes[2]
                            };
                        }
                        return {};
                    },

                    onLoadSuccess: function () {
                        $table.bootstrapTable('mergeCells', {
                            index: 2,
                            field: 'id',
                            rowspan: 2,
                            colspan: 1
                        });
                    },

                    onExpandRow: function (index, row, $detail) {
                        oInit.InitSubTable(index, row, $detail);
                    },

                    columns: [
                        [
                            {
                                title: 'Item ID',
                                field: 'id',
                                rowspan: 2,
                                align: 'center',
                                valign: 'middle',
                                sortable: false
                            },
                            {
                                title: 'Item Detail',
                                colspan: 3,
                                align: 'center',
                                valign: 'middle'
                            }
                        ],
                        [
                            {
                                field: 'name',
                                title: 'Item Name',
                                sortable: false,
                                editable: false,
                                align: 'center',
                                valign: 'middle'
                            },
                            {
                                field: 'price',
                                title: 'Item Price',
                                sortable: false,
                                align: 'center',
                                valign: 'middle'
                            }
                        ]
                    ],
                });
            }

            window.operateEvents = {
                'click .like': function (e, value, row, index) {
                    alert('You click like action, row: ' + JSON.stringify(row));
                },
                'click .remove': function (e, value, row, index) {
                    $table.bootstrapTable('remove', {
                        field: 'id',
                        values: [row.id]
                    });
                }
            };

            $(function () {
                var scripts = [
                        location.search.substring(1) || '//cdn.bootcss.com/bootstrap-table/1.11.0/bootstrap-table.min.js',
                        '//cdn.bootcss.com/bootstrap-table/1.11.0/extensions/export/bootstrap-table-export.min.js',
                        'http://rawgit.com/hhurz/tableExport.jquery.plugin/master/tableExport.js',
                        '//cdn.bootcss.com/bootstrap-table/1.11.0/extensions/editable/bootstrap-table-editable.min.js',
                        'http://rawgit.com/vitalets/x-editable/master/dist/bootstrap3-editable/js/bootstrap-editable.js'
                    ],
                    eachSeries = function (arr, iterator, callback) {
                        callback = callback || function () {
                            };
                        if (!arr.length) {
                            return callback();
                        }
                        var completed = 0;
                        var iterate = function () {
                            iterator(arr[completed], function (err) {
                                if (err) {
                                    callback(err);
                                    callback = function () {
                                    };
                                }
                                else {
                                    completed += 1;
                                    if (completed >= arr.length) {
                                        callback(null);
                                    }
                                    else {
                                        iterate();
                                    }
                                }
                            });
                        };
                        iterate();
                    };
                eachSeries(scripts, getScript, initTable);
            });
            function getScript(url, callback) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.src = url;
                var done = false;
                // Attach handlers for all browsers
                script.onload = script.onreadystatechange = function () {
                    if (!done && (!this.readyState ||
                        this.readyState == 'loaded' || this.readyState == 'complete')) {
                        done = true;
                        if (callback)
                            callback();
                        // Handle memory leak in IE
                        script.onload = script.onreadystatechange = null;
                    }
                };
                head.appendChild(script);
                // We handle everything using the script element injection
                return undefined;
            }
        });


    }
);

