FROM node:6.6-slim

ENV KEY_FILE_NAME="./key_file.json"
ADD $KEY_FILE_NAME .

ADD package.json .
RUN npm install --production --loglevel=error
ADD index.js .

CMD ["node", "index.js"]
