import toml
import os
from .sound_effect import SoundEffect


def load_settings(file_path, list_to_update):
    """
    Load settings from a TOML file and return a list of SoundEffect objects.
    """
    try:
        with open(file_path, "r") as f:
            settings = toml.load(f)
    except FileNotFoundError:
        print(f"Settings file '{file_path}' not found. Starting with an empty list.")
        return

    for effect in settings.get("sound_effects", []):
        # Check if the file path exists before creating the SoundEffect object
        if not os.path.isfile(effect["file_path"]):
            print(f"Warning: File '{effect['file_path']}' not found. Skipping this sound effect.")
            print("This will remove the sound effect from the settings file when it is saved again.")
            continue

        sound_effect = SoundEffect(
            file_path=effect["file_path"],
            name=effect.get("name", None),
            on_open=bool(effect.get("on_open", False)),
            on_close=bool(effect.get("on_close", False))
        )
        list_to_update.append(sound_effect)

        # Sort list by name
        list_to_update.sort(key=lambda x: x.name)
    return


def save_settings(file_path, list_to_save):
    """
    Save a list of SoundEffect objects to a TOML file.
    """
    # Alphabetize the list
    list_to_save.sort(key=lambda x: x.name)
    settings = {
        "sound_effects": [
            {
                "file_path": effect.file_path,
                "name": effect.name,
                "on_open": effect.on_open,
                "on_close": effect.on_close
            }
            for effect in list_to_save
        ]
    }


    with open(file_path, "w") as f:
        toml.dump(settings, f)
    return


def load_new_files(directory, list_to_update):
    """
    Load new sound effects from a directory and return a list of SoundEffect objects.
    """
    sound_effects = []
    files = os.listdir(directory)
    for filename in files:
        if any(effect.file_path == os.path.join(directory, filename) for effect in list_to_update):
            continue

        if filename.endswith(".mp3") or filename.endswith(".wav"):
            file_path = os.path.join(directory, filename)
            sound_effects.append(SoundEffect(file_path=file_path))
    list_to_update.extend(sound_effects)
    return
