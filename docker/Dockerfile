# Use base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "app.js"]