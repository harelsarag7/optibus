FROM node:18-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY src/ ./src/
COPY data/ ./data/

# Build
RUN npm run build

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]

