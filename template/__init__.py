line_template_option = {

    "title": {
        "text": '未来一周气温变化',
        "subtext": '纯属虚构'
    },
    "tooltip": {
        "trigger": 'axis'
    },
    "legend": {
        "data": ['最高气温', '最低气温']
    },
    "toolbox": {
        "show": True,
        "feature": {
            "mark": {"show": True},
            "dataView": {"show": True, "readOnly": False},
            "magicType": {"show": True, "type": ['line', 'bar']},
            "restore": {"show": True},
            "saveAsImage": {"show": True}
        }
    },
    "calculable": True,
    "xAxis": [
        {
            "type": 'category',
            "boundaryGap": False,
            "data": ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    "yAxis": [
        {
            "type": 'value',
            "axisLabel": {
                "formatter": '{value} °C'
            }
        }
    ],
    "series": [
        {
            "name": '最高气温',
            "type": 'line',
            "data": [11, 11, 15, 13, 12, 13, 10],
            "markPoint": {
                "data": [
                    {"type": 'max', "name": '最大值'},
                    {"type": 'min', "name": '最小值'}
                ]
            },
            "markLine": {
                "data": [
                    {"type": 'average', "name": '平均值'}
                ]
            }
        },
        {
            "name": '最低气温',
            "type": 'line',
            "data": [1, -2, 2, 5, 3, 2, 0],
            "markPoint": {
                "data": [
                    {"name": '周最低', "value": -2, "xAxis": 1, "yAxis": -1.5}
                ]
            },
            "markLine": {
                "data": [
                    {"type": 'average', "name": '平均值'}
                ]
            }
        }
    ]
};

__all__ = ['line_template_option']
