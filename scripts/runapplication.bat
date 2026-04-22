@echo off
setlocal

set "ROOT=%~dp0.."
set "PYTHON=%ROOT%\env\Scripts\python.exe"

if not exist "%PYTHON%" (
    echo Backend virtual environment not found. Run scripts\setupdev.bat first.
    exit /b 1
)

echo Starting backend...
pushd "%ROOT%"
start "Backend API" "%PYTHON%" -m uvicorn backend.app.main:app --reload --host 0.0.0.0 --port 8000
popd

echo Starting frontend...
pushd "%ROOT%\frontend"
start "Frontend UI" cmd /k "npm run dev"
popd

echo Application started.
echo Backend docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173