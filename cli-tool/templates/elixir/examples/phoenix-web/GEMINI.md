# GEMINI.md - Phoenix Web Application

This file provides guidance to Gemini for Phoenix web applications with traditional server-rendered views.

## Project Type

This is a Phoenix web application using:
- Server-rendered HTML templates with HEEx
- Phoenix Controllers and Views
- Ecto for database interactions
- Traditional request/response cycle

## Additional Commands

### Generate HTML Resources
```bash
# Generate complete HTML scaffold
mix phx.gen.html Blog Article articles title:string body:text author:string

# Generate without context
mix phx.gen.html Blog Article articles title:string --no-context

# Generate nested resources
mix phx.gen.html Blog Comment comments body:text article_id:references:articles
```

### Template Management
- Use `~H` sigil for HEEx templates
- Leverage Phoenix.Component for reusable UI
- Use `assigns` for passing data to templates
- Implement view helpers in view modules

### Controller Best Practices
```elixir
defmodule MyAppWeb.ArticleController do
  use MyAppWeb, :controller
  
  alias MyApp.Blog
  alias MyApp.Blog.Article

  def index(conn, params) do
    articles = Blog.list_articles(params)
    render(conn, :index, articles: articles)
  end

  def new(conn, _params) do
    changeset = Blog.change_article(%Article{})
    render(conn, :new, changeset: changeset)
  end

  def create(conn, %{"article" => article_params}) do
    case Blog.create_article(article_params) do
      {:ok, article} ->
        conn
        |> put_flash(:info, "Article created successfully.")
        |> redirect(to: ~p"/articles/#{article}")

      {:error, %Ecto.Changeset{} = changeset} ->
        render(conn, :new, changeset: changeset)
    end
  end
end
```

### Form Helpers
```elixir
<.form :let={f} for={@changeset} action={~p"/articles"}>
  <.input field={f[:title]} type="text" label="Title" />
  <.input field={f[:body]} type="textarea" label="Body" />
  <.button>Save Article</.button>
</.form>
```

## Testing Approach

Focus on:
- Controller tests for request/response cycle
- View tests for helper functions
- Integration tests for user flows
- Template compilation tests
