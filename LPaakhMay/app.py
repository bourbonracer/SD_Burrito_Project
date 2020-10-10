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

app.config.from_pyfile('config.py')
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

@app.route('/burrito_table')
def burrito_table():
    return render_template('data_table.html')  

if __name__ == '__main__':
    app.run(debug=True)
 