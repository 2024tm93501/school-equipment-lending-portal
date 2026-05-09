@echo off
echo Starting School Equipment Lending Portal - Frontend
echo ====================================================
cd /d "%~dp0frontend"

echo Installing dependencies (if needed)...
call npm install --silent

echo.
echo Frontend running at http://localhost:5173
echo Press Ctrl+C to stop.
echo.
call npm run dev
