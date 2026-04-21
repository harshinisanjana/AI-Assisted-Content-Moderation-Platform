@echo off
setlocal

echo Updating the local openapi.json snapshot...
call env\Scripts\python.exe dump_openapi.py

call npm install -g @openapitools/openapi-generator-cli
openapi-generator-cli generate -i openapi.json -g python -o moderation_sdk --additional-properties=packageName=moderation_sdk

echo SDK generation complete. Output folder: moderation_sdk
