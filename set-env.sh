#!/bin/bash

PROJECT_NAME="krisi-file-uploader"
CONFIG_NAME="dev"
ENV_FILE=".env"

echo "Checking Doppler authentication status..."

# Check if the user is logged into Doppler
if ! doppler configure get token &>/dev/null; then
  echo "You are not logged into Doppler."
  read -p "Do you want to log in now? (y/n): " choice
  if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
    doppler login
    if [ $? -ne 0 ]; then
      echo "Login failed. Exiting setup."
      exit 1
    fi
  else
    echo "Doppler login is required to proceed. Exiting setup."
    exit 1
  fi
else
  echo "You are already logged into Doppler!"
fi

# Configure the Doppler project and environment
echo "Setting up Doppler project and environment..."
doppler setup --project "$PROJECT_NAME" --config "$CONFIG_NAME" &>/dev/null
if [ $? -ne 0 ]; then
  echo "Failed to set up Doppler configuration. Please check your project name and environment."
  exit 1
fi

# Download the .env file
echo "Downloading .env file..."
doppler secrets download --format=env --no-file > "$ENV_FILE"
if [ $? -eq 0 ]; then
  echo ".env file successfully downloaded to $ENV_FILE"
else
  echo "Failed to download the .env file. Please check your Doppler configuration."
  exit 1
fi

echo "Environment setup complete! You can now run your project."
