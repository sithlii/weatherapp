# Weather App - Modern TypeScript Edition

A sleek, modern weather application built with React, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env
# Edit .env and add your OpenWeatherMap API key

# Start development server
npm run dev
```

## 📁 Project Structure

```
├── config/              # TypeScript configuration files
│   ├── tsconfig.json    # TypeScript config
│   └── tsconfig.node.json # TypeScript node config
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS config
├── postcss.config.js    # PostCSS config
├── docs/                # Documentation
│   └── README.md        # Detailed documentation
├── scripts/             # Build and setup scripts
│   └── install.sh       # Installation script
├── src/                 # Source code
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   └── types/           # TypeScript types
├── public/              # Static assets
├── legacy/              # Legacy Python code
└── dist/                # Build output
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run install:setup` - Run setup script

## 📖 Documentation

For detailed documentation, see [docs/README.md](docs/README.md)

## 🔧 Configuration

All configuration files are organized in the `config/` directory for better maintainability.

## 🏗️ Architecture

This project follows modern React/TypeScript best practices with:
- **Component-based architecture**
- **Type-safe API integration**
- **Modern build tooling** (Vite)
- **Responsive design** (Tailwind CSS)
- **Clean project structure**