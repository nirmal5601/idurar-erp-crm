
FROM node:20-buster

# Install necessary system dependencies
RUN apt-get update && apt-get install -y \
    bash \
    fontconfig \
    libjpeg-dev \
    libpng16-16 \
    libfreetype6 \
    libx11-dev \
    libssl-dev \
    libxslt1-dev \
    libfontconfig1 \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size


WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --frozen-lockfile  # Ensures exact dependency versions based on package-lock.json

# Copy the rest of the app code
COPY . .

# Optional: Run setup if you have a setup script in package.json
RUN npm run setup

# Expose the backend port (update this if your app uses a different port)
EXPOSE 8888

# Set environment variables (optional, you can modify this)
# ENV NODE_ENV=production

# Start the backend server
CMD ["npm", "run", "start"]