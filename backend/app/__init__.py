from flask import Flask
from flask_cors import CORS

from .config import Config
from .db import init_db
from .routes.jobs import jobs_bp


def create_app() -> Flask:
    app = Flask(__name__)
    app.config.from_object(Config())

    CORS(app, resources={r"/jobs*": {"origins": "*"}})

    app.register_blueprint(jobs_bp)
    init_db(app)

    return app
