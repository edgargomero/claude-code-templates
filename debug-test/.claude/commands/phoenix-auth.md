# phoenix-auth

Implement authentication in your Phoenix application using the official auth generator or custom solutions.

## Phoenix Auth Generator (Recommended)

```bash
# Generate complete authentication system
mix phx.gen.auth Accounts User users

# This creates:
# - User schema with email/password
# - Registration, login, and password reset
# - Session management
# - Email confirmation
# - LiveView components
```

## What Gets Generated

```
lib/my_app/
├── accounts/
│   ├── user.ex              # User schema
│   ├── user_token.ex        # Token management
│   └── user_notifier.ex     # Email notifications
lib/my_app_web/
├── controllers/
│   ├── user_auth.ex         # Authentication plug
│   ├── user_confirmation_*.ex
│   ├── user_registration_*.ex
│   ├── user_reset_password_*.ex
│   ├── user_session_*.ex
│   └── user_settings_*.ex
├── live/
│   └── user_*_live.ex       # LiveView components
└── templates/
    └── user_*_html/         # HTML templates
```

## Customizing Generated Auth

### Add Additional Fields

```elixir
# In the migration file
add :username, :string
add :full_name, :string
add :role, :string, default: "user"
add :avatar_url, :string

# Add unique index
create unique_index(:users, [:username])
```

### Update User Schema

```elixir
defmodule MyApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :email, :string
    field :password, :string, virtual: true, redact: true
    field :hashed_password, :string, redact: true
    field :confirmed_at, :naive_datetime
    
    # Custom fields
    field :username, :string
    field :full_name, :string
    field :role, :string, default: "user"
    field :avatar_url, :string

    timestamps()
  end

  def registration_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [:email, :password, :username, :full_name])
    |> validate_required([:email, :password, :username])
    |> validate_username()
    |> validate_email(opts)
    |> validate_password(opts)
  end

  defp validate_username(changeset) do
    changeset
    |> validate_length(:username, min: 3, max: 20)
    |> validate_format(:username, ~r/^[a-zA-Z0-9_]+$/, 
        message: "only letters, numbers, and underscores allowed")
    |> unique_constraint(:username)
  end
end
```

## Role-Based Authorization

### Add Authorization Plug

```elixir
defmodule MyAppWeb.UserAuth do
  # ... existing code ...

  def require_admin_user(conn, _opts) do
    user = conn.assigns[:current_user]

    if user && user.role == "admin" do
      conn
    else
      conn
      |> put_flash(:error, "You must be an admin to access this page.")
      |> redirect(to: "/")
      |> halt()
    end
  end

  def require_authenticated_user(conn, _opts) do
    if conn.assigns[:current_user] do
      conn
    else
      conn
      |> put_flash(:error, "You must log in to access this page.")
      |> put_session(:user_return_to, current_path(conn))
      |> redirect(to: ~p"/users/log_in")
      |> halt()
    end
  end
end
```

### Use in Router

```elixir
# lib/my_app_web/router.ex
defmodule MyAppWeb.Router do
  use MyAppWeb, :router

  import MyAppWeb.UserAuth

  # Public routes
  scope "/", MyAppWeb do
    pipe_through [:browser]

    get "/", PageController, :home
  end

  # Authentication routes
  scope "/", MyAppWeb do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    live_session :redirect_if_user_is_authenticated,
      on_mount: [{MyAppWeb.UserAuth, :redirect_if_user_is_authenticated}] do
      live "/users/register", UserRegistrationLive, :new
      live "/users/log_in", UserLoginLive, :new
      live "/users/reset_password", UserForgotPasswordLive, :new
      live "/users/reset_password/:token", UserResetPasswordLive, :edit
    end

    post "/users/log_in", UserSessionController, :create
  end

  # Authenticated routes
  scope "/", MyAppWeb do
    pipe_through [:browser, :require_authenticated_user]

    live_session :require_authenticated_user,
      on_mount: [{MyAppWeb.UserAuth, :ensure_authenticated}] do
      live "/users/settings", UserSettingsLive, :edit
      live "/users/settings/confirm_email/:token", UserSettingsLive, :confirm_email
      
      # Your authenticated routes
      live "/dashboard", DashboardLive, :index
      live "/profile", ProfileLive, :show
    end
  end

  # Admin routes
  scope "/admin", MyAppWeb.Admin, as: :admin do
    pipe_through [:browser, :require_authenticated_user, :require_admin_user]

    live "/", DashboardLive, :index
    live "/users", UserLive.Index, :index
    live "/users/:id", UserLive.Show, :show
  end
end
```

