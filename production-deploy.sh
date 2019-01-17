#!/bin/bash

ember build -e production
scp -r dist/* futurebutcher.com:/var/www/futurebutcher.com/html
