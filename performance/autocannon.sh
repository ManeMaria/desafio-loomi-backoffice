#!/bin/sh

# Read for more informations: https://www.npmjs.com/package/autocannon#usage

URL=localhost:3001

npx autocannon $URL -m GET \
    -W [-c 1 -d 3] \
    -c 100 \
    -d 10 \
    -p 10 \
    --renderStatusCodes
