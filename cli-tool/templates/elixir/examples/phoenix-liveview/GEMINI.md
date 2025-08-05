# GEMINI.md - Phoenix LiveView Application

This file provides guidance to Gemini for Phoenix LiveView applications with real-time, interactive features.

## Project Type

This is a Phoenix LiveView application using:
- LiveView for real-time server-rendered UI
- Minimal JavaScript (only for hooks)
- Phoenix PubSub for real-time updates
- LiveComponents for reusable UI

## Additional Commands

### Generate LiveView Resources
```bash
# Generate complete LiveView CRUD
mix phx.gen.live Accounts User users name:string email:string role:enum:admin:user:guest

# Generate with custom contexts
mix phx.gen.live CMS Page pages title:string body:text published:boolean

# Generate nested LiveViews
mix phx.gen.live Forum Topic topics title:string forum_id:references:forums
```

### LiveView Best Practices

#### Basic LiveView Structure
```elixir
defmodule MyAppWeb.DashboardLive do
  use MyAppWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    if connected?(socket) do
      # Subscribe to real-time updates
      Phoenix.PubSub.subscribe(MyApp.PubSub, "dashboard:updates")
    end

    {:ok, 
     socket
     |> assign(:page_title, "Dashboard")
     |> assign(:stats, load_stats())
     |> assign(:users_online, 0)}
  end

  @impl true
  def handle_params(params, _url, socket) do
    {:noreply, apply_action(socket, socket.assigns.live_action, params)}
  end

  @impl true
  def handle_event("refresh", _params, socket) do
    {:noreply, assign(socket, :stats, load_stats())}
  end

  @impl true
  def handle_info({:stats_updated, stats}, socket) do
    {:noreply, assign(socket, :stats, stats)}
  end

  defp apply_action(socket, :index, _params) do
    socket
  end

  defp load_stats do
    # Load your statistics
  end
end
```

#### LiveComponents for Reusability
```elixir
defmodule MyAppWeb.StatCardComponent do
  use MyAppWeb, :live_component

  @impl true
  def render(assigns) do
    ~H"""
    <div class="stat-card" id={@id}>
      <div class="stat-value"><%= @value %></div>
      <div class="stat-label"><%= @label %></div>
      <button phx-click="refresh" phx-target={@myself}>
        Refresh
      </button>
    </div>
    """
  end

  @impl true
  def handle_event("refresh", _params, socket) do
    send(self(), {:refresh_stat, socket.assigns.stat_type})
    {:noreply, socket}
  end
end
```

### Optimizing LiveView Performance

#### Use Temporary Assigns for Large Lists
```elixir
def mount(_params, _session, socket) do
  {:ok, 
   socket
   |> assign(:messages, [])
   |> assign(:temporary_assigns, [messages: []])}
end
```

#### Stream Collections
```elixir
def mount(_params, _session, socket) do
  {:ok, stream(socket, :posts, Blog.list_posts())}
end

def handle_event("delete", %{"id" => id}, socket) do
  post = Blog.get_post!(id)
  {:ok, _} = Blog.delete_post(post)
  
  {:noreply, stream_delete(socket, :posts, post)}
end
```

### JavaScript Hooks

```javascript
// assets/js/hooks.js
export const Hooks = {
  ScrollToBottom: {
    mounted() {
      this.el.scrollTop = this.el.scrollHeight
    },
    updated() {
      this.el.scrollTop = this.el.scrollHeight
    }
  },
  
  LocalStorage: {
    mounted() {
      this.handleEvent("store", ({key, value}) => {
        localStorage.setItem(key, value)
      })
      
      this.handleEvent("clear", ({key}) => {
        localStorage.removeItem(key)
      })
    }
  }
}

// In app.js
let liveSocket = new LiveSocket("/live", Socket, {
  params: {_csrf_token: csrfToken},
  hooks: Hooks
})
```

### Form Handling in LiveView

```elixir
def mount(_params, _session, socket) do
  {:ok,
   socket
   |> assign(:form, to_form(Blog.change_post(%Post{})))}
end

def handle_event("validate", %{"post" => params}, socket) do
  changeset =
    %Post{}
    |> Blog.change_post(params)
    |> Map.put(:action, :validate)

  {:noreply, assign(socket, :form, to_form(changeset))}
end

def handle_event("save", %{"post" => params}, socket) do
  case Blog.create_post(params) do
    {:ok, post} ->
      {:noreply,
       socket
       |> put_flash(:info, "Post created!")
       |> push_navigate(to: ~p"/posts/#{post}")}

    {:error, changeset} ->
      {:noreply, assign(socket, :form, to_form(changeset))}
  end
end
```

### Real-time Features

#### Broadcasting Updates
```elixir
# In your context
def create_post(attrs) do
  with {:ok, post} <- do_create_post(attrs) do
    Phoenix.PubSub.broadcast(
      MyApp.PubSub,
      "posts:lobby",
      {:post_created, post}
    )
    {:ok, post}
  end
end

# In your LiveView
def mount(_params, _session, socket) do
  if connected?(socket) do
    Phoenix.PubSub.subscribe(MyApp.PubSub, "posts:lobby")
  end
  
  {:ok, socket}
end

def handle_info({:post_created, post}, socket) do
  {:noreply, stream_insert(socket, :posts, post, at: 0)}
end
```

### Navigation in LiveView

```elixir
# Patch - stays in LiveView (URL changes, no page reload)
<.link patch={~p"/posts/#{@post}/edit"}>Edit</.link>

# Navigate - full page navigation
<.link navigate={~p"/posts/#{@post}"}>View</.link>

# In handle_event
{:noreply, push_patch(socket, to: ~p"/posts/#{post}/edit")}
{:noreply, push_navigate(socket, to: ~p"/posts")}
```

## Testing LiveView

```elixir
defmodule MyAppWeb.DashboardLiveTest do
  use MyAppWeb.ConnCase
  import Phoenix.LiveViewTest

  test "displays dashboard", %{conn: conn} do
    {:ok, view, html} = live(conn, ~p"/dashboard")
    
    assert html =~ "Dashboard"
    assert has_element?(view, "#stats-card")
  end

  test "updates stats on refresh", %{conn: conn} do
    {:ok, view, _html} = live(conn, ~p"/dashboard")
    
    view
    |> element("button", "Refresh")
    |> render_click()
    
    assert has_element?(view, ".updated-indicator")
  end
end
```

## Performance Tips

1. Use `phx-update="stream"` for large lists
2. Debounce rapid events with `phx-debounce`
3. Use `phx-throttle` for rate limiting
4. Minimize assigns size
5. Use temporary assigns for transient data
6. Profile with LiveDashboard
