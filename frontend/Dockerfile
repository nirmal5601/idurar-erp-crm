FROM node:18-alpine
 
# Set working directory inside container
WORKDIR /app
 
# Copy package.json and lock file
COPY package*.json ./
 
# Install dependencies
RUN npm install -f
 
# Copy the rest of the app code
COPY . .
 
# Expose Vite dev server port
EXPOSE 3000
 
# Set environment (optional)
# ENV NODE_ENV=development
 
# Run Vite dev server
CMD ["npm", "run", "dev"]
