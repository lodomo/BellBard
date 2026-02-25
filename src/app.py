from flask import Flask, render_template, request, jsonify, send_file
from .sound_effect import SoundEffect
import pygame
import os
from .settings import load_settings, save_settings, load_new_files
import threading
import gpiozero as gpio
import time

TOML_FILE_PATH = "./src/settings.toml"

app = Flask(__name__)
pygame.mixer.init()
pygame.mixer.music.set_volume(0.5)

SOUND_EFFECTS = []
ACTIVE_ON_OPEN_EFFECTS = []
ACTIVE_ON_CLOSE_EFFECTS = []

OPEN_INDEX = 0
CLOSE_INDEX = 0

LEFT_PIN = 17
RIGHT_PIN = 4
LEFT_DOOR_BUTTON = gpio.Button(LEFT_PIN)
RIGHT_DOOR_BUTTON = gpio.Button(RIGHT_PIN)



load_settings(TOML_FILE_PATH, SOUND_EFFECTS)
load_new_files("./src/static/sounds", SOUND_EFFECTS)
save_settings(TOML_FILE_PATH, SOUND_EFFECTS)

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


@app.route("/toggle_state/<int:id>", methods=["POST"])
def toggle_state(id):
    """
    Activate a sound effect on open based on the name received in the request.
    """
    # Toggle the on_open or on_close state of the sound effect with the given name.
    # Does the json have "on_open" or "on_close" as a key?

    global ACTIVE_ON_OPEN_EFFECTS, ACTIVE_ON_CLOSE_EFFECTS
    global SOUND_EFFECTS

    json = request.get_json()
    print(f"Received toggle request for id: {id} with data: {json}")
    for effect in SOUND_EFFECTS:
        if effect.id == int(id):
            effect.on_open = json.get("on_open", effect.on_open)
            effect.on_close = json.get("on_close", effect.on_close)
            print(f"Toggled {effect.name} to on_open: {effect.on_open}, on_close: {effect.on_close}")
            save_settings(TOML_FILE_PATH, SOUND_EFFECTS)
            update_active_effects()
            return {"message": "Sound effect activated on open"}, 200

    update_active_effects()

    return {"message": "Sound effect not found"}, 404


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
    save_settings(TOML_FILE_PATH, SOUND_EFFECTS)

    return "File uploaded successfully", 200


@app.route("/volume", methods=["GET"])
def volume():
    """
    Return the current volume level as a JSON response.
    """
    volume_level = pygame.mixer.music.get_volume() * 100
    return {"volume": volume_level}, 200


@app.route("/volume", methods=["POST"])
def set_volume():
    """
    Set the volume level based on the value received in the request.
    """
    json = request.get_json()
    volume_level = float(json.get("volume")) / 100
    print(f"Setting volume to {volume_level}")
    pygame.mixer.music.set_volume(volume_level)
    return {"message": "Volume set successfully"}, 200

@app.route("/volume", methods=["GET"])
def get_volume():
    """
    Get the current volume level.
    """
    volume_level = pygame.mixer.music.get_volume() * 100
    print(f"Current volume level: {volume_level}")
    return {"volume": volume_level}, 200


@app.route("/play", methods=["GET"])
def play():
    """
    Play all active sound effects based on the value received in the request.
    """
    play_on_open()
    print("Played on open sound effects")
    return {"message": "Playing on open sound effects"}, 200

@app.route("/is_playing", methods=["GET"])
def is_playing():
    """
    Return whether or not a sound effect is currently playing.
    """
    return {"is_playing": pygame.mixer.music.get_busy()}, 200


def play_on_open():
    """
    Play all active on open sound effects.
    """
    global OPEN_INDEX
    if OPEN_INDEX >= len(ACTIVE_ON_OPEN_EFFECTS):
        OPEN_INDEX = 0

    # If pygame music is playing, don't do anything
    if pygame.mixer.music.get_busy():
        return

    if ACTIVE_ON_OPEN_EFFECTS:
        effect = ACTIVE_ON_OPEN_EFFECTS[OPEN_INDEX]
        print(f"Playing {effect.name} on open")
        pygame.mixer.music.load(effect.file_path)
        pygame.mixer.music.play()
        OPEN_INDEX += 1
        # Return the LENGTH of the file in seconds
        return {"message": f"Playing {effect.name} on open", "length": pygame.mixer.Sound(effect.file_path).get_length()}


def play_on_close():
    """
    Play all active on close sound effects.
    """
    global CLOSE_INDEX
    if CLOSE_INDEX >= len(ACTIVE_ON_CLOSE_EFFECTS):
        CLOSE_INDEX = 0

    # If pygame music is playing, don't do anything
    if pygame.mixer.music.get_busy():
        return

    if ACTIVE_ON_CLOSE_EFFECTS:
        effect = ACTIVE_ON_CLOSE_EFFECTS[CLOSE_INDEX]
        print(f"Playing {effect.name} on close")
        pygame.mixer.music.load(effect.file_path)
        pygame.mixer.music.play()
        CLOSE_INDEX += 1

def update_active_effects():
    """
    Update the list of active sound effects based on the current settings.
    """
    global ACTIVE_ON_OPEN_EFFECTS, ACTIVE_ON_CLOSE_EFFECTS
    ACTIVE_ON_OPEN_EFFECTS = [effect for effect in SOUND_EFFECTS if effect.on_open]
    ACTIVE_ON_CLOSE_EFFECTS = [effect for effect in SOUND_EFFECTS if effect.on_close]

update_active_effects()

def monitor_doors():

    was_left_pressed = LEFT_DOOR_BUTTON.is_pressed
    was_right_pressed = RIGHT_DOOR_BUTTON.is_pressed

    last_left_time = time.time()
    last_right_time = time.time()

    while True:
        if LEFT_DOOR_BUTTON.is_pressed and not was_left_pressed:
            elapsed_time = time.time() - last_left_time

            if elapsed_time < 1:
                print("Left door bounce detected, ignoring")
                continue

            print("Left door closed")
            play_on_close()
            was_left_pressed = True
            last_left_time = time.time()

        elif not LEFT_DOOR_BUTTON.is_pressed and was_left_pressed:
            eslapsed_time = time.time() - last_left_time

            if eslapsed_time < 1:
                print("Left door bounce detected, ignoring")
                continue

            print("Left door opened")
            play_on_open()
            was_left_pressed = False
            last_left_time = time.time()

        if RIGHT_DOOR_BUTTON.is_pressed and not was_right_pressed:
            elapsed_time = time.time() - last_right_time
            if elapsed_time < 1:
                print("Right door bounce detected, ignoring")
                continue

            print("Right door closed")
            play_on_close()
            was_right_pressed = True
            last_right_time = time.time()

        elif not RIGHT_DOOR_BUTTON.is_pressed and was_right_pressed:
            elapsed_time = time.time() - last_right_time
            if elapsed_time < 1:
                print("Right door bounce detected, ignoring")
                continue

            print("Right door opened")
            play_on_open()
            was_right_pressed = False
            last_right_time = time.time()


door_monitor_thread = threading.Thread(target=monitor_doors, daemon=True)
door_monitor_thread.start()



if __name__ == "__main__":
    app.run()
