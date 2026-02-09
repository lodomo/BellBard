from flask import Flask, render_template, request, jsonify, send_file
from .sound_effect import SoundEffect
import pygame
import os
from .settings import load_settings, save_settings, load_new_files
# import random

app = Flask(__name__)
pygame.mixer.init()

SOUND_EFFECTS = []
load_settings("./src/settings.toml", SOUND_EFFECTS)
load_new_files("./src/static/sounds", SOUND_EFFECTS)
save_settings("./src/settings.toml", SOUND_EFFECTS)


@app.route("/")
def index():
    """
    Return index.html template.
    """
    return render_template("index.html")


@app.route("/sounds", methods=["GET"])
def get_sounds():
    """
    Return a list of sound effects as a JSON response.
    """
    json = [effect.__dict__() for effect in SOUND_EFFECTS]
    return jsonify(json), 200


@app.route("/play_on_device/<string:id>", methods=["POST"])
def play_on_device(id):
    """
    Play a sound effect on the device based on the name received in the request.
    """

    for effect in SOUND_EFFECTS:
        if effect.id == int(id):
            # Remove ./src/ from the filepath, quirk of flask
            path = effect.file_path.replace("./src/", "")
            return send_file(path, mimetype="audio/mpeg")
    return {"message": "Sound effect not found"}, 404




@app.route("/upload", methods=["POST"])
def upload():
    """
    Receive a file from the client, save it to the sounds directory
    """
    file = request.files["file"]
    filename = file.filename
    save_path = os.path.join("sounds", filename)
    file.save(save_path)

    load_new_files("./src/static/sounds", SOUND_EFFECTS)
    save_settings("./src/settings.toml", SOUND_EFFECTS)

    return "File uploaded successfully", 200


@app.route("/volume", methods=["GET"])
def volume():
    """
    Return the current volume level as a JSON response.
    """
    volume_level = pygame.mixer.music.get_volume()
    return {"volume": volume_level}, 200


@app.route("/volume", methods=["POST"])
def set_volume():
    """
    Set the volume level based on the value received in the request.
    """
    volume_level = float(request.form["volume"])
    pygame.mixer.music.set_volume(volume_level)
    return {"message": "Volume set successfully"}, 200


if __name__ == "__main__":
    app.run()
