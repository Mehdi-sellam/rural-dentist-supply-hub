# Use an official Node.js image as the base
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's code
COPY . .

# Expose the port your app runs on (change if not 8080)
EXPOSE 8080

# Start the app
CMD ["npm", "run", "dev", "--", "--host=0.0.0.0"]