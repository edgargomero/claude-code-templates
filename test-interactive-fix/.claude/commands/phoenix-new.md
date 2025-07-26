# phoenix-new

Create a new Phoenix project with optimized configuration and best practices.

## Basic Usage

```bash
# Standard web application with LiveView
mix phx.new my_app --live

# API-only application  
mix phx.new my_app --no-html --no-assets

# Umbrella application for microservices
mix phx.new my_app --umbrella
```

## Complete Setup Script

```bash
# Create project with binary IDs and LiveView
mix phx.new {{project_name}} --live --binary-id

# Navigate to project
cd {{project_name}}

# Install dependencies
mix deps.get

# Create and migrate database
mix ecto.create
mix ecto.migrate

# Install Node dependencies (if not API-only)
cd assets && npm install && cd ..

# Start Phoenix server
mix phx.server
```

## Add Essential Dependencies

Add these to your `mix.exs` deps:

```elixir
defp deps do
  [
    # Existing deps...
    
    # Code Quality
    {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
    {:dialyxir, "~> 1.4", only: [:dev, :test], runtime: false},
    {:sobelow, "~> 0.13", only: [:dev, :test], runtime: false},
    
    # Testing
    {:ex_machina, "~> 2.7", only: :test},
    {:faker, "~> 0.17", only: :test},
    {:wallaby, "~> 0.30", only: :test, runtime: false},
    
    # Development
    {:phoenix_live_reload, "~> 1.4", only: :dev},
    {:ex_doc, "~> 0.30", only: :dev, runtime: false},
    
    # Production
    {:oban, "~> 2.17"},
    {:telemetry_metrics, "~> 0.6"},
    {:telemetry_poller, "~> 1.0"}
  ]
end
```

## Configuration Files

### .formatter.exs
```elixir
[
  import_deps: [:ecto, :ecto_sql, :phoenix],
  subdirectories: ["priv/*/migrations"],
  plugins: [Phoenix.LiveView.HTMLFormatter],
  inputs: ["*.{heex,ex,exs}", "{config,lib,test}/**/*.{heex,ex,exs}"]
]
```

### .credo.exs
```elixir
%{
  configs: [
    %{
      name: "default",
      files: %{
        included: ["lib/", "test/"],
        excluded: [~r"/_build/", ~r"/deps/"]
      },
      strict: true,
      color: true,
      checks: [
        {Credo.Check.Readability.MaxLineLength, max_length: 100}
      ]
    }
  ]
}
```

## Project Structure

After running this command, you'll have:

```
my_app/
├── assets/          # Frontend assets (JS, CSS)
├── config/          # Application configuration
├── lib/
│   ├── my_app/      # Business logic (contexts)
│   └── my_app_web/  # Web layer (controllers, views, templates)
├── priv/            # Static files and migrations
├── test/            # Test files
└── mix.exs          # Project configuration
```

## Next Steps

1. Configure your database in `config/dev.exs`
2. Set up your first context: `/phoenix-context`
3. Add authentication: `/phoenix-auth`
4. Create your first LiveView: `/phoenix-liveview`