# coding = utf-8

from flask import Flask, send_from_directory, request, jsonify
from flask import render_template
from flask_restful import Resource, Api, reqparse, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_sslify import SSLify
import template.charts.line_option

app = Flask(__name__, template_folder='static', static_folder='static')
app.config.from_object('config')
api = Api(app)
database = SQLAlchemy(app)

parser = reqparse.RequestParser()
parser.add_argument('admin', type=bool, help='Use super manager mode', default=False)

sslify = SSLify(app)

resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'address': fields.String
}


class AngularResource(Resource):
    # @marshal_with(resource_fields)
    def get(self, name=None):
        if name is not None:
            return {'message': name}
        else:
            return {'message': 'all names you want'}

            # user = User.query.filter_by(name=name).first()
            # return user


api.add_resource(AngularResource, '/api/v1/user/<name>', '/api/v1/user/')


# 默认情况下，浏览器无法加载根目录下node_modules内的资源文件，增加该方法来处理请求
# TODO:需要深入研究一下其他处理办法
@app.route('/node_modules/<path:path>')
def send_npm_assets(path):
    return send_from_directory('node_modules', path)


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/v1/echartcase/<date>')
def echartcase(date):
    return jsonify(option=template.line_template_option)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