## Social Authentication (OAuth)

### Using Ueberauth

```elixir
# mix.exs
defp deps do
  [
    {:ueberauth, "~> 0.10"},
    {:ueberauth_github, "~> 0.8"},
    {:ueberauth_google, "~> 0.10"}
  ]
end

# config/config.exs
config :ueberauth, Ueberauth,
  providers: [
    github: {Ueberauth.Strategy.Github, [default_scope: "user:email"]},
    google: {Ueberauth.Strategy.Google, [default_scope: "email profile"]}
  ]

config :ueberauth, Ueberauth.Strategy.Github.OAuth,
  client_id: System.get_env("GITHUB_CLIENT_ID"),
  client_secret: System.get_env("GITHUB_CLIENT_SECRET")
```

### OAuth Controller

```elixir
defmodule MyAppWeb.AuthController do
  use MyAppWeb, :controller
  plug Ueberauth

  alias MyApp.Accounts
  alias MyAppWeb.UserAuth

  def callback(%{assigns: %{ueberauth_auth: auth}} = conn, _params) do
    case Accounts.find_or_create_user_from_oauth(auth) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "Successfully authenticated")
        |> UserAuth.log_in_user(user)

      {:error, reason} ->
        conn
        |> put_flash(:error, reason)
        |> redirect(to: "/")
    end
  end

  def callback(%{assigns: %{ueberauth_failure: _fails}} = conn, _params) do
    conn
    |> put_flash(:error, "Failed to authenticate")
    |> redirect(to: "/")
  end
end
```

## API Authentication with Guardian

```elixir
# mix.exs
defp deps do
  [
    {:guardian, "~> 2.3"},
    {:guardian_phoenix, "~> 2.0"}
  ]
end

# lib/my_app_web/guardian.ex
defmodule MyAppWeb.Guardian do
  use Guardian, otp_app: :my_app

  alias MyApp.Accounts

  def subject_for_token(%{id: id}, _claims) do
    {:ok, to_string(id)}
  end

  def resource_from_claims(%{"sub" => id}) do
    case Accounts.get_user(id) do
      nil -> {:error, :resource_not_found}
      user -> {:ok, user}
    end
  end
end

# lib/my_app_web/auth_pipeline.ex
defmodule MyAppWeb.AuthPipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :my_app,
    module: MyAppWeb.Guardian,
    error_handler: MyAppWeb.AuthErrorHandler

  plug Guardian.Plug.VerifyHeader, scheme: "Bearer"
  plug Guardian.Plug.LoadResource, allow_blank: true
end
```

## Testing Authentication

```elixir
defmodule MyAppWeb.UserAuthTest do
  use MyAppWeb.ConnCase, async: true

  alias MyApp.Accounts
  import MyApp.AccountsFixtures

  setup %{conn: conn} do
    conn =
      conn
      |> Map.replace!(:secret_key_base, MyAppWeb.Endpoint.config(:secret_key_base))
      |> init_test_session(%{})

    %{user: user_fixture(), conn: conn}
  end

  describe "log_in_user/3" do
    test "stores the user token in the session", %{conn: conn, user: user} do
      conn = UserAuth.log_in_user(conn, user)
      assert token = get_session(conn, :user_token)
      assert get_session(conn, :live_socket_id) == "users_sessions:#{Base.url_encode64(token)}"
      assert redirected_to(conn) == ~p"/"
      assert Accounts.get_user_by_session_token(token)
    end
  end

  describe "require_authenticated_user/2" do
    test "redirects if user is not authenticated", %{conn: conn} do
      conn = conn |> fetch_flash() |> UserAuth.require_authenticated_user([])
      assert conn.halted
      assert redirected_to(conn) == ~p"/users/log_in"
      assert get_flash(conn, :error) == "You must log in to access this page."
    end

    test "does not redirect if user is authenticated", %{conn: conn, user: user} do
      conn = conn |> log_in_user(user) |> UserAuth.require_authenticated_user([])
      refute conn.halted
      assert conn.assigns.current_user.id == user.id
    end
  end
end
```