# CLAUDE.md - Phoenix API Application

This file provides guidance to Claude Code for Phoenix API applications.

## Project Type

This is a Phoenix API application using:
- JSON API endpoints only (no HTML)
- Phoenix Controllers without views
- Ecto for database interactions
- Token-based authentication

## Additional Commands

### Generate JSON Resources
```bash
# Generate JSON API resources
mix phx.gen.json Accounts User users email:string name:string

# Generate without context
mix phx.gen.json Accounts User users email:string --no-context

# Generate with custom route prefix
mix phx.gen.json Shop Product products name:string price:decimal --web Api
```

### API Best Practices

#### Controller Structure
```elixir
defmodule MyAppWeb.Api.UserController do
  use MyAppWeb, :controller

  alias MyApp.Accounts
  alias MyApp.Accounts.User

  action_fallback MyAppWeb.FallbackController

  def index(conn, params) do
    users = Accounts.list_users(params)
    render(conn, :index, users: users)
  end

  def create(conn, %{"user" => user_params}) do
    with {:ok, %User{} = user} <- Accounts.create_user(user_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/users/#{user}")
      |> render(:show, user: user)
    end
  end

  def update(conn, %{"id" => id, "user" => user_params}) do
    user = Accounts.get_user!(id)

    with {:ok, %User{} = user} <- Accounts.update_user(user, user_params) do
      render(conn, :show, user: user)
    end
  end
end
```

#### JSON Views
```elixir
defmodule MyAppWeb.Api.UserJSON do
  alias MyApp.Accounts.User

  def index(%{users: users}) do
    %{data: for(user <- users, do: data(user))}
  end

  def show(%{user: user}) do
    %{data: data(user)}
  end

  defp data(%User{} = user) do
    %{
      id: user.id,
      email: user.email,
      name: user.name,
      inserted_at: user.inserted_at
    }
  end
end
```

### API Authentication

Using Guardian for JWT:
```elixir
# In router.ex
pipeline :api_authenticated do
  plug Guardian.Plug.Pipeline,
    module: MyAppWeb.Guardian,
    error_handler: MyAppWeb.AuthErrorHandler
  plug Guardian.Plug.VerifyHeader, scheme: "Bearer"
  plug Guardian.Plug.LoadResource
end

scope "/api", MyAppWeb.Api, as: :api do
  pipe_through :api

  post "/login", SessionController, :create
  post "/register", RegistrationController, :create
  
  scope "/" do
    pipe_through :api_authenticated
    
    resources "/users", UserController, except: [:new, :edit]
    get "/me", UserController, :current_user
  end
end
```

### Error Handling

```elixir
defmodule MyAppWeb.FallbackController do
  use MyAppWeb, :controller

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    conn
    |> put_status(:unprocessable_entity)
    |> put_view(json: MyAppWeb.ChangesetJSON)
    |> render(:error, changeset: changeset)
  end

  def call(conn, {:error, :not_found}) do
    conn
    |> put_status(:not_found)
    |> put_view(json: MyAppWeb.ErrorJSON)
    |> render(:"404")
  end

  def call(conn, {:error, :unauthorized}) do
    conn
    |> put_status(:unauthorized)
    |> put_view(json: MyAppWeb.ErrorJSON)
    |> render(:"401")
  end
end
```

### API Documentation

Consider using:
- OpenAPI/Swagger with `open_api_spex`
- API Blueprint
- GraphQL with Absinthe (alternative to REST)

### CORS Configuration

```elixir
# In endpoint.ex
plug CORSPlug,
  origin: ["http://localhost:3000", "https://myapp.com"],
  credentials: true,
  headers: ["Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"]
```

## Testing Approach

Focus on:
- Controller tests with JSON assertions
- Authentication/authorization tests
- API integration tests
- Response format validation
- Rate limiting tests