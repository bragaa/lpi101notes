#!/bin/bash

while read line ; do touch $line.md ; done

#while read -r line; do
#    echo -e "$line\n"
#done
