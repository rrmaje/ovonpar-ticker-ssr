FROM mhart/alpine-node:10.16.0
WORKDIR /src
ADD . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
