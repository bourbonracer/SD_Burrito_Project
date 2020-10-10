# Dependencies
import warnings
warnings.filterwarnings('ignore')
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

app.config.from_pyfile('Kmar/config.py')
db = SQLAlchemy()
db.init_app(app)
db.Model = automap_base(db.Model)


@app.route('/')
def home():
    return render_template('index.html')
    
@app.route('/burrito_data')
def burrito_search():
    db.Model.prepare(db.engine, reflect=True)
    print(db.Model.classes.keys())
    sd_burrito_data = db.Model.classes.sd_burrito_data
    data = sd_burrito_data.query.all()
    burrito = []
    for d in data:
        burrito.append({
            "ID": d.id,
            "Location": d.location,
            "Burrito": d.burrito,
            "Neighborhood": d.neighborhood,
            "Address": d.address,
            "Yelp": d.yelp,
            "Google": d.google,
            "Cost": d.cost,
            "key": d.key
        })
    return jsonify(burrito)

@app.route('/gauges')
def gauges():
    return render_template('gauges.html')

@app.route('/plot')
def plot():
    return render_template('plot.html')

@app.route('/data_table')
def data_table():
    return render_template('data_table.html')

@app.route('/topfive_costs')
def topfive_costs():
    return render_template('topfive_costs.html')

@app.route('/topfive_scores')
def topfive_scores():
    return render_template('topfive_scores.html')  

if __name__ == '__main__':
    app.run(debug=True)
 