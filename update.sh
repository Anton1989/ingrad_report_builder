#!/bin/sh
git pull
npm run build
pm2 restart ingrad-docs