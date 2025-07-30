FROM node:18-slim

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the application
COPY . .

# Expose the port your app runs on
EXPOSE 3500

# Run the app
CMD ["node", "server.js"]
