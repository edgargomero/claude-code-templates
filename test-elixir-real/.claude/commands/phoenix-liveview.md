# phoenix-liveview

Create Phoenix LiveView modules for real-time, interactive web applications without JavaScript.

## Generate LiveView Resources

```bash
# Generate complete LiveView CRUD
mix phx.gen.live Accounts User users name:string email:string:unique role:enum:admin:user

# Generate without context (existing schema)
mix phx.gen.live Catalog Product products name:string price:decimal --no-context

# Generate nested resources
mix phx.gen.live Blog Comment comments body:text post_id:references:posts
```

## Basic LiveView Module

```elixir
defmodule MyAppWeb.PageLive do
  use MyAppWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, 
     socket
     |> assign(:page_title, "Welcome")
     |> assign(:counter, 0)}
  end

  @impl true
  def handle_event("increment", _params, socket) do
    {:noreply, update(socket, :counter, &(&1 + 1))}
  end

  @impl true
  def handle_event("decrement", _params, socket) do
    {:noreply, update(socket, :counter, &(&1 - 1))}
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold mb-4"><%= @page_title %></h1>
      
      <div class="flex items-center gap-4">
        <button phx-click="decrement" class="btn btn-secondary">-</button>
        <span class="text-2xl font-semibold"><%= @counter %></span>
        <button phx-click="increment" class="btn btn-primary">+</button>
      </div>
    </div>
    """
  end
end
```

## Advanced LiveView with Real-time Updates

```elixir
defmodule MyAppWeb.DashboardLive do
  use MyAppWeb, :live_view
  
  alias MyApp.Analytics
  alias Phoenix.PubSub

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      # Subscribe to real-time updates
      PubSub.subscribe(MyApp.PubSub, "analytics:updates")
      
      # Schedule periodic updates
      :timer.send_interval(5000, self(), :update_metrics)
    end

    {:ok,
     socket
     |> assign(:metrics, Analytics.get_current_metrics())
     |> assign(:users_online, 0)
     |> assign(:chart_data, %{})}
  end

  @impl true
  def handle_info({:analytics_update, metrics}, socket) do
    {:noreply, assign(socket, :metrics, metrics)}
  end

  @impl true
  def handle_info(:update_metrics, socket) do
    metrics = Analytics.get_current_metrics()
    {:noreply, assign(socket, :metrics, metrics)}
  end

  @impl true
  def handle_event("refresh", _params, socket) do
    metrics = Analytics.get_current_metrics()
    {:noreply, 
     socket
     |> assign(:metrics, metrics)
     |> put_flash(:info, "Dashboard refreshed")}
  end
end
```

## LiveView Form Handling

```elixir
defmodule MyAppWeb.UserLive.FormComponent do
  use MyAppWeb, :live_component

  alias MyApp.Accounts

  @impl true
  def render(assigns) do
    ~H"""
    <div>
      <.header>
        <%= @title %>
        <:subtitle>Use this form to manage user records</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="user-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
      >
        <.input field={@form[:name]} type="text" label="Name" />
        <.input field={@form[:email]} type="email" label="Email" />
        <.input field={@form[:role]} type="select" label="Role" options={["admin", "user"]} />
        
        <:actions>
          <.button phx-disable-with="Saving...">Save User</.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{user: user} = assigns, socket) do
    changeset = Accounts.change_user(user)

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"user" => user_params}, socket) do
    changeset =
      socket.assigns.user
      |> Accounts.change_user(user_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  @impl true
  def handle_event("save", %{"user" => user_params}, socket) do
    save_user(socket, socket.assigns.action, user_params)
  end

  defp save_user(socket, :edit, user_params) do
    case Accounts.update_user(socket.assigns.user, user_params) do
      {:ok, user} ->
        notify_parent({:saved, user})

        {:noreply,
         socket
         |> put_flash(:info, "User updated successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_user(socket, :new, user_params) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        notify_parent({:saved, user})

        {:noreply,
         socket
         |> put_flash(:info, "User created successfully")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp assign_form(socket, %Ecto.Changeset{} = changeset) do
    assign(socket, :form, to_form(changeset))
  end

  defp notify_parent(msg), do: send(self(), {__MODULE__, msg})
end
```

