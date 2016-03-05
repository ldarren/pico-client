#!/usr/bin/env bash

proj=$1
dev=$2

cd ..
../../../build mod/main.js dist cfg $1 $2
cp css/$1.css css/index.css
if [ ! -d "dist/$1/css" ]; then
	mkdir dist/$1/css
fi
lib/lean/build css/index.css dist/$1/css/index.css
