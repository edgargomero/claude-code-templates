# phoenix-deploy

Deploy your Phoenix application to production using various platforms and strategies.

## Build Release

```bash
# Set production environment
export MIX_ENV=prod

# Get dependencies
mix deps.get --only prod

# Compile
mix compile

# Compile assets
mix assets.deploy

# Create release
mix release
```

## Configuration for Production

### config/runtime.exs

```elixir
import Config

if config_env() == :prod do
  database_url =
    System.get_env("DATABASE_URL") ||
      raise """
      environment variable DATABASE_URL is missing.
      For example: ecto://USER:PASS@HOST/DATABASE
      """

  maybe_ipv6 = if System.get_env("ECTO_IPV6"), do: [:inet6], else: []

  config :my_app, MyApp.Repo,
    url: database_url,
    pool_size: String.to_integer(System.get_env("POOL_SIZE") || "10"),
    socket_options: maybe_ipv6

  secret_key_base =
    System.get_env("SECRET_KEY_BASE") ||
      raise """
      environment variable SECRET_KEY_BASE is missing.
      You can generate one by calling: mix phx.gen.secret
      """

  host = System.get_env("PHX_HOST") || "example.com"
  port = String.to_integer(System.get_env("PORT") || "4000")

  config :my_app, MyAppWeb.Endpoint,
    url: [host: host, port: 443, scheme: "https"],
    http: [
      ip: {0, 0, 0, 0, 0, 0, 0, 0},
      port: port
    ],
    secret_key_base: secret_key_base
end
```

## Dockerfile for Containerized Deployment

```dockerfile
# Dockerfile
ARG ELIXIR_VERSION=1.15.7
ARG OTP_VERSION=26.0.2
ARG DEBIAN_VERSION=bullseye-20231009-slim

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

FROM ${BUILDER_IMAGE} as builder

# Install build dependencies
RUN apt-get update -y && apt-get install -y build-essential git nodejs npm \
    && apt-get clean && rm -f /var/lib/apt/lists/*_*

WORKDIR /app

# Install hex + rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Set build ENV
ENV MIX_ENV="prod"

# Install mix dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only $MIX_ENV
RUN mkdir config

# Copy compile-time config files
COPY config/config.exs config/${MIX_ENV}.exs config/
RUN mix deps.compile

COPY priv priv
COPY lib lib
COPY assets assets

# Compile assets
RUN mix assets.deploy

# Compile the release
RUN mix compile

# Changes to config/runtime.exs don't require recompiling the code
COPY config/runtime.exs config/
COPY rel rel
RUN mix release

# Start a new build stage
FROM ${RUNNER_IMAGE}

RUN apt-get update -y && apt-get install -y libstdc++6 openssl libncurses5 locales \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

# Set the locale
RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US:en
ENV LC_ALL en_US.UTF-8

WORKDIR "/app"
RUN chown nobody /app

# Set runner ENV
ENV MIX_ENV="prod"

# Copy the release
COPY --from=builder --chown=nobody:root /app/_build/${MIX_ENV}/rel/my_app ./

USER nobody

CMD ["/app/bin/server"]
```

## Deploy to Fly.io

```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Launch app (first time)
fly launch

# Deploy
fly deploy

# Set secrets
fly secrets set SECRET_KEY_BASE=$(mix phx.gen.secret)
```

### fly.toml Configuration

```toml
app = "my-app"
primary_region = "dfw"
kill_signal = "SIGTERM"
kill_timeout = 5

[env]
  PHX_HOST = "my-app.fly.dev"

[experimental]
  auto_rollback = true

[deploy]
  release_command = "/app/bin/migrate"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true
  min_machines_running = 0

[[services]]
  http_checks = []
  internal_port = 8080
  protocol = "tcp"
  script_checks = []

  [[services.http_checks]]
    grace_period = "1s"
    interval = "15s"
    method = "get"
    path = "/health"
    protocol = "http"
    timeout = "2s"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443
```

## Deploy to Gigalixir

