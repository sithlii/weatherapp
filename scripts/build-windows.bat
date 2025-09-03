@echo off
echo Building Weather App for Windows...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js 18+ first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

REM Install dependencies
echo Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy env.example .env
    echo.
    echo IMPORTANT: Please edit .env file and add your OpenWeatherMap API key
    echo Get your free API key from: https://openweathermap.org/api
    echo.
    pause
)

REM Build the application
echo Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Build completed successfully!
echo.
echo The built files are in the 'dist' folder.
echo You can now:
echo 1. Copy the 'dist' folder to any web server
echo 2. Run 'npm run preview' to test locally
echo 3. Deploy to Windows Server, IIS, or any hosting service
echo.
pause
