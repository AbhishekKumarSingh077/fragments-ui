################################################################
#Stage 1: Install the base dependencies
################################################################
FROM node:18.14.0 AS dependencies

# Set maintainer and description labels
LABEL maintainer="ABHISHEK KUMAR SINGH <aksingh25@myseneca.ca>"
LABEL description="Fragments-ui Dockerfile"

# We default to use port 1234 in our service
ENV PORT=1234

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

# Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Set the NODE_ENV to production
ENV NODE_ENV=production

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install the dependencies
RUN npm ci --only=production

################################################################
#Stage 2: Build application
################################################################
FROM node:18.14.0 AS builder

#Set the working directory
WORKDIR /app

#Copy the generated node_modules from the previous stage
COPY --from=dependencies /app /app

#Copy the rest of the source code into the image
COPY . .

RUN npm install parcel-bundler
#Build the application
RUN npm run build

################################################################
#Stage 3: Run the application by making use of ngix
################################################################
FROM nginx:stable-alpine@sha256:a9e4fce28ad7cc7de45772686a22dbeaeeb54758b16f25bf8f64ce33f3bff636 AS runner

#Copy the build
COPY --from=builder /app/dist/ /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl --fail localhost:80 || exit 1

