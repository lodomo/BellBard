class SoundEffect:
    id = 0
    def __init__(self, file_path, name=None, on_open=False, on_close=False):
        # Name is name or the last part of the filepath (after the last / before the extension)
        self.name = name if name else file_path.split("/")[-1].split(".")[0]
        self.file_path = file_path
        self.on_open = on_open
        self.on_close = on_close
        self.id = SoundEffect.id
        SoundEffect.id += 1

    def __repr__(self):
        return f"SoundEffect(name={self.name}, file_path={self.file_path}, on_open={self.on_open}, on_close={self.on_close})"

    def __dict__(self):
        return {
            "name": self.name,
            "file_path": self.file_path,
            "on_open": self.on_open,
            "on_close": self.on_close,
            "id": self.id
        }
