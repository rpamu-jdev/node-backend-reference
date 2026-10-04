#!/bin/bash

# Usage: ./build-and-push.sh 0.0.1-RELEASE

VERSION=$1

if [ -z "$VERSION" ]; then
  echo "‚ùå Error: Version not provided."
  echo "Usage: $0 <version>"
  exit 1
fi

IMAGE_NAME="extio-learn"
LOCAL_REGISTRY="localhost:3000"

echo "Ì∫ß Building Docker image..."
docker build -t ${IMAGE_NAME}:${VERSION} .

echo "Ìø∑Ô∏è Tagging image for local registry..."
docker tag ${IMAGE_NAME}:${VERSION} ${LOCAL_REGISTRY}/${IMAGE_NAME}:${VERSION}

echo "Ì≥§ Pushing image to local registry..."
docker push ${LOCAL_REGISTRY}/${IMAGE_NAME}:${VERSION}

echo "‚úÖ Done: ${LOCAL_REGISTRY}/${IMAGE_NAME}:${VERSION} pushed successfully."
