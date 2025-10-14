# 1. Use an official Node.js image
FROM node:18-alpine

# 2. Set working directory inside the container
WORKDIR /usr/envvault-server

# 3. Copy package files and install dependencies
COPY package*.json ./
RUN npm install 

# 4. Copy rest of the project files
COPY . .

# 5. Expose port (same as used in app)
EXPOSE 3000

# 6. Define the command to start the app
CMD ["npm", "run", "dev"]
