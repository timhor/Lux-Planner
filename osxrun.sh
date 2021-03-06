#!/bin/bash

osascript \
    -e "tell application \"Terminal\"" \
    -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
    -e "do script \"cd backend; workon seng2021; py run.py; deactivate; cd ..\" in front window" \
    -e "end tell" > /dev/null

sleep 2
osascript \
    -e "tell application \"Terminal\"" \
    -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
    -e "do script \"cd frontend; ng serve; cd ..\" in front window" \
    -e "end tell" > /dev/null
