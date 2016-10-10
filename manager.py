# coding = utf-8

from flask import Flask, send_from_directory
from flask import render_template
from flask_sslify import SSLify

app = Flask(__name__, template_folder='static', static_folder='static')
sslify = SSLify(app)


# 默认情况下，浏览器无法加载根目录下node_modules内的资源文件，增加该方法来处理请求
# TODO:需要深入研究一下其他处理办法
@app.route('/node_modules/<path:path>')
def send_npm_assets(path):
    return send_from_directory('node_modules', path)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
