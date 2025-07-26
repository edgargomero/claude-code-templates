# phoenix-context

Generate a Phoenix context with schemas, migrations, and business logic.

## Basic Context Generation

```bash
# Generate a complete context with schema
mix phx.gen.context Accounts User users name:string email:string:unique

# Generate context with relationships
mix phx.gen.context Blog Post posts title:string body:text user_id:references:users

# Generate context with custom types
mix phx.gen.context Shop Product products name:string price:decimal quantity:integer
```

## Advanced Context Example

Create a complete e-commerce context:

```bash
# Generate product context
mix phx.gen.context Catalog Product products \
  name:string \
  description:text \
  price:decimal \
  sku:string:unique \
  stock_quantity:integer \
  status:enum:active:inactive:discontinued

# Generate category with many-to-many
mix phx.gen.context Catalog Category categories \
  name:string \
  slug:string:unique \
  parent_id:references:categories

# Generate join table
mix ecto.gen.migration create_products_categories
```

## Context Module Template

```elixir
defmodule MyApp.Accounts do
  @moduledoc """
  The Accounts context handles user management and authentication.
  """

  import Ecto.Query, warn: false
  alias MyApp.Repo
  alias MyApp.Accounts.User

  @doc """
  Returns the list of users with optional filtering.
  """
  def list_users(opts \\ []) do
    User
    |> apply_filters(opts)
    |> Repo.all()
  end

  @doc """
  Gets a single user by ID or raises if not found.
  """
  def get_user!(id), do: Repo.get!(User, id)

  @doc """
  Gets a user by email.
  """
  def get_user_by_email(email) do
    Repo.get_by(User, email: email)
  end

  @doc """
  Creates a user with the given attributes.
  """
  def create_user(attrs \\ %{}) do
    %User{}
    |> User.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a user.
  """
  def update_user(%User{} = user, attrs) do
    user
    |> User.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a user.
  """
  def delete_user(%User{} = user) do
    Repo.delete(user)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking user changes.
  """
  def change_user(%User{} = user, attrs \\ %{}) do
    User.changeset(user, attrs)
  end

  # Private functions
  defp apply_filters(query, opts) do
    Enum.reduce(opts, query, fn
      {:status, status}, query ->
        from(u in query, where: u.status == ^status)
      
      {:search, term}, query ->
        pattern = "%#{term}%"
        from(u in query, where: ilike(u.name, ^pattern) or ilike(u.email, ^pattern))
      
      _, query ->
        query
    end)
  end
end
```

## Schema Best Practices

```elixir
defmodule MyApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id
  
  schema "users" do
    field :email, :string
    field :name, :string
    field :password, :string, virtual: true, redact: true
    field :password_hash, :string, redact: true
    field :confirmed_at, :naive_datetime
    
    has_many :posts, MyApp.Blog.Post
    
    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name, :password])
    |> validate_required([:email, :name])
    |> validate_email()
    |> validate_password()
    |> unique_constraint(:email)
    |> hash_password()
  end

  defp validate_email(changeset) do
    changeset
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
  end

  defp validate_password(changeset) do
    changeset
    |> validate_length(:password, min: 8, max: 72)
    |> validate_format(:password, ~r/[a-z]/, message: "at least one lower case character")
    |> validate_format(:password, ~r/[A-Z]/, message: "at least one upper case character")
    |> validate_format(:password, ~r/[0-9]/, message: "at least one digit")
  end

  defp hash_password(changeset) do
    password = get_change(changeset, :password)
    
    if password && changeset.valid? do
      changeset
      |> put_change(:password_hash, Bcrypt.hash_pwd_salt(password))
      |> delete_change(:password)
    else
      changeset
    end
  end
end
```

## Testing Contexts

```elixir
defmodule MyApp.AccountsTest do
  use MyApp.DataCase

  alias MyApp.Accounts

  describe "users" do
    alias MyApp.Accounts.User

    import MyApp.AccountsFixtures

    @invalid_attrs %{email: nil, name: nil}

    test "list_users/0 returns all users" do
      user = user_fixture()
      assert Accounts.list_users() == [user]
    end

    test "get_user!/1 returns the user with given id" do
      user = user_fixture()
      assert Accounts.get_user!(user.id) == user
    end

    test "create_user/1 with valid data creates a user" do
      valid_attrs = %{
        email: "test@example.com",
        name: "Test User",
        password: "ValidPass123"
      }

      assert {:ok, %User{} = user} = Accounts.create_user(valid_attrs)
      assert user.email == "test@example.com"
      assert user.name == "Test User"
      assert user.password_hash
    end

    test "create_user/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Accounts.create_user(@invalid_attrs)
    end
  end
end
```

## Common Context Patterns

### Pagination
```elixir
def list_users(params \\ %{}) do
  User
  |> order_by(desc: :inserted_at)
  |> paginate(params)
end

defp paginate(query, %{page: page, page_size: page_size}) do
  offset = (page - 1) * page_size
  
  query
  |> limit(^page_size)
  |> offset(^offset)
  |> Repo.all()
end
```

### Batch Operations
```elixir
def update_users_status(user_ids, status) do
  Ecto.Multi.new()
  |> Ecto.Multi.update_all(:update_all, 
    from(u in User, where: u.id in ^user_ids),
    set: [status: status]
  )
  |> Repo.transaction()
end
```