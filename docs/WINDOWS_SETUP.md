# Windows Setup Guide

This guide will help you run the Weather App on Windows systems.

## 🚀 Quick Start (Windows)

### Method 1: Using Batch Scripts (Easiest)

1. **Download and install Node.js 18+**
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the Windows Installer (.msi)
   - Run the installer and follow the setup wizard

2. **Get your project files**
   - Copy the entire `weatherapp` folder to your Windows machine
   - Or clone from Git: `git clone <your-repo-url>`

3. **Run the setup script**
   ```cmd
   cd weatherapp
   scripts\run-windows.bat
   ```

4. **Add your API key**
   - The script will create a `.env` file
   - Edit `.env` and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

5. **The app will start automatically**
   - Opens in your default browser at `http://localhost:3000`

### Method 2: Manual Setup

1. **Install Node.js** (if not already installed)
   ```cmd
   # Verify installation
   node --version
   npm --version
   ```

2. **Install dependencies**
   ```cmd
   cd weatherapp
   npm install
   ```

3. **Set up environment variables**
   ```cmd
   copy env.example .env
   # Edit .env file with your API key
   ```

4. **Start the development server**
   ```cmd
   npm run dev
   ```

## 🏗️ Building for Production (Windows)

### Using the Build Script
```cmd
scripts\build-windows.bat
```

### Manual Build
```cmd
npm run build
npm run preview
```

## 🌐 Deployment Options

### Option 1: IIS (Internet Information Services)

1. **Install IIS** on Windows Server
2. **Copy the `dist/` folder** to `C:\inetpub\wwwroot\weatherapp\`
3. **Configure IIS** to serve static files
4. **Set up URL rewrite** for SPA routing

### Option 2: Node.js Server

1. **Install PM2** for process management
   ```cmd
   npm install -g pm2
   ```

2. **Create ecosystem file** (`ecosystem.config.js`)
   ```javascript
   module.exports = {
     apps: [{
       name: 'weather-app',
       script: 'npm',
       args: 'run preview',
       cwd: 'C:\\path\\to\\your\\weatherapp',
       instances: 1,
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       }
     }]
   }
   ```

3. **Start with PM2**
   ```cmd
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Option 3: Static Hosting

The built app is a static website that can be deployed to:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **Azure Static Web Apps**
- **AWS S3 + CloudFront**

## 🔧 Troubleshooting

### Common Issues

1. **"Node.js is not recognized"**
   - Install Node.js from [nodejs.org](https://nodejs.org/)
   - Restart Command Prompt after installation

2. **"npm is not recognized"**
   - Node.js installation includes npm
   - Restart Command Prompt
   - Check PATH environment variable

3. **Port already in use**
   - The app will automatically try different ports
   - Or manually specify: `npm run dev -- --port 3001`

4. **API key not working**
   - Ensure no spaces around `=` in `.env` file
   - Verify the API key is correct
   - Check that the key has the right permissions

### Performance Tips

1. **Use SSD storage** for better performance
2. **Close unnecessary applications** to free up memory
3. **Use Chrome/Edge** for best compatibility
4. **Enable hardware acceleration** in browser settings

## 📱 Mobile Access

Once running, the app can be accessed from mobile devices on the same network:
- Find your computer's IP address: `ipconfig`
- Access via: `http://YOUR_IP:3000`

## 🔒 Security Notes

- Keep your API key secure
- Don't commit `.env` file to version control
- Use HTTPS in production
- Consider rate limiting for API calls

## 📞 Support

If you encounter issues:
1. Check the console for error messages
2. Verify all prerequisites are installed
3. Ensure your API key is valid
4. Check network connectivity
