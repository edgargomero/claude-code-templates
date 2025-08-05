# GEMINI.md

This file provides guidance to Gemini when working with code in this repository.

## Project Overview

This is an Elixir/Phoenix project optimized for modern web development with real-time features. The project uses OTP principles and follows Phoenix conventions for scalable application development.

## Development Commands

### Environment Management
- `mix local.hex --force` - Install Hex package manager
- `mix archive.install hex phx_new` - Install Phoenix project generator
- `mix deps.get` - Install dependencies
- `mix deps.compile` - Compile dependencies
- `mix ecto.setup` - Create and migrate database
- `iex -S mix` - Start interactive Elixir shell with project

### Phoenix Commands
- `mix phx.server` - Start Phoenix server
- `mix phx.routes` - List all routes
- `mix phx.gen.context` - Generate a context
- `mix phx.gen.html` - Generate HTML resources
- `mix phx.gen.json` - Generate JSON resources
- `mix phx.gen.live` - Generate LiveView resources
- `mix phx.gen.auth` - Generate authentication system

### Database Commands
- `mix ecto.create` - Create database
- `mix ecto.migrate` - Run migrations
- `mix ecto.rollback` - Rollback last migration
- `mix ecto.reset` - Drop, create, and migrate database
- `mix ecto.gen.migration` - Generate a new migration
- `mix ecto.setup` - Create, migrate, and seed database

### Testing Commands
- `mix test` - Run all tests
- `mix test --cover` - Run tests with coverage report
- `mix test --trace` - Run tests with detailed output
- `mix test --stale` - Run only modified tests
- `mix test.watch` - Run tests in watch mode (requires mix_test_watch)
- `mix test path/to/test.exs` - Run specific test file
- `mix test path/to/test.exs:42` - Run specific test at line

### Code Quality Commands
- `mix format` - Format code
- `mix format --check-formatted` - Check code formatting
- `mix credo` - Run static code analysis
- `mix credo --strict` - Run strict code analysis
- `mix dialyzer` - Run type checking (requires dialyxir)
- `mix compile --warnings-as-errors` - Compile with warnings as errors

### Build & Release Commands
- `mix compile` - Compile the project
- `mix clean` - Clean build artifacts
- `mix release` - Build a release
- `mix phx.digest` - Digest static assets
- `mix assets.deploy` - Deploy assets (compile & digest)

### Development Tools
- `iex -S mix phx.server` - Start server with interactive shell
- `mix do cmd1, cmd2` - Run multiple commands
- `mix help` - Show all available tasks
- `mix docs` - Generate documentation (requires ex_doc)

## Technology Stack

### Core Technologies
- **Elixir** - Functional programming language (1.14+)
- **Erlang/OTP** - Runtime and platform (25+)
- **Phoenix Framework** - Web framework (1.7+)
- **Ecto** - Database wrapper and query generator
- **PostgreSQL** - Primary database

### Frontend Technologies
- **Phoenix LiveView** - Rich, interactive web apps without JavaScript
- **Phoenix Components** - Reusable UI components
- **Tailwind CSS** - Utility-first CSS framework
- **Alpine.js** - Lightweight JavaScript framework
- **esbuild** - Fast JavaScript bundler

### Testing Frameworks
- **ExUnit** - Built-in testing framework
- **ExMachina** - Test data generation
- **Wallaby** - Browser-based feature tests
- **Mox** - Mocking library
- **Phoenix.Test** - Phoenix testing helpers

### Code Quality Tools
- **Credo** - Static code analysis
- **Dialyxir** - Static type analysis
- **ExCoveralls** - Code coverage reports
- **Sobelow** - Security-focused static analysis
- **mix format** - Built-in code formatter

### Common Libraries
- **Guardian** - Authentication
- **Pow** - Authentication and user management
- **Oban** - Background job processing
- **Bamboo/Swoosh** - Email delivery
- **Absinthe** - GraphQL implementation
- **Tesla** - HTTP client
- **Timex** - Date/time handling

## Project Structure Guidelines

