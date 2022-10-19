FROM node:16-slim
COPY package*.json ./
RUN npm i
COPY config/ config/
COPY model/ model/
COPY index.js app.js ./
EXPOSE 8000/tcp
CMD ["npm", "start"]