FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install -g serve
RUN npm install

# Copy source
COPY . .

# Build for production
RUN npm run build

# Expose port
EXPOSE 8080

# Start the app in production mode with debugging
ENV NODE_ENV=production
ENV DEBUG=*
CMD ["serve", "-s", "dist", "-v", "--debug"]