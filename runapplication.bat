@echo off
setlocal

if not exist env\Scripts\activate (
    echo Backend virtual environment not found. Run setupdev.bat first.
    exit /b 1
)

echo Starting backend...
start "Backend API" cmd /k "call env\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo Starting frontend...
cd frontend
start "Frontend UI" cmd /k "npm run dev"
cd ..

echo Application started.
echo Backend docs: http://localhost:8000/docs
echo Frontend: http://localhost:5173
