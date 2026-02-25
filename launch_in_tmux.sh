#!bin/bash

# Create a tmux session called "famima"

tmux new-session -d -s famima

# Make sure you're in the folder /home/lodomo/BellBard
tmux send-keys -t famima "cd /home/lodomo/BellBard" C-m

# Run the command launch.sh
tmux send-keys -t famima "./launch.sh" C-m
