# coding = utf-8

from flask import Flask, jsonify
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
import template.charts.line_option
import pandas as pd
import pymysql
import utils.spider.FaceBookSpider as spider

app = Flask(__name__, template_folder='static', static_folder='static')
app.config.from_object('config')
database = SQLAlchemy(app)


# # 默认情况下，浏览器无法加载根目录下node_modules内的资源文件，增加该方法来处理请求
# # TODO:需要深入研究一下其他处理办法
# @app.route('/node_modules/<path:path>')
# def send_npm_assets(path):
#     return send_from_directory('node_modules', path)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/echartcase/<date>')
def facebook(date):
    return jsonify(option=template.line_template_option)


@app.route('/api/v1/syncdb/<date>')
def handle_syncdb(date):
    host = 'offer-hero.cq7ehxlwlj3o.us-west-2.rds.amazonaws.com'
    user = 'offer_hero'
    passwd = 'ue9ye6tlvjk4s4f6usrhnj0nbm7gb20'
    db = 'offer_hero'
    sql = ''
    conn = pymysql.connect(host=host, port=3306, user=user, passwd=passwd, db=db, charset='UTF8')
    df = pd.read_sql(sql, conn)
    conn.close()
    return df.to_json()


@app.route('/api/v1/spider/<date>')
def handle_spider(date):
    return spider.spider_output_html('2016-11-01', date)


@app.route('/api/v1/tablecase/<date>')
def daily_report_traffic(date):
    data = [
        {
            "id": 0,
            "name": "Item 0",
            "price": "$0"
        },
        {
            "id": 1,
            "name": "Item 1",
            "price": "$1"
        },
        {
            "id": 2,
            "name": "Item 2",
            "price": "$2"
        },
        {
            "id": 3,
            "name": "Item 3",
            "price": "$3"
        }
    ]
    return jsonify(data);


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
