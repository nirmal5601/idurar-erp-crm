# Use Node.js 20 base image
FROM node:20-alpine
 
# Set working directory
WORKDIR /app
 
# Copy and install dependencies
COPY package*.json ./
RUN npm install -f
 
# Install system dependencies for PhantomJS (using apk for Alpine)
RUN apk update && apk add --no-cache \
  fontconfig \
  libx11 \
  libxext \
  libxrender \
  libxtst
 
# Copy the rest of the app code
COPY . .
 
# Optional: expose the backend port (update if different)
EXPOSE 8888
 
# Run setup (if necessary)
RUN npm run setup
 
# Start the backend server
CMD ["npm", "run", "start"]