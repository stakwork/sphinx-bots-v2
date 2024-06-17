# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of your application code
COPY . .

# Build the application
RUN npm run build

EXPOSE 8001

# Define the command to run your app
CMD ["node", "build/index.js"]
