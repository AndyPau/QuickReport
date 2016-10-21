# coding = utf-8

from flask import Flask, jsonify
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
import template.charts.line_option
from flask_sockets import Sockets
from flask_socketio import SocketIO, emit

app = Flask(__name__, template_folder='static', static_folder='static')
app.config.from_object('config')
database = SQLAlchemy(app)
socketio = SocketIO(app)


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


@socketio.on('syncdb')
def handle_syncdb(message):
    print('received message: ' + message)


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
    socketio.run(app, host='0.0.0.0', port=9000, debug=True)