```bash
# Install Gigalixir CLI
pip3 install gigalixir

# Create app
gigalixir create -n my-app

# Create database
gigalixir pg:create --free

# Set buildpacks
echo "elixir_version=1.15.7" > elixir_buildpack.config
echo "erlang_version=26.0" >> elixir_buildpack.config
echo "node_version=18.17.0" > phoenix_static_buildpack.config

# Deploy
git push gigalixir main

# Run migrations
gigalixir run mix ecto.migrate
```

## Deploy to Heroku

```bash
# Create Heroku app
heroku create my-app

# Add buildpacks
heroku buildpacks:add hashnuke/elixir
heroku buildpacks:add https://github.com/gjaldon/heroku-buildpack-phoenix-static.git

# Add Postgres
heroku addons:create heroku-postgresql:mini

# Set config vars
heroku config:set SECRET_KEY_BASE=$(mix phx.gen.secret)
heroku config:set PHX_HOST=my-app.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run "POOL_SIZE=2 mix ecto.migrate"
```

### Procfile

```
web: mix phx.server
release: mix ecto.migrate
```

## Deploy with Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: my_app_prod
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  app:
    build: .
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: ecto://postgres:postgres@db/my_app_prod
      SECRET_KEY_BASE: ${SECRET_KEY_BASE}
      PHX_HOST: ${PHX_HOST:-localhost}
      PORT: 4000
    ports:
      - "4000:4000"
    command: /app/bin/server

volumes:
  postgres_data:
```

## Deploy to VPS (Ubuntu/Debian)

```bash
# On your VPS
# Install dependencies
sudo apt update
sudo apt install -y postgresql postgresql-contrib nginx certbot python3-certbot-nginx

# Create deploy user
sudo adduser deploy
sudo usermod -aG sudo deploy

# Install ASDF for Elixir/Erlang
su - deploy
git clone https://github.com/asdf-vm/asdf.git ~/.asdf
echo '. $HOME/.asdf/asdf.sh' >> ~/.bashrc
source ~/.bashrc

# Install Erlang/Elixir
asdf plugin add erlang
asdf plugin add elixir
asdf install erlang 26.0
asdf install elixir 1.15.7
asdf global erlang 26.0
asdf global elixir 1.15.7

# Setup systemd service
sudo nano /etc/systemd/system/my_app.service
```

### Systemd Service File

```ini
[Unit]
Description=My App
After=network.target

[Service]
Type=simple
User=deploy
Group=deploy
WorkingDirectory=/home/deploy/my_app
ExecStart=/home/deploy/my_app/bin/server
Restart=on-failure
RestartSec=5
Environment=LANG=en_US.UTF-8
Environment=MIX_ENV=prod
Environment=PORT=4000
EnvironmentFile=/home/deploy/my_app/.env

[Install]
WantedBy=multi-user.target
```

### Nginx Configuration

```nginx
upstream phoenix {
  server 127.0.0.1:4000 max_fails=5 fail_timeout=60s;
}

server {
  listen 80;
  server_name example.com;

  location / {
    proxy_http_version 1.1;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_pass http://phoenix;
  }
}
```

## Release Tasks

```elixir
# lib/my_app/release.ex
defmodule MyApp.Release do
  @app :my_app

  def migrate do
    load_app()

    for repo <- repos() do
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end
  end

  def rollback(repo, version) do
    load_app()
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :down, to: version))
  end

  defp repos do
    Application.fetch_env!(@app, :ecto_repos)
  end

  defp load_app do
    Application.load(@app)
  end
end

# In rel/overlays/bin/migrate
#!/bin/sh
cd -P -- "$(dirname -- "$0")"
exec ./my_app eval "MyApp.Release.migrate()"
```

## Health Check Endpoint

```elixir
defmodule MyAppWeb.HealthController do
  use MyAppWeb, :controller

  def index(conn, _params) do
    json(conn, %{
      status: "ok",
      version: Application.spec(:my_app, :vsn),
      node: node()
    })
  end
end
```