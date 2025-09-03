# PowerShell script to run Weather App on Windows
Write-Host "🌤️  Starting Weather App on Windows..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERROR: Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR: Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Please edit .env file and add your OpenWeatherMap API key" -ForegroundColor Yellow
    Write-Host "Get your free API key from: https://openweathermap.org/api" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue after adding your API key"
}

# Start development server
Write-Host ""
Write-Host "🚀 Starting development server..." -ForegroundColor Green
Write-Host "The app will open in your default browser at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm run dev
