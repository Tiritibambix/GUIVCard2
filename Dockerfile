FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN apk add --no-cache wget
RUN npm install -g serve
RUN npm install --production

# Copy source
COPY . .

# Build for production
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app in production mode
# Add startup script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]