## LiveView with Streams (Efficient Lists)

```elixir
defmodule MyAppWeb.PostsLive do
  use MyAppWeb, :live_view

  alias MyApp.Blog

  @impl true
  def mount(_params, _session, socket) do
    {:ok,
     socket
     |> stream(:posts, Blog.list_posts())
     |> assign(:form, to_form(%{}))}
  end

  @impl true
  def handle_event("delete", %{"id" => id}, socket) do
    post = Blog.get_post!(id)
    {:ok, _} = Blog.delete_post(post)

    {:noreply, stream_delete(socket, :posts, post)}
  end

  @impl true
  def handle_event("create", %{"post" => post_params}, socket) do
    case Blog.create_post(post_params) do
      {:ok, post} ->
        {:noreply,
         socket
         |> stream_insert(:posts, post, at: 0)
         |> assign(:form, to_form(%{}))
         |> put_flash(:info, "Post created!")}

      {:error, changeset} ->
        {:noreply, assign(socket, :form, to_form(changeset))}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <div class="posts-container">
      <.form for={@form} phx-submit="create">
        <.input field={@form[:title]} placeholder="Title" />
        <.input field={@form[:body]} type="textarea" placeholder="Content" />
        <.button>Create Post</.button>
      </.form>

      <div id="posts" phx-update="stream" class="mt-4 space-y-4">
        <div :for={{dom_id, post} <- @streams.posts} id={dom_id} class="post-card">
          <h3><%= post.title %></h3>
          <p><%= post.body %></p>
          <.link phx-click="delete" phx-value-id={post.id} data-confirm="Are you sure?">
            Delete
          </.link>
        </div>
      </div>
    </div>
    """
  end
end
```

## LiveView JavaScript Hooks

```javascript
// assets/js/hooks.js
let Hooks = {}

Hooks.InfiniteScroll = {
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        this.pushEvent("load-more", {})
      }
    })
    this.observer.observe(this.el)
  },
  destroyed() {
    this.observer.disconnect()
  }
}

Hooks.Chart = {
  mounted() {
    const ctx = this.el.getContext('2d')
    const data = JSON.parse(this.el.dataset.chartData)
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    })
  },
  updated() {
    const data = JSON.parse(this.el.dataset.chartData)
    this.chart.data = data
    this.chart.update()
  }
}

export default Hooks
```

## LiveView Testing

```elixir
defmodule MyAppWeb.PageLiveTest do
  use MyAppWeb.ConnCase

  import Phoenix.LiveViewTest

  test "displays welcome message", %{conn: conn} do
    {:ok, _view, html} = live(conn, "/")
    assert html =~ "Welcome"
  end

  test "increments counter", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/")
    
    assert render_click(view, :increment) =~ "1"
    assert render_click(view, :increment) =~ "2"
  end

  test "creates a new post", %{conn: conn} do
    {:ok, view, _html} = live(conn, "/posts")
    
    assert view
           |> form("#post-form", post: %{title: "Test", body: "Content"})
           |> render_submit() =~ "Test"
  end
end
```

## Router Configuration

```elixir
# lib/my_app_web/router.ex
scope "/", MyAppWeb do
  pipe_through :browser

  live "/", PageLive, :index
  live "/dashboard", DashboardLive, :index
  
  live "/users", UserLive.Index, :index
  live "/users/new", UserLive.Index, :new
  live "/users/:id/edit", UserLive.Index, :edit
  live "/users/:id", UserLive.Show, :show
  live "/users/:id/show/edit", UserLive.Show, :edit
end
```