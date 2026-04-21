@echo off
setlocal

echo Generating Python SDK from OpenAPI schema...
echo Ensure backend is running on http://localhost:8000 first.

call npm install -g @openapitools/openapi-generator-cli
openapi-generator-cli generate -i http://localhost:8000/openapi.json -g python -o moderation_sdk --additional-properties=packageName=moderation_sdk

echo SDK generation complete. Output folder: moderation_sdk
