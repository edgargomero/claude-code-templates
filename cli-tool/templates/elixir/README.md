# Elixir/Phoenix Template for Claude Code

This template provides comprehensive configuration for Elixir and Phoenix projects, optimizing Claude Code for Elixir development with automated workflows, code quality tools, and Phoenix-specific commands.

## 🚀 What's Included

### Core Files
- **CLAUDE.md** - Comprehensive guide for Claude Code with Elixir/Phoenix best practices
- **settings.json** - Automation hooks for formatting, testing, and code quality
- **.mcp.json** - MCP server configurations for Elixir tooling
- **commands/** - Custom slash commands for common Phoenix tasks

### Automation Hooks

#### Pre-Tool Use
- **Elixir Syntax Check** - Validates syntax before code changes
- **Migration Safety Check** - Alerts on new database migrations

#### Post-Tool Use  
- **Mix Format** - Auto-formats code after changes
- **Run Related Tests** - Automatically runs tests for modified files
- **Credo Analysis** - Static code analysis (optional)
- **Update Route Info** - Refreshes routes after router changes

#### Stop Hooks
- **Format Check** - Ensures consistent code formatting
- **Compilation Check** - Verifies code compiles without warnings

### Custom Commands

- `/phoenix-new` - Create optimized Phoenix projects
- `/phoenix-context` - Generate contexts with best practices
- `/phoenix-liveview` - Build interactive LiveView components
- `/phoenix-auth` - Implement authentication systems
- `/phoenix-deploy` - Deploy to various platforms

### MCP Servers

Integrated development tools:
- **elixir-ls** - Language server for IDE features
- **mix-tasks** - Build tool integration
- **phoenix-server** - Development server
- **ecto-db** - Database management
- **credo-analysis** - Code quality checks
- **hex-packages** - Dependency management

## 📋 Prerequisites

- Elixir 1.14+ 
- Erlang/OTP 25+
- PostgreSQL 14+ (for Phoenix projects)
- Node.js 18+ (for Phoenix assets)

## 🛠️ Quick Start

1. **Install Prerequisites**
   ```bash
   # macOS (using Homebrew)
   brew install elixir postgresql node

   # Ubuntu/Debian
   sudo apt install elixir postgresql nodejs npm

   # Windows (using Chocolatey)
   choco install elixir postgresql nodejs
   ```

2. **Install Phoenix**
   ```bash
   mix local.hex --force
   mix archive.install hex phx_new
   ```

3. **Apply Template**
   ```bash
   cd your-elixir-project
   npx claude-code-templates --language elixir
   ```

## 🏗️ Project Structure

After applying this template:

```
your-project/
├── .claude/
│   ├── settings.json      # Automation hooks
│   └── commands/          # Custom commands
├── .mcp.json              # MCP configurations
├── CLAUDE.md              # Project guide
├── lib/                   # Elixir source code
│   ├── my_app/           # Business logic
│   └── my_app_web/       # Web interface
├── test/                  # Test files
├── config/               # Configuration
└── mix.exs               # Project definition
```

## 🎯 Usage Examples

### Create a New Phoenix Project
```bash
# Use the slash command
/phoenix-new

# Or manually
mix phx.new my_app --live --binary-id
```

### Generate a Context
```bash
# Use the slash command
/phoenix-context

# Creates complete business logic layer
mix phx.gen.context Accounts User users email:string name:string
```

### Build a LiveView
```bash
# Use the slash command  
/phoenix-liveview

# Generates interactive components
mix phx.gen.live Blog Post posts title:string body:text
```

## 🔧 Customization

### Modify Hooks
Edit `.claude/settings.json` to customize automation:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "name": "Custom Hook",
        "pattern": "**/*.ex",
        "command": "your-command {{file}}"
      }
    ]
  }
}
```

### Add Commands
Create new commands in `.claude/commands/`:
```markdown
# my-command.md
Your command documentation and code here...
```

## 🧪 Testing

The template includes testing configurations:

```bash
# Run all tests
mix test

# Run with coverage
mix test --cover

# Run specific test
mix test test/my_app_web/controllers/page_controller_test.exs

# Run tests in watch mode (requires mix_test_watch)
mix test.watch
```

## 📚 Resources

- [Elixir Documentation](https://elixir-lang.org/docs.html)
- [Phoenix Framework Guide](https://hexdocs.pm/phoenix/overview.html)
- [Phoenix LiveView](https://hexdocs.pm/phoenix_live_view)
- [Ecto Documentation](https://hexdocs.pm/ecto)
- [Elixir Forum](https://elixirforum.com)

## 🤝 Contributing

This template is part of the Claude Code Templates project. Contributions are welcome!

1. Test the template with your Elixir projects
2. Report issues or suggest improvements
3. Submit PRs with enhancements

## 📄 License

MIT License - Same as the parent Claude Code Templates project.

---

**Note**: This template follows Phoenix conventions and Elixir community best practices. It's designed to accelerate development while maintaining code quality and idiomaticity.