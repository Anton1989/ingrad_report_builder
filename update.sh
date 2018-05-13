#!/bin/sh
git pull
npm build
pm2 restart ingrad-status