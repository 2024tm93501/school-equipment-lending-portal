@echo off
echo Starting School Equipment Lending Portal - Backend
echo ===================================================
cd /d "%~dp0backend"

REM Locate Python: try py launcher, then python3, then known local path
set PYTHON=
where py >nul 2>&1 && set PYTHON=py
if "%PYTHON%"=="" where python3 >nul 2>&1 && set PYTHON=python3
if "%PYTHON%"=="" if exist "C:\Users\truea\AppData\Local\Python\bin\python3.exe" set PYTHON=C:\Users\truea\AppData\Local\Python\bin\python3.exe
if "%PYTHON%"=="" where python >nul 2>&1 && set PYTHON=python

if "%PYTHON%"=="" (
    echo ERROR: Python not found. Please install Python 3.10+ or add it to PATH.
    pause
    exit /b 1
)
echo Using Python: %PYTHON%

if not exist "venv\Scripts\activate.bat" (
    echo Creating virtual environment...
    %PYTHON% -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment.
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt --quiet

echo.
echo Backend running at http://localhost:8000
echo API docs available at http://localhost:8000/docs
echo Press Ctrl+C to stop.
echo.
python run.py
pause
