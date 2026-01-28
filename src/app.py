from flask import Flask, render_template
import pygame
import os
import random

app = Flask(__name__)
pygame.mixer.init()


@app.route("/")
def index():
    """
    Return index.html template.
    """
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
