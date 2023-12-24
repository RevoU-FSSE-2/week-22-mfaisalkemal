import os
from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_talisman import Talisman


from db import db, db_init
from auth.apis import auth_blueprint
from todo.apis import todo_blueprint

app = Flask(__name__)

CORS(app)
# Talisman(app)

app.config['SQLALCHEMY_DATABASE_URI'] = "postgresql://postgres:your_root_password@34.142.252.30:3101/week-22-mfaisalkemal"
db.init_app(app)
app.config['JWT_SECRET_KEY'] = "haloHalobandungibukotA"
jwt = JWTManager(app)

app.register_blueprint(auth_blueprint, url_prefix="/auth")
app.register_blueprint(todo_blueprint, url_prefix="/todo")

# with app.app_context():
#     db_init()