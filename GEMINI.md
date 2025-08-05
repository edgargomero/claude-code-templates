# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

This is a monorepo containing a CLI tool for configuring Gemini and a documentation website. The main focus is the **Gemini Code Templates** CLI tool that provides real-time analytics dashboards, health checks, and automated project setup for Gemini configurations.

## Architecture

### Monorepo Structure
- **CLI Tool** (`/cli-tool`) - Node.js CLI application with analytics dashboard
- **Documentation** (`/docu`) - Docusaurus-based documentation website  
- **GitHub Pages** (`/docs`) - Static site deployment

### CLI Tool Architecture
- **Modular Analytics System**: StateCalculator, ProcessDetector, ConversationAnalyzer, FileWatcher, DataCache
- **Real-time Dashboard**: WebSocket server with live conversation monitoring
- **Multi-alias CLI**: 8 different command aliases (cct, gemini-init, etc.)
- **Framework Templates**: Language-specific GEMINI.md templates and configurations

## Development Commands

### CLI Tool Development (`/cli-tool`)
```bash
# Package management
npm install                    # Install dependencies
npm run dev:link              # Link for local development testing
npm run dev:unlink            # Unlink development package

# Application execution
npm start                     # Run CLI tool interactively
npm run analytics:start       # Start analytics dashboard (port 3333)
node src/analytics.js         # Direct analytics server startup

# Testing commands  
npm test                      # Run all Jest tests
npm run test:watch            # Watch mode testing
npm run test:coverage         # Coverage report (70%+ required)
npm run test:unit             # Unit tests only
npm run test:integration      # Integration tests only
npm run test:e2e              # End-to-end tests
npm run test:analytics        # Analytics-specific tests
npm run test:all              # Comprehensive test suite with Makefile

# Shell-based testing
npm run test:commands         # CLI command testing (test-commands.sh)
npm run test:detailed         # Detailed CLI testing (test-detailed.sh)

# Makefile testing scenarios
make test-react               # Test React template configuration
make test-vue                 # Test Vue template configuration  
make test-node                # Test Node.js template configuration
make test-hooks               # Test automation hooks functionality
make test-python-hooks        # Test Python-specific hooks
make pre-publish              # Complete test suite before publishing
```

### Documentation Development (`/docu`)
```bash
cd docu
npm install                   # Install Docusaurus dependencies
npm start                     # Start development server
npm run build                 # Build static site
npm run serve                 # Serve built site locally
npm run typecheck             # TypeScript type checking
```

## Testing Architecture

### Jest Configuration
- **Framework**: Jest 30.0.4 with watch plugins
- **Structure**: Unit (`/tests/unit`), Integration (`/tests/integration`), E2E (`/tests/e2e`)
- **Coverage Goals**: 70% global, 80% for analytics core modules
- **Mocking**: WebSocket, localStorage, DOM APIs for comprehensive testing

### Shell Testing Scripts
- **`test-commands.sh`**: CLI command validation and argument testing
- **`test-detailed.sh`**: Comprehensive scenario testing with real project setups
- **Makefile**: Framework-specific testing scenarios with temporary directories

### Testing Workflow
```bash
# Before development
npm run dev:link              # Link package locally
npm test                      # Verify existing functionality

# During development  
npm run test:watch            # Continuous testing
npm run analytics:start       # Test dashboard functionality

# Before committing
npm run test:coverage         # Ensure 70%+ coverage
make test                     # Run all Makefile scenarios
```

## Analytics Dashboard System

### Core Architecture
The analytics system provides real-time monitoring of Gemini sessions:

**Backend Modules**:
- **StateCalculator**: Conversation state detection ("Gemini working...", "User typing...")
- **ProcessDetector**: Running process detection and correlation with Gemini
- **ConversationAnalyzer**: Parse .jsonl files and extract conversation data
- **FileWatcher**: Real-time file system monitoring with chokidar
- **DataCache**: Multi-level caching system for performance optimization

**Frontend Components**:
- **Dashboard**: Main orchestration component with real-time updates
- **ConversationTable**: Interactive conversation display with export capabilities
- **Charts**: Data visualization using Chart.js
- **WebSocketService**: Real-time communication with fallback to polling

### WebSocket Communication Flow
```
Gemini writes → .jsonl file changes → FileWatcher detects → 
handleConversationChange → notifyNewMessage → WebSocketServer.broadcast → 
Frontend WebSocketService → Dashboard updates UI
```

