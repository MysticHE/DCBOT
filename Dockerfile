FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Copy database.json to /data if it doesn't exist (first deploy only)
CMD if [ ! -f /data/database.json ]; then cp /app/database.json /data/database.json 2>/dev/null || echo '{}' > /data/database.json; fi && node index.js
