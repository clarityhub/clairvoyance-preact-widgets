#!/bin/bash

yarn install --no-progress > /dev/null

yarn start &

http-server ./build -p 3000 -b /scripts
