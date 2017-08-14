#!/bin/sh
#osascript -e 'tell app "Terminal"
#   do script ""
#end tell'


osascript \
    -e "tell application \"Terminal\"" \
    -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
    -e "do script \"cd backend; workon seng2021; py run.py; deactivate\" in front window" \
    -e "end tell" > /dev/null

sleep 5
osascript \
    -e "tell application \"Terminal\"" \
    -e "tell application \"System Events\" to keystroke \"t\" using {command down}" \
    -e "do script \"cd frontend; ng serve\" in front window" \
    -e "end tell" > /dev/null
