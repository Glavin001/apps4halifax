#!/bin/bash

echo "Starting Python Simple HTTP Server"
ip=`ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1'`
# echo "Your local IP address is $ip"
echo "Connect to server at http://$ip:8000 or http://localhost:8000"
python -m SimpleHTTPServer
