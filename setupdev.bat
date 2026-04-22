@echo off
setlocal

set "ROOT=%~dp0"
set "PYTHON=%ROOT%env\Scripts\python.exe"
if not exist "%PYTHON%" set "PYTHON=%ROOT%.venv\Scripts\python.exe"

echo Setting up backend...
if not exist "%PYTHON%" (
	python -m venv "%ROOT%env"
	set "PYTHON=%ROOT%env\Scripts\python.exe"
)

pushd "%ROOT%"
"%PYTHON%" -m pip install --upgrade pip
"%PYTHON%" -m pip install -r requirements.txt
"%PYTHON%" -m alembic upgrade head
popd

echo Setting up frontend...
pushd "%ROOT%frontend"
call npm install
popd

echo Setup complete.
