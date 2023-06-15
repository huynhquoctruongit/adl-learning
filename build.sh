# sudo chmod +x ./build.sh
IMAGE_NAME=ghcr.io/tiennm-galaxt/adl-frontend
VERSION=$(git rev-parse --verify HEAD)

if [ -f .env ]; then
    # Load Environment Variables
    export $(cat .env | grep -v '#' | sed 's/\r$//' | awk '/=/ {print $1}' )
fi

# echo $GITHUB_TOKEN | docker login ghcr.io --username $GITHUB_USER --password-stdin && 
docker build -t $IMAGE_NAME:$VERSION . && 
docker build -t $IMAGE_NAME:latest . && 
docker push $IMAGE_NAME:$VERSION && 
docker push $IMAGE_NAME:latest && 
echo "Deploy to portainer..." &&
node ./deploy/deploy.js $VERSION