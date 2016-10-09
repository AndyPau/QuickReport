# coding = utf-8

from flask import Flask
from flask_bootstrap import Bootstrap
from flask import render_template
from flask_sslify import SSLify
import  requests

app = Flask(__name__, template_folder='static', static_folder='static')
bootstrap = Bootstrap(app)
sslify = SSLify(app)

# app.jinja_env.variable_start_string = '{{ '
# app.jinja_env.variable_end_string = ' }}'


@app.route('/')
def dailyreport_dashboard():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
