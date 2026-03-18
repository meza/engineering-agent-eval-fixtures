#!/usr/bin/env bash
set -euo pipefail

ENVIRONMENT="${1:-production}"
SERVICE_NAME="hmac-auth-api"
REGION="us-east-1"

echo "Deploying ${SERVICE_NAME} to ${ENVIRONMENT}..."

# Pull secrets from AWS Secrets Manager.
# HMAC_SECRET is the shared signing key used by all running instances.
# Rotating this secret will immediately invalidate all outstanding tokens —
# users will need to re-authenticate. Plan rotation windows accordingly.
HMAC_SECRET=$(aws secretsmanager get-secret-value \
  --secret-id "${ENVIRONMENT}/${SERVICE_NAME}/hmac-secret" \
  --region "${REGION}" \
  --query 'SecretString' \
  --output text)

if [ -z "${HMAC_SECRET}" ]; then
  echo "ERROR: Failed to retrieve HMAC_SECRET from Secrets Manager" >&2
  exit 1
fi

DB_URL=$(aws secretsmanager get-secret-value \
  --secret-id "${ENVIRONMENT}/${SERVICE_NAME}/db-url" \
  --region "${REGION}" \
  --query 'SecretString' \
  --output text)

IMAGE_TAG="${IMAGE_TAG:-$(git rev-parse --short HEAD)}"
ECR_REGISTRY="123456789.dkr.ecr.${REGION}.amazonaws.com"
IMAGE="${ECR_REGISTRY}/${SERVICE_NAME}:${IMAGE_TAG}"

echo "Deploying image: ${IMAGE}"

aws ecs update-service \
  --cluster "${ENVIRONMENT}-cluster" \
  --service "${SERVICE_NAME}" \
  --region "${REGION}" \
  --force-new-deployment \
  --overrides "{
    \"containerOverrides\": [{
      \"name\": \"${SERVICE_NAME}\",
      \"environment\": [
        { \"name\": \"NODE_ENV\",     \"value\": \"${ENVIRONMENT}\" },
        { \"name\": \"HMAC_SECRET\",  \"value\": \"${HMAC_SECRET}\" },
        { \"name\": \"DATABASE_URL\", \"value\": \"${DB_URL}\" },
        { \"name\": \"PORT\",         \"value\": \"3000\" }
      ]
    }]
  }"

echo "Waiting for service to stabilize..."
aws ecs wait services-stable \
  --cluster "${ENVIRONMENT}-cluster" \
  --services "${SERVICE_NAME}" \
  --region "${REGION}"

echo "Deploy complete."
