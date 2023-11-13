# from project root dir
find . -name *.test.js
find . -name *.test.js -not -path '*node_modules**'
find . -name *.js -not -path '*node_modules**'


npm i -g ipt
find . -name *.js -not -path '*node_modules**' | ipt

# back to module folder and copy project from module 1 here
cp -r ../../01-tests-module/05-tdd-project/ .

CONTENT="'use strict';"
find . -name *.js -not -path '*node_modules**' \
| ipt -o \
| xargs -I '{file}' sed -i "" -e "1s/^/$CONTENT\n/" {file}

# 1s => first line | ^ => first column | replace by $CONTENT | break line to add implicit \n


# changes everything
CONTENT="'use strict';"
find . -name *.js -not -path '*node_modules**' \
| xargs -I '{file}' sed -i "" -e "1s/^/$CONTENT\n/" {file}