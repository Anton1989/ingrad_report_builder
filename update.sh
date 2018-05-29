#!/bin/sh
pm2 stop ingrad-docs
git pull
npm run build
pm2 start ingrad-docs