@echo off
setlocal

echo Setting up backend...
if not exist env (
    python -m venv env
)

call env\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
alembic upgrade head

echo Setting up frontend...
cd frontend
call npm install
cd ..

echo Setup complete.