### File Organization
```
lib/
├── my_app/                 # Business logic (contexts)
│   ├── accounts/          # Account context
│   │   ├── user.ex       # User schema
│   │   └── account.ex    # Context module
│   ├── blog/             # Blog context
│   │   ├── post.ex       # Post schema
│   │   └── blog.ex       # Context module
│   └── application.ex     # Application supervisor
├── my_app_web/            # Web interface
│   ├── components/        # Reusable components
│   ├── controllers/       # HTTP controllers
│   ├── live/             # LiveView modules
│   ├── views/            # View modules
│   ├── templates/        # EEx templates
│   ├── router.ex         # Routes definition
│   └── endpoint.ex       # HTTP endpoint config
priv/
├── repo/                  # Database related
│   ├── migrations/       # Database migrations
│   └── seeds.exs         # Seed data
├── static/               # Static assets
└── gettext/              # Translations
test/
├── my_app/               # Business logic tests
├── my_app_web/           # Web interface tests
├── support/              # Test helpers
└── test_helper.exs       # Test configuration
config/
├── config.exs            # Base configuration
├── dev.exs              # Development config
├── test.exs             # Test config
├── prod.exs             # Production config
└── runtime.exs          # Runtime configuration
```

### Naming Conventions
- **Modules**: Use CamelCase (`MyApp.Accounts.User`)
- **Files**: Use snake_case (`user_controller.ex`)
- **Functions**: Use snake_case (`get_user_by_email/1`)
- **Variables**: Use snake_case (`user_name`)
- **Atoms**: Use snake_case (`:ok`, `:error`)
- **Constants**: Module attributes (`@timeout 5_000`)

## Elixir/Phoenix Guidelines

### Context Design
- Use contexts to group related functionality
- Keep controllers thin, contexts fat
- Contexts should not know about web layer
- Use Ecto.Multi for complex transactions
- Implement query functions in context modules

### Schema Best Practices
- Use binary_id for UUID primary keys
- Add appropriate indexes for queries
- Use embedded schemas for nested data
- Implement changeset validations
- Use Ecto.Enum for predefined values

### LiveView Patterns
- Use live_components for reusable UI
- Implement handle_event callbacks properly
- Minimize data sent over the wire
- Use temporary assigns for large lists
- Properly scope live_patch vs live_redirect

### Testing Standards
- Write tests for all public functions
- Use ExMachina factories for test data
- Test contexts independently from web layer
- Use async: true when possible
- Mock external services with Mox

### Performance Optimization
- Use ETS for caching when appropriate
- Implement database query optimization
- Use Task.async for concurrent operations
- Profile with :observer and :recon
- Monitor with Telemetry

## Security Guidelines

### Authentication & Authorization
- Use proven libraries (Guardian, Pow)
- Implement proper session management
- Hash passwords with Argon2 or Bcrypt
- Use CSRF protection
- Implement rate limiting

### Data Protection
- Validate all user inputs
- Use parameterized queries (Ecto does this)
- Sanitize HTML output
- Implement Content Security Policy
- Use HTTPS in production

## Development Workflow

### Before Starting
1. Ensure Elixir/Erlang versions match requirements
2. Install PostgreSQL and start service
3. Run `mix setup` to initialize project
4. Copy `.env.example` to `.env` if using environment variables

### During Development
1. Run `mix phx.server` or `iex -S mix phx.server`
2. Access application at http://localhost:4000
3. Use `mix format` before committing
4. Run `mix credo --strict` for code quality
5. Write tests for new features

### Before Committing
1. Run `mix format --check-formatted`
2. Run `mix credo --strict`
3. Run `mix test`
4. Run `mix dialyzer` if configured
5. Ensure all tests pass

## Deployment Guidelines

### Release Preparation
- Use `mix release` for deployment
- Configure runtime.exs for production
- Set up environment variables
- Compile assets with `mix assets.deploy`

### Production Considerations
- Use connection pooling for database
- Configure proper VM settings
- Set up clustering if needed
- Implement health checks
- Configure logging and monitoring

## Common Issues and Solutions

### Compilation Errors
- Run `mix clean` and recompile
- Check for circular dependencies
- Ensure all modules are properly aliased

### Database Issues
- Verify PostgreSQL is running
- Check database credentials in config
- Run `mix ecto.reset` for fresh start

### Test Failures
- Clear test database: `MIX_ENV=test mix ecto.reset`
- Check for test pollution
- Use `async: false` for database-dependent tests

### Performance Issues
- Profile with `:observer.start()`
- Check database query performance
- Review LiveView data transfer
- Optimize GenServer state size
