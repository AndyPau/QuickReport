# coding = utf-8

from flask import Flask
from flask_bootstrap import Bootstrap
from flask import render_template
import  requests

app = Flask(__name__)
bootstrap = Bootstrap(app)


@app.route('/')
def dailyreport_dashboard():
    name = "baogq"
    return render_template("homepage.html", name=name)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=True)
