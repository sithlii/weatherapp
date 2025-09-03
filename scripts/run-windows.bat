@echo off
echo Starting Weather App on Windows...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy env.example .env
    echo.
    echo ⚠️  IMPORTANT: Please edit .env file and add your OpenWeatherMap API key
    echo Get your free API key from: https://openweathermap.org/api
    echo.
    echo Press any key to continue after adding your API key...
    pause
)

REM Start development server
echo Starting development server...
echo The app will open in your default browser at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
call npm run dev
