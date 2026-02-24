#!/bin/bash

sudo apt install neovim
sudo apt install tmux
sudo apt install pip -y
sudo apt install python3-gunicorn -y
sudo apt install python3-flask -y
sudo apt install python3-toml -y
sudo apt install python3-pygame -y
sudo apt install gunicorn -y
sudo apt-get install -y iptables-persistent

sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 5000

# Save
sudo netfilter-persistent save
sudo iptables -t nat -L -n -v

echo "Installation complete, run ./launch.sh to start the server"
