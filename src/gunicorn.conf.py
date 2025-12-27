"""
Gunicorn Configuration file for the API/Client servers.
This handles starting all the globals that need to be initialized
"""
import os

PORT = "5000"
HOST = "0.0.0.0"

def bind_address():
    port = PORT
    host = HOST

    if host == "localhost":
        host = "0.0.0.0"

    return f"{host}:{port}"


def calculate_workers():
    return 1
    if os.cpu_count() is None:
        return 5
    return os.cpu_count() * 2 + 1


# Settings that are used when running gunicorn with the -c flag.
bind = bind_address()
workers = calculate_workers()
threads = 5
worker_class = "gthread"
timeout = 60
keepalive = 2
max_requests = 500
max_requests_jitter = 50


def on_starting(server):
    initialize()


def on_reload(server):
    initialize()


def initialize():
    init_pid()
    init_globals()
    startup_message()


def init_pid():
    """
    Initialize the PID for the gunicorn server.
    This file is set from the gunicorn command line.
    --pid ./src/gunicorn.pid
    """
    try:
        file_name = "./src/gunicorn.pid"
        with open(file_name, "r") as file:
            gunicorn_id = file.read()
        print(f"Gunicorn PID: {gunicorn_id}")
    except FileNotFoundError:
        print("No PID file found. Rerun the server with the --pid flag.")


def init_globals():
    return


def startup_message():
    print(f"Workers: {workers}, Threads: {threads}")
    print(f"Worker class: {worker_class}, Timeout: {timeout}")
    print(f"Keepalive: {keepalive} Max requests: {max_requests}")
    print(f"Jitter: {max_requests_jitter}")
