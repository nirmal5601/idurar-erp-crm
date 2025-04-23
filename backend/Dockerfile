# Use Node.js 20 base image
FROM node:20-alpine
 
# Install dependencies required to run PhantomJS
RUN apk update && apk add --no-cache \
  bash \
  curl \
  wget \
  ca-certificates \
  fontconfig \
  ttf-freefont
 
# Set working directory
WORKDIR /app
 
# Copy and install dependencies
COPY package*.json ./
RUN npm install -f
 
# Install PhantomJS
RUN wget https://github.com/ariya/phantomjs/releases/download/2.1.1/phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
    tar xvjf phantomjs-2.1.1-linux-x86_64.tar.bz2 && \
    mv phantomjs-2.1.1-linux-x86_64 /usr/local/bin/phantomjs && \
    rm phantomjs-2.1.1-linux-x86_64.tar.bz2
 
# Copy the rest of the app code
COPY . .
 
# Run any additional setup steps if necessary
RUN npm run setup
 
# Expose the backend port (update if different)
EXPOSE 8888
 
# Start the backend server
CMD ["npm", "run", "start"]