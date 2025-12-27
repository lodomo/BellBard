from flask import Flask, render_template, jsonify, request
import pygame
import os
import random
# from flask import Flask, render_template, request, Response

app = Flask(__name__)
pygame.mixer.init()

STATIC_FOLDER = "./src/static/"
OPEN_SOUND_PATH = f"{STATIC_FOLDER}/sounds/open/"
CLOSE_SOUND_PATH = f"{STATIC_FOLDER}/sounds/close/"

OPEN_SOUND_FILES = []
CLOSE_SOUND_FILES = []


@app.route("/")
def index():
    """
    Return index.html template.
    """
    return render_template("index.html")


@app.route("/sounds/close", methods=["GET"])
def door_close_sound():
    """
    Return a list of all the files in the /static/sounds/close directory.
    """
    sounds = os.listdir(f"{STATIC_FOLDER}/sounds/close")
    return jsonify(sounds), 200


@app.route("/sounds/open", methods=["GET"])
def door_open_sound():
    """
    Return a list of all the files in the /static/sounds/open directory.
    """
    sounds = os.listdir(f"{STATIC_FOLDER}/sounds/open")
    return jsonify(sounds), 200


@app.route("/sound/open", methods=["POST"])
def set_open_sound():
    """
    Set the door open sound to a list of files in the /static/sounds/open directory.
    """
    # Get the list of files from the form
    selected_sounds = request.json.get("sounds", [])
    global OPEN_SOUND_FILES
    OPEN_SOUND_FILES = selected_sounds
    return jsonify({"message": "Open sound set successfully"}), 200


@app.route("/sound/close", methods=["POST"])
def set_close_sound():
    """
    Set the door close sound to a list of files in the /static/sounds/close directory.
    """
    # Get the list of files from the form
    selected_sounds = request.json.get("sounds", [])
    global CLOSE_SOUND_FILES
    CLOSE_SOUND_FILES = selected_sounds
    return jsonify({"message": "Close sound set successfully"}), 200


@app.route("/play/open/<filename>", methods=["GET"])
def play_open_sound(filename):
    """
    Play the specified door open sound file.
    """
    if pygame.mixer.music.get_busy():
        pygame.mixer.music.stop()

    sound_path = os.path.join(OPEN_SOUND_PATH, filename)
    if os.path.exists(sound_path):
        pygame.mixer.music.load(sound_path)
        pygame.mixer.music.play()
        return jsonify({"message": f"Playing open sound: {filename}"}), 200
    else:
        return jsonify({"error": "File not found"}), 404


@app.route("/play/close/<filename>", methods=["GET"])
def play_close_sound(filename):
    """
    Play the specified door close sound file.
    """
    if pygame.mixer.music.get_busy():
        pygame.mixer.music.stop()

    sound_path = os.path.join(CLOSE_SOUND_PATH, filename)
    if os.path.exists(sound_path):
        pygame.mixer.music.load(sound_path)
        pygame.mixer.music.play()
        return jsonify({"message": f"Playing close sound: {filename}"}), 200
    else:
        return jsonify({"error": "File not found"}), 404


def door_open():
    """
    Door opening event.
    """
    # If there is a sound playing, don't play it.
    if pygame.mixer.music.get_busy():
        return

    # Pick a sound at random from the OPEN_SOUND_FILES list
    sound_file = random.choice(OPEN_SOUND_FILES)
    sound_path = os.path.join(OPEN_SOUND_PATH, sound_file)
    if os.path.exists(sound_path):
        pygame.mixer.music.load(sound_path)
        pygame.mixer.music.play()
    return


def door_close():
    """
    Door closing event.
    """
    # If there is a sound playing, don't play it.
    if pygame.mixer.music.get_busy():
        return

    # Pick a sound at random from the CLOSE_SOUND_FILES list
    sound_file = random.choice(CLOSE_SOUND_FILES)
    sound_path = os.path.join(CLOSE_SOUND_PATH, sound_file)
    if os.path.exists(sound_path):
        pygame.mixer.music.load(sound_path)
        pygame.mixer.music.play()
    return

# TODO GPIO integration for door open/close events


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=80)
