@echo off
setlocal

set "ROOT=%~dp0"
set "PYTHON=%ROOT%env\Scripts\python.exe"
if not exist "%PYTHON%" set "PYTHON=%ROOT%.venv\Scripts\python.exe"

if not exist "%PYTHON%" (
	echo Backend virtual environment not found. Run setupdev.bat first.
	exit /b 1
)

echo Updating the local openapi.json snapshot...
"%PYTHON%" "%ROOT%dump_openapi.py"

call npm install -g @openapitools/openapi-generator-cli
openapi-generator-cli generate -i "%ROOT%openapi.json" -g python -o "%ROOT%moderation_sdk" --additional-properties=packageName=moderation_sdk

echo SDK generation complete. Output folder: moderation_sdk
