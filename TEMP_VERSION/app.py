import pygame
import gpiozero as gpio
import os
import time

os.environ["SDL_AUDIODRIVER"] = "alsa"
os.environ["AUDIODEV"] = "hw:UACDemoV10"
pygame.mixer.init()
pygame.mixer.music.set_volume(1)

LEFT_PIN = 17
RIGHT_PIN = 4
LEFT_DOOR_BUTTON = gpio.Button(LEFT_PIN)
RIGHT_DOOR_BUTTON = gpio.Button(RIGHT_PIN)
SOUND = pygame.mixer.Sound("famima.wav")


def play_sound():
    if pygame.mixer.get_busy():
        return
    SOUND.play()
    return


LEFT_DOOR_BUTTON.when_released = lambda: play_sound()
RIGHT_DOOR_BUTTON.when_released = lambda: play_sound()

while True:
    time.sleep(1)