### Analytics Server
```bash
npm run analytics:start       # Starts on http://localhost:3333
# Features: Real-time session tracking, conversation history, export capabilities
```

## CLI Tool Features

### Multi-Alias Support
All these commands work identically:
```bash
npx gemini-code-templates     # Primary package name
npx gct                       # Short form (3 letters)
npx gemini-init               # Init-style command
npx create-gemini-config      # Create-style command
```

### Command Categories
- **Interactive Setup**: Framework detection and optimal configuration
- **Health Checks**: Comprehensive system validation and diagnostics  
- **Analytics**: Real-time monitoring and usage statistics
- **Analysis Tools**: Command stats, hook analysis, MCP server analysis

## Template System Architecture

### Language Support Structure
```
templates/
├── common/                   # Universal configurations
├── javascript-typescript/    # JS/TS with React, Vue, Angular, Node.js
├── python/                   # Django, Flask, FastAPI
├── go/                       # Future: Gin, Echo, Fiber  
├── ruby/                     # Future: Rails, Sinatra
└── rust/                     # Future: Axum, Warp, Actix
```

### Template Components
Each language template includes:
- **GEMINI.md**: Framework-specific development guidance
- **settings.json**: Automation hooks configuration
- **commands/**: Custom slash commands for common tasks
- **.mcp.json**: Model Context Protocol server configurations

## Node.js Development Guidelines

### Module Organization
- **CommonJS Modules**: Use `module.exports` and `require()`
- **Class-based Architecture**: PascalCase classes (StateCalculator, ProcessDetector)
- **Dependency Injection**: For testability and modularity
- **JSDoc Documentation**: Document public APIs

### Code Conventions
- **Files/Modules**: PascalCase for classes, camelCase for utilities
- **Functions/Variables**: camelCase (getUserData, handleConversationChange)
- **Constants**: UPPER_SNAKE_CASE (API_BASE_URL, DEFAULT_PORT)
- **Private Methods**: Underscore prefix (_privateMethod)

### Async/Await Patterns
```javascript
// File operations
const content = await fs.readFile(filePath, 'utf8');

// WebSocket handling
server.on('connection', async (ws) => {
  await handleConnection(ws);
});

// Error handling
try {
  const result = await processConversation(data);
} catch (error) {
  console.error('Processing failed:', error.message);
}
```

## Performance and Security

### Performance Optimization
- **File Watching**: Efficient chokidar configuration with debouncing
- **WebSocket Management**: Connection pooling and cleanup
- **Memory Management**: Automatic cache cleanup and optimization
- **Caching Strategy**: Multi-level caching for conversation data

### Security Practices
- **Input Validation**: Sanitize file paths and user inputs
- **Environment Variables**: Sensitive configuration management
- **Dependency Auditing**: Regular `npm audit` and updates
- **Error Handling**: Prevent sensitive information exposure

## Deployment and Distribution

### NPM Package Configuration
- **Package Name**: `gemini-code-templates`
- **Version**: Semantic versioning (currently 1.11.0)
- **Node Requirement**: >=14.0.0
- **Files Included**: bin/, src/, templates/, README.md

### Release Process
```bash
# Pre-publish validation
npm run test:coverage         # Ensure 70%+ test coverage
make pre-publish              # Complete test suite
npm version patch|minor|major # Bump version
npm publish                   # Publish to npm registry
```

### Documentation Deployment
```bash
cd docu
npm run build                 # Build Docusaurus site
npm run deploy                # Deploy to GitHub Pages
```

## Troubleshooting Common Issues

### CLI Development Issues
- **Link Issues**: Use `npm run dev:unlink` then `npm run dev:link`
- **Test Failures**: Verify Node.js >=14.0.0 and clean npm install
- **Analytics Server**: Check port 3333 availability, firewall settings

### Testing Issues
- **Makefile Tests**: Ensure package is linked with `make install-dev`
- **Coverage Failures**: Focus on analytics core modules (StateCalculator, ProcessDetector)
- **WebSocket Tests**: Mock WebSocket connections for CI/CD environments

### Template Generation Issues
- **Framework Detection**: Verify package.json and project structure
- **File Permissions**: Ensure write permissions for .gemini/ directory creation
- **Backup Failures**: Check available disk space for automatic backups
