#!bin/bash

# Create a tmux session called "famima"

tmux new-session -d -s famima

# Run the command launch.sh
tmux send-keys -t famima "/home/lodomo/BellBard/launch.sh" C-m
