# Agente Claude Code para Proyectos Elixir/Phoenix

## Descripción del Agente

Este agente especializado transforma Claude Code en un experto desarrollador Elixir/Phoenix capaz de crear, configurar y mantener proyectos completos desde cero. Automatiza las mejores prácticas del ecosistema y acelera el desarrollo mediante comandos inteligentes y plantillas optimizadas.

## Configuración Inicial

### 1. Estructura de Directorios

```bash
# Crear estructura del agente
mkdir -p .claude/{commands,templates,configs}
touch .claude/phoenix_agent.md
chmod +x .claude/commands/*.sh
```

### 2. Archivo Principal del Agente

Crear `.claude/phoenix_agent.md`:

```markdown
# Agente Especializado Elixir/Phoenix

## Identidad del Agente
Soy un experto desarrollador Elixir/Phoenix con 10+ años de experiencia en:
- Arquitectura de aplicaciones escalables con OTP
- Desarrollo de APIs REST y GraphQL
- Implementación de LiveView para interfaces reactivas
- Optimización de rendimiento con Ecto y PostgreSQL
- Deployment en producción con releases y clustering

## Capacidades Principales

### Setup de Proyectos
- Crear proyectos Phoenix optimizados para diferentes casos de uso
- Configurar bases de datos con migraciones y schemas
- Setup de autenticación y autorización
- Configuración de testing comprehensivo
- Integración con herramientas del ecosistema

### Desarrollo Avanzado
- Generación de contexts con lógica de negocio robusta
- Implementación de LiveView con componentes reutilizables
- Configuración de PubSub para tiempo real
- Optimización de queries con Ecto
- Implementación de background jobs con Oban

### Arquitectura y Patrones
- Diseño de APIs siguiendo convenciones REST
- Implementación de CQRS cuando sea apropiado
- Patrones de supervisión OTP
- Manejo de estado distribuido
- Estrategias de caching avanzadas

## Comandos Disponibles

### Inicialización
- `phoenix:new` - Crear nuevo proyecto con configuración optimizada
- `phoenix:api` - Crear proyecto API-only
- `phoenix:umbrella` - Crear proyecto umbrella para microservicios

### Desarrollo
- `phoenix:context` - Generar context con validaciones
- `phoenix:liveview` - Crear LiveView con componentes
- `phoenix:auth` - Implementar sistema de autenticación
- `phoenix:api_resource` - Generar recurso API completo

### Tooling
- `phoenix:setup_ci` - Configurar CI/CD
- `phoenix:docker` - Crear configuración Docker
- `phoenix:deploy` - Setup de deployment

## Estándares de Código

### Estructura de Proyecto
```
lib/
  my_app/           # Contextos de negocio
    accounts/       # Módulos relacionados
    blog/
  my_app_web/       # Capa web
    live/           # LiveView modules
    controllers/    # Controllers REST
    components/     # Componentes reutilizables
priv/
  repo/migrations/  # Migraciones DB
test/
  my_app/          # Tests de contextos
  my_app_web/      # Tests web
  support/         # Helpers y factories
```

### Convenciones de Código
- Usar pipes para transformaciones de datos
- Pattern matching extensivo en función heads
- Documentación con @doc para funciones públicas
- Specs para funciones críticas
- Contextos para encapsular lógica de negocio

### Testing
- Test por cada función pública
- Factories con ExMachina para datos de prueba
- Mocks solo cuando sea absolutamente necesario
- Tests de integración para flujos críticos
- Property-based testing para lógica compleja
```

### 3. Comandos Especializados

#### Comando: Nuevo Proyecto Phoenix
`.claude/commands/phoenix_new.sh`:

```bash
#!/bin/bash

set -e

PROJECT_NAME=${1:-"my_phoenix_app"}
PROJECT_TYPE=${2:-"web"}  # web, api, umbrella
DATABASE=${3:-"postgres"}
LIVEVIEW=${4:-"true"}

echo "🚀 Creando proyecto Elixir/Phoenix: $PROJECT_NAME"
echo "📋 Tipo: $PROJECT_TYPE | DB: $DATABASE | LiveView: $LIVEVIEW"

# Verificar dependencias
check_dependencies() {
    local deps=("elixir" "mix" "node" "npm")
    
    for dep in "${deps[@]}"; do
        if ! command -v $dep &> /dev/null; then
            echo "❌ $dep no está instalado"
            exit 1
        fi
    done
    
    echo "✅ Todas las dependencias están disponibles"
}

# Crear proyecto base
create_project() {
    echo "📦 Creando proyecto base..."
    
    case $PROJECT_TYPE in
        "api")
            mix phx.new $PROJECT_NAME --no-html --no-assets --binary-id
            ;;
        "umbrella")
            mix phx.new $PROJECT_NAME --umbrella --binary-id
            ;;
        *)
            if [ "$LIVEVIEW" = "true" ]; then
                mix phx.new $PROJECT_NAME --live --binary-id
            else
                mix phx.new $PROJECT_NAME --binary-id
            fi
            ;;
    esac
    
    cd $PROJECT_NAME
}

# Configurar dependencias adicionales
setup_dependencies() {
    echo "📚 Configurando dependencias adicionales..."
    
    # Backup del archivo original
    cp mix.exs mix.exs.backup
    
    # Agregar dependencias comunes
    cat >> mix.exs.tmp << 'EOF'

  defp deps do
    [
      # Phoenix & Ecto
      {:phoenix, "~> 1.7.0"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.6"},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 3.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 0.20.0"},
      {:floki, ">= 0.30.0", only: :test},
      {:phoenix_live_dashboard, "~> 0.8.0"},
      {:esbuild, "~> 0.5", runtime: Mix.env() == :dev},
      {:tailwind, "~> 0.1.8", runtime: Mix.env() == :dev},
      {:swoosh, "~> 1.3"},
      {:finch, "~> 0.13"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.20"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.5"},
      
      # Utilidades de desarrollo
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.0", only: [:dev], runtime: false},
      {:ex_doc, "~> 0.27", only: :dev, runtime: false},
      
      # Testing
      {:ex_machina, "~> 2.7.0", only: :test},
      {:faker, "~> 0.17", only: :test},
      {:mock, "~> 0.3.0", only: :test},
      
      # Producción
      {:oban, "~> 2.15"},
      {:bcrypt_elixir, "~> 3.0"},
      {:guardian, "~> 2.0"},
      {:cors_plug, "~> 3.0"},
      {:redix, "~> 1.1"}
    ]
  end
EOF

    # Reemplazar la función deps existente
    sed '/defp deps do/,/^  end$/c\
'"$(cat mix.exs.tmp)" mix.exs.backup > mix.exs
    
    rm mix.exs.tmp mix.exs.backup
    
    # Instalar dependencias
    mix deps.get
}

# Configurar base de datos
setup_database() {
    echo "🗄️ Configurando base de datos..."
    
    # Crear base de datos
    mix ecto.create
    
    # Crear migración inicial personalizada
    mix ecto.gen.migration create_base_tables
    
    echo "✅ Base de datos configurada"
}

# Configurar herramientas de calidad
setup_tooling() {
    echo "🔧 Configurando herramientas de desarrollo..."
    
    # Formatter
    cat > .formatter.exs << 'EOF'
[
  import_deps: [:ecto, :phoenix],
  inputs: ["*.{ex,exs}", "priv/*/seeds.exs", "{config,lib,test}/**/*.{ex,exs}"],
  subdirectories: ["priv/*/migrations"],
  line_length: 100
]
EOF

    # Credo config
    cat > .credo.exs << 'EOF'
%{
  configs: [
    %{
      name: "default",
      files: %{
        included: ["lib/", "src/", "test/", "web/", "apps/"],
        excluded: [~r"/_build/", ~r"/deps/", ~r"/node_modules/"]
      },
      plugins: [],
      requires: [],
      strict: true,
      parse_timeout: 5000,
      color: true,
      checks: [
        {Credo.Check.Consistency.ExceptionNames, []},
        {Credo.Check.Consistency.LineEndings, []},
        {Credo.Check.Consistency.ParameterPatternMatching, []},
        {Credo.Check.Consistency.SpaceAroundOperators, []},
        {Credo.Check.Consistency.SpaceInParentheses, []},
        {Credo.Check.Consistency.TabsOrSpaces, []},
        {Credo.Check.Design.AliasUsage, [priority: :low, if_nested_deeper_than: 2, if_called_more_often_than: 0]},
        {Credo.Check.Design.TagTODO, [exit_status: 2]},
        {Credo.Check.Design.TagFIXME, []},
        {Credo.Check.Readability.AliasOrder, []},
        {Credo.Check.Readability.FunctionNames, []},
        {Credo.Check.Readability.LargeNumbers, []},
        {Credo.Check.Readability.MaxLineLength, [priority: :low, max_length: 120]},
        {Credo.Check.Readability.ModuleAttributeNames, []},
        {Credo.Check.Readability.ModuleDoc, []},
        {Credo.Check.Readability.ModuleNames, []},
        {Credo.Check.Readability.ParenthesesInCondition, []},
        {Credo.Check.Readability.ParenthesesOnZeroArityDefs, []},
        {Credo.Check.Readability.PredicateFunctionNames, []},
        {Credo.Check.Readability.PreferImplicitTry, []},
        {Credo.Check.Readability.RedundantBlankLines, []},
        {Credo.Check.Readability.Semicolons, []},
        {Credo.Check.Readability.SpaceAfterCommas, []},
        {Credo.Check.Readability.StringSigils, []},
        {Credo.Check.Readability.TrailingBlankLine, []},
        {Credo.Check.Readability.TrailingWhiteSpace, []},
        {Credo.Check.Readability.UnnecessaryAliasExpansion, []},
        {Credo.Check.Readability.VariableNames, []},
        {Credo.Check.Refactor.DoubleBooleanNegation, []},
        {Credo.Check.Refactor.CondStatements, []},
        {Credo.Check.Refactor.CyclomaticComplexity, []},
        {Credo.Check.Refactor.FunctionArity, []},
        {Credo.Check.Refactor.LongQuoteBlocks, []},
        {Credo.Check.Refactor.MapInto, []},
        {Credo.Check.Refactor.MatchInCondition, []},
        {Credo.Check.Refactor.NegatedConditionsInUnless, []},
        {Credo.Check.Refactor.NegatedConditionsWithElse, []},
        {Credo.Check.Refactor.Nesting, []},
        {Credo.Check.Refactor.UnlessWithElse, []},
        {Credo.Check.Refactor.WithClauses, []},
        {Credo.Check.Warning.ApplicationConfigInModuleAttribute, []},
        {Credo.Check.Warning.BoolOperationOnSameValues, []},
        {Credo.Check.Warning.ExpensiveEmptyEnumCheck, []},
        {Credo.Check.Warning.IExPry, []},
        {Credo.Check.Warning.IoInspect, []},
        {Credo.Check.Warning.LazyLogging, []},
        {Credo.Check.Warning.MixEnv, false},
        {Credo.Check.Warning.OperationOnSameValues, []},
        {Credo.Check.Warning.OperationWithConstantResult, []},
        {Credo.Check.Warning.RaiseInsideRescue, []},
        {Credo.Check.Warning.UnusedEnumOperation, []},
        {Credo.Check.Warning.UnusedFileOperation, []},
        {Credo.Check.Warning.UnusedKeywordOperation, []},
        {Credo.Check.Warning.UnusedListOperation, []},
        {Credo.Check.Warning.UnusedPathOperation, []},
        {Credo.Check.Warning.UnusedRegexOperation, []},
        {Credo.Check.Warning.UnusedStringOperation, []},
        {Credo.Check.Warning.UnusedTupleOperation, []},
        {Credo.Check.Warning.UnsafeExec, []}
      ]
    }
  ]
}
EOF

    # Dialyzer PLT
    cat > .dialyzer_ignore.exs << 'EOF'
[
  # Ignorar warnings específicos de Phoenix/Plug
  {"lib/my_app_web/endpoint.ex", :unknown_function},
  {"lib/my_app_web/router.ex", :unknown_function}
]
EOF

    # GitHub Actions
    mkdir -p .github/workflows
    cat > .github/workflows/elixir.yml << 'EOF'
name: Elixir CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

env:
  MIX_ENV: test

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Elixir
      uses: erlef/setup-beam@v1
      with:
        elixir-version: '1.15.4'
        otp-version: '26.0'
        
    - name: Restore dependencies cache
      uses: actions/cache@v3
      with:
        path: deps
        key: ${{ runner.os }}-mix-${{ hashFiles('**/mix.lock') }}
        restore-keys: ${{ runner.os }}-mix-
        
    - name: Install dependencies
      run: mix deps.get
      
    - name: Check Formatting
      run: mix format --check-formatted
      
    - name: Run Credo
      run: mix credo --strict
      
    - name: Setup Database
      run: mix ecto.setup
      
    - name: Run tests
      run: mix test --cover
EOF

    echo "✅ Herramientas configuradas"
}

# Crear estructura de testing
setup_testing() {
    echo "🧪 Configurando entorno de testing..."
    
    # Factory para ExMachina
    mkdir -p test/support
    cat > test/support/factory.ex << 'EOF'
defmodule MyApp.Factory do
  @moduledoc """
  Factory para generar datos de prueba usando ExMachina.
  """
  
  use ExMachina.Ecto, repo: MyApp.Repo
  
  # Ejemplo de factory para User
  def user_factory do
    %MyApp.Accounts.User{
      email: sequence(:email, &"user#{&1}@example.com"),
      name: Faker.Person.name(),
      password_hash: Bcrypt.hash_pwd_salt("password123")
    }
  end
end
EOF

    # Helper de conexión para LiveView
    cat > test/support/conn_case.ex << 'EOF'
defmodule MyAppWeb.ConnCase do
  @moduledoc """
  Case template para testing de controllers.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      # Import conveniences para testing con connections
      import Plug.Conn
      import Phoenix.ConnTest
      import MyAppWeb.ConnCase
      import MyApp.Factory

      alias MyAppWeb.Router.Helpers, as: Routes

      # El endpoint por defecto para testing
      @endpoint MyAppWeb.Endpoint
    end
  end

  setup tags do
    MyApp.DataCase.setup_sandbox(tags)
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end
EOF

    echo "✅ Testing configurado"
}

# Crear documentación inicial
create_documentation() {
    echo "📚 Creando documentación..."
    
    cat > README.md << EOF
# $PROJECT_NAME

> Aplicación Phoenix desarrollada con Elixir

## Descripción

[Descripción de tu aplicación]

## Requisitos

- Elixir 1.15+
- Erlang/OTP 26+
- PostgreSQL 14+
- Node.js 18+ (para assets)

## Instalación

\`\`\`bash
# Clonar repositorio
git clone [url]
cd $PROJECT_NAME

# Instalar dependencias
mix deps.get

# Configurar base de datos
mix ecto.setup

# Instalar dependencias de JS (si aplica)
npm install --prefix assets

# Iniciar servidor
mix phx.server
\`\`\`

## Testing

\`\`\`bash
# Ejecutar todos los tests
mix test

# Con coverage
mix test --cover

# Tests específicos
mix test test/my_app/accounts_test.exs
\`\`\`

## Desarrollo

### Comandos útiles

\`\`\`bash
# Generar migración
mix ecto.gen.migration nombre_migracion

# Ejecutar migraciones
mix ecto.migrate

# Generar contexto
mix phx.gen.context Accounts User users name:string email:string

# Generar LiveView
mix phx.gen.live Blog Post posts title:string content:text
\`\`\`

### Arquitectura

\`\`\`
lib/
├── $PROJECT_NAME/          # Contextos de negocio
│   ├── accounts/          # Gestión de usuarios
│   └── repo.ex           # Configuración Ecto
├── ${PROJECT_NAME}_web/    # Capa web
│   ├── controllers/      # Controllers REST
│   ├── live/            # LiveView modules
│   ├── components/      # Componentes reutilizables
│   └── router.ex        # Enrutamiento
└── application.ex       # Configuración OTP
\`\`\`

## Deployment

[Instrucciones de deployment]

## Contribuir

1. Fork del proyecto
2. Crear branch para feature (\`git checkout -b feature/nueva-funcionalidad\`)
3. Commit de cambios (\`git commit -am 'Agregar nueva funcionalidad'\`)
4. Push al branch (\`git push origin feature/nueva-funcionalidad\`)
5. Crear Pull Request

## Licencia

[Especificar licencia]
EOF

    echo "✅ Documentación creada"
}

# Ejecutar todas las funciones
main() {
    check_dependencies
    create_project
    setup_dependencies
    setup_database
    setup_tooling
    setup_testing
    create_documentation
    
    echo ""
    echo "🎉 ¡Proyecto $PROJECT_NAME creado exitosamente!"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   cd $PROJECT_NAME"
    echo "   mix phx.server"
    echo ""
    echo "🌐 Tu aplicación estará disponible en http://localhost:4000"
    echo ""
}

# Ejecutar script principal
main
```

#### Comando: Generar Context Avanzado
`.claude/commands/phoenix_context.sh`:

```bash
#!/bin/bash

set -e

CONTEXT_NAME=${1?"Error: Especifica el nombre del contexto"}
SCHEMA_NAME=${2?"Error: Especifica el nombre del schema"}
TABLE_NAME=${3:-"${SCHEMA_NAME,,}s"}
shift 3
FIELDS=$@

echo "🏗️ Generando contexto: $CONTEXT_NAME"
echo "📊 Schema: $SCHEMA_NAME"
echo "🗄️ Tabla: $TABLE_NAME"
echo "📝 Campos: $FIELDS"

# Generar contexto base
generate_context() {
    echo "Generando contexto base..."
    
    mix phx.gen.context $CONTEXT_NAME $SCHEMA_NAME $TABLE_NAME \
        --binary-id \
        $FIELDS
    
    echo "✅ Contexto base generado"
}

# Agregar validaciones avanzadas
enhance_schema() {
    local schema_file="lib/$(mix phx.new.ecto --app | tail -1)/$(echo $CONTEXT_NAME | tr '[:upper:]' '[:lower:]')/$SCHEMA_NAME.ex"
    
    echo "Mejorando schema con validaciones..."
    
    # Backup
    cp "$schema_file" "${schema_file}.backup"
    
    # Agregar validaciones comunes
    cat >> "${schema_file}.additions" << 'EOF'

  @doc """
  Validaciones adicionales para el changeset.
  """
  def validate_changeset(changeset) do
    changeset
    |> validate_required_fields()
    |> validate_format_fields()
    |> validate_length_fields()
    |> validate_uniqueness_fields()
  end

  defp validate_required_fields(changeset) do
    # Agregar validaciones required específicas
    changeset
  end

  defp validate_format_fields(changeset) do
    # Agregar validaciones de formato
    changeset
  end

  defp validate_length_fields(changeset) do
    # Agregar validaciones de longitud
    changeset
  end

  defp validate_uniqueness_fields(changeset) do
    # Agregar validaciones de unicidad
    changeset
  end
EOF

    echo "✅ Schema mejorado"
}

# Crear factories para testing
create_factory() {
    echo "Creando factory para testing..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local factory_file="test/support/factory.ex"
    
    if [ ! -f "$factory_file" ]; then
        cat > "$factory_file" << EOF
defmodule ${app_name}.Factory do
  use ExMachina.Ecto, repo: ${app_name}.Repo
  alias Faker
EOF
    fi
    
    # Agregar factory específica
    cat >> "$factory_file" << EOF

  def $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_factory do
    %${app_name}.${CONTEXT_NAME}.${SCHEMA_NAME}{
      # Campos generados automáticamente basados en los tipos
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    case $field_type in
        "string") echo "      $field_name: Faker.Lorem.word()," ;;
        "text") echo "      $field_name: Faker.Lorem.paragraph()," ;;
        "integer") echo "      $field_name: Faker.Random.Elixir.random_between(1, 100)," ;;
        "boolean") echo "      $field_name: Faker.Util.pick([true, false])," ;;
        "date") echo "      $field_name: Faker.Date.date_of_birth()," ;;
        "datetime") echo "      $field_name: Faker.DateTime.backward(30)," ;;
        *) echo "      $field_name: \"valor_por_defecto\"," ;;
    esac
done)
    }
  end
EOF

    if [ ! -f "$factory_file" ]; then
        echo "end" >> "$factory_file"
    fi
    
    echo "✅ Factory creada"
}

# Crear tests mejorados
create_enhanced_tests() {
    echo "Creando tests mejorados..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local context_test="test/$(echo $app_name | tr '[:upper:]' '[:lower:]')/$(echo $CONTEXT_NAME | tr '[:upper:]' '[:lower:]')_test.exs"
    
    cat >> "$context_test" << EOF

  describe "$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]') validations" do
    test "validates required fields" do
      changeset = ${CONTEXT_NAME}.change_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')(%${SCHEMA_NAME}{}, %{})
      
      refute changeset.valid?
      # Agregar assertions específicas para campos requeridos
    end
    
    test "validates field formats" do
      # Tests de formato específicos
    end
    
    test "validates field lengths" do
      # Tests de longitud específicos
    end
    
    test "validates uniqueness constraints" do
      # Tests de unicidad específicos
    end
  end

  describe "$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]') business logic" do
    test "handles complex business rules" do
      # Tests de lógica de negocio específica
    end
  end
EOF

    echo "✅ Tests mejorados creados"
}

# Ejecutar generación
main() {
    generate_context
    enhance_schema
    create_factory
    create_enhanced_tests
    
    echo ""
    echo "🎉 ¡Contexto $CONTEXT_NAME generado exitosamente!"
    echo ""
    echo "📋 Archivos creados/modificados:"
    echo "   - lib/my_app/$(echo $CONTEXT_NAME | tr '[:upper:]' '[:lower:]')/"
    echo "   - test/my_app/$(echo $CONTEXT_NAME | tr '[:upper:]' '[:lower:]')_test.exs"
    echo "   - test/support/factory.ex"
    echo ""
    echo "🔄 Ejecuta 'mix ecto.migrate' para aplicar cambios a la BD"
}

main
```

#### Comando: LiveView con Componentes
`.claude/commands/phoenix_liveview.sh`:

```bash
#!/bin/bash

set -e

CONTEXT_NAME=${1?"Error: Especifica el nombre del contexto"}
SCHEMA_NAME=${2?"Error: Especifica el nombre del schema"}
PLURAL_NAME=${3:-"${SCHEMA_NAME,,}s"}
shift 3
FIELDS=$@

echo "⚡ Generando LiveView para: $CONTEXT_NAME.$SCHEMA_NAME"

# Generar LiveView base
generate_liveview() {
    echo "Generando LiveView base..."
    
    mix phx.gen.live $CONTEXT_NAME $SCHEMA_NAME $PLURAL_NAME \
        --binary-id \
        $FIELDS
    
    echo "✅ LiveView base generado"
}

# Crear componentes reutilizables
create_components() {
    echo "Creando componentes reutilizables..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local components_dir="lib/${app_name}_web/live/components"
    
    mkdir -p "$components_dir"
    
    # Componente de formulario
    cat > "$components_dir/$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_form_component.ex" << EOF
defmodule ${app_name}Web.$(echo $SCHEMA_NAME)FormComponent do
  use ${app_name}Web, :live_component

  alias ${app_name}.${CONTEXT_NAME}

  @impl true
  def render(assigns) do
    ~H"""
    <div class="bg-white shadow-lg rounded-lg p-6">
      <.header>
        <%= @title %>
        <:subtitle>Usa este formulario para gestionar registros de $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').</:subtitle>
      </.header>

      <.simple_form
        for={@form}
        id="$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')-form"
        phx-target={@myself}
        phx-change="validate"
        phx-submit="save"
        class="space-y-4"
      >
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    case $field_type in
        "string"|"text")
            echo "        <.input field={@form[:$field_name]} type=\"text\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
        "integer")
            echo "        <.input field={@form[:$field_name]} type=\"number\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
        "boolean")
            echo "        <.input field={@form[:$field_name]} type=\"checkbox\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
        "date")
            echo "        <.input field={@form[:$field_name]} type=\"date\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
        "datetime")
            echo "        <.input field={@form[:$field_name]} type=\"datetime-local\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
        *)
            echo "        <.input field={@form[:$field_name]} type=\"text\" label=\"$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g')\" />"
            ;;
    esac
done)

        <:actions>
          <.button 
            phx-disable-with="Guardando..." 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Guardar $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')
          </.button>
        </:actions>
      </.simple_form>
    </div>
    """
  end

  @impl true
  def update(%{$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]'): $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')} = assigns, socket) do
    changeset = ${CONTEXT_NAME}.change_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')($(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]'))

    {:ok,
     socket
     |> assign(assigns)
     |> assign_form(changeset)}
  end

  @impl true
  def handle_event("validate", %{"$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')" => $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params}, socket) do
    changeset =
      socket.assigns.$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')
      |> ${CONTEXT_NAME}.change_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')($(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params)
      |> Map.put(:action, :validate)

    {:noreply, assign_form(socket, changeset)}
  end

  def handle_event("save", %{"$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')" => $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params}, socket) do
    save_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')(socket, socket.assigns.action, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params)
  end

  defp save_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')(socket, :edit, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params) do
    case ${CONTEXT_NAME}.update_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')(socket.assigns.$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]'), $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params) do
      {:ok, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')} ->
        notify_parent({:saved, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')})

        {:noreply,
         socket
         |> put_flash(:info, "$(echo $SCHEMA_NAME) actualizado exitosamente")
         |> push_patch(to: socket.assigns.patch)}

      {:error, %Ecto.Changeset{} = changeset} ->
        {:noreply, assign_form(socket, changeset)}
    end
  end

  defp save_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')(socket, :new, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params) do
    case ${CONTEXT_NAME}.create_$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')($(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_params) do
      {:ok, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')} ->
        notify_parent({:saved, $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')})

        {:noreply,
         socket
         |> put_flash(:info, "$(echo $SCHEMA_NAME) creado exitosamente")
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
EOF

    # Componente de tarjeta
    cat > "$components_dir/$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_card_component.ex" << EOF
defmodule ${app_name}Web.$(echo $SCHEMA_NAME)CardComponent do
  use ${app_name}Web, :live_component

  @impl true
  def render(assigns) do
    ~H"""
    <div class="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    if [ "$field_name" = "$(echo $FIELDS | cut -d' ' -f1 | cut -d: -f1)" ]; then
        echo "            <h3 class=\"text-lg font-medium text-gray-900 truncate\">"
        echo "              <%= @$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name} %>"
        echo "            </h3>"
    elif [ "$field_type" = "text" ]; then
        echo "            <p class=\"text-sm text-gray-500 mt-1\">"
        echo "              <%= String.slice(@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name} || \"\", 0, 100) %>"
        echo "              <%= if String.length(@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name} || \"\") > 100 do %>..."
        echo "              <% end %>"
        echo "            </p>"
    fi
done)
          </div>
          <div class="flex-shrink-0 flex space-x-2">
            <.link
              patch={~p"/$(echo $PLURAL_NAME)/#{@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')}/show"}
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ver
            </.link>
            <.link
              patch={~p"/$(echo $PLURAL_NAME)/#{@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')}/edit"}
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Editar
            </.link>
            <.link
              phx-click={JS.push("delete", value: %{id: @$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').id}) |> hide("#$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')-#{@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').id}")}
              data-confirm="¿Estás seguro?"
              class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Eliminar
            </.link>
          </div>
        </div>
        <div class="mt-4">
          <div class="flex flex-wrap gap-2">
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    if [ "$field_type" = "boolean" ]; then
        echo "            <span class=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium\">"
        echo "              <%= if @$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name} do %>"
        echo "                <span class=\"bg-green-100 text-green-800\">$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g'): Sí</span>"
        echo "              <% else %>"
        echo "                <span class=\"bg-red-100 text-red-800\">$(echo $field_name | sed 's/_/ /g' | sed 's/\b\w/\U&/g'): No</span>"
        echo "              <% end %>"
        echo "            </span>"
    elif [ "$field_type" = "date" ] || [ "$field_type" = "datetime" ]; then
        echo "            <span class=\"inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800\">"
        echo "              <%= if @$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name} do %>"
        echo "                <%= Calendar.strftime(@$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').${field_name}, \"%d/%m/%Y\") %>"
        echo "              <% end %>"
        echo "            </span>"
    fi
done)
          </div>
        </div>
      </div>
    </div>
    """
  end
end
EOF

    echo "✅ Componentes creados"
}

# Mejorar LiveView principal con funcionalidades avanzadas
enhance_liveview() {
    echo "Mejorando LiveView principal..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local liveview_file="lib/${app_name}_web/live/$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_live/index.ex"
    
    # Backup
    cp "$liveview_file" "${liveview_file}.backup"
    
    # Agregar funcionalidades avanzadas
    cat >> "${liveview_file}.enhancements" << 'EOF'

  # Funcionalidades adicionales para el LiveView

  @impl true
  def handle_info({MyAppWeb.MySchemaFormComponent, {:saved, my_schema}}, socket) do
    {:noreply, stream_insert(socket, :my_schemas, my_schema)}
  end

  @impl true
  def handle_event("search", %{"search" => %{"query" => query}}, socket) do
    my_schemas = MyApp.MyContext.search_my_schemas(query)
    {:noreply, stream(socket, :my_schemas, my_schemas, reset: true)}
  end

  @impl true
  def handle_event("filter_by_status", %{"status" => status}, socket) do
    my_schemas = MyApp.MyContext.filter_my_schemas_by_status(status)
    {:noreply, stream(socket, :my_schemas, my_schemas, reset: true)}
  end

  @impl true
  def handle_event("export_to_csv", _params, socket) do
    csv_data = MyApp.MyContext.export_my_schemas_to_csv()
    
    {:noreply,
     socket
     |> put_flash(:info, "Exportación iniciada")
     |> push_event("download", %{
       filename: "my_schemas_#{Date.utc_today()}.csv",
       content: csv_data,
       content_type: "text/csv"
     })}
  end

  defp apply_action(socket, :index, _params) do
    socket
    |> assign(:page_title, "Listado de MySchemas")
    |> assign(:my_schema, nil)
  end

  defp apply_action(socket, :new, _params) do
    socket
    |> assign(:page_title, "Nuevo MySchema")
    |> assign(:my_schema, %MyApp.MyContext.MySchema{})
  end

  defp apply_action(socket, :edit, %{"id" => id}) do
    socket
    |> assign(:page_title, "Editar MySchema")
    |> assign(:my_schema, MyApp.MyContext.get_my_schema!(id))
  end
EOF

    echo "✅ LiveView mejorado"
}

# Crear tests para LiveView
create_liveview_tests() {
    echo "Creando tests para LiveView..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local test_file="test/${app_name}_web/live/$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_live_test.exs"
    
    cat >> "$test_file" << EOF

  describe "componentes personalizados" do
    test "$(echo $SCHEMA_NAME)FormComponent renderiza correctamente", %{conn: conn} do
      $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]') = $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      
      {:ok, _index_live, html} = live(conn, ~p"/$(echo $PLURAL_NAME)")
      
      assert html =~ "$(echo $SCHEMA_NAME | sed 's/_/ /g')"
    end
    
    test "$(echo $SCHEMA_NAME)CardComponent muestra información correcta", %{conn: conn} do
      $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]') = $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      
      {:ok, _show_live, html} = live(conn, ~p"/$(echo $PLURAL_NAME)/#{$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')}")
      
      assert html =~ $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]').$(echo $FIELDS | head -1 | cut -d: -f1)
    end
  end

  describe "funcionalidades avanzadas" do
    test "búsqueda en tiempo real funciona", %{conn: conn} do
      $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')1 = $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{$(echo $FIELDS | head -1 | cut -d: -f1): "término búsqueda"})
      $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')2 = $(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{$(echo $FIELDS | head -1 | cut -d: -f1): "otro término"})
      
      {:ok, index_live, _html} = live(conn, ~p"/$(echo $PLURAL_NAME)")
      
      # Simular búsqueda
      index_live
      |> form("#search-form", search: %{query: "término"})
      |> render_change()
      
      assert has_element?(index_live, "#$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')-#{$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')1.id}")
      refute has_element?(index_live, "#$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')-#{$(echo $SCHEMA_NAME | tr '[:upper:]' '[:lower:]')2.id}")
    end
    
    test "filtros funcionan correctamente", %{conn: conn} do
      # Test de filtros
    end
    
    test "exportación genera CSV correcto", %{conn: conn} do
      # Test de exportación
    end
  end
EOF

    echo "✅ Tests de LiveView creados"
}

# Ejecutar todas las funciones
main() {
    generate_liveview
    create_components
    enhance_liveview
    create_liveview_tests
    
    echo ""
    echo "⚡ ¡LiveView para $CONTEXT_NAME.$SCHEMA_NAME generado exitosamente!"
    echo ""
    echo "📋 Componentes creados:"
    echo "   - $(echo $SCHEMA_NAME)FormComponent (formulario reutilizable)"
    echo "   - $(echo $SCHEMA_NAME)CardComponent (tarjeta de visualización)"
    echo ""
    echo "🔗 No olvides agregar las rutas al router:"
    echo "   live \"/$(echo $PLURAL_NAME)\", $(echo $SCHEMA_NAME)Live.Index, :index"
    echo "   live \"/$(echo $PLURAL_NAME)/new\", $(echo $SCHEMA_NAME)Live.Index, :new"
    echo "   live \"/$(echo $PLURAL_NAME)/:id/edit\", $(echo $SCHEMA_NAME)Live.Index, :edit"
    echo ""
}

main
```

### 4. Plantillas Reutilizables

#### Template: Context Base
`.claude/templates/context_template.ex`:

```elixir
defmodule <%= app_name %>.<%= context_name %> do
  @moduledoc """
  Context para gestionar <%= schema_name %>.
  
  Este módulo proporciona funciones para crear, leer, actualizar y eliminar
  registros de <%= schema_name %>, así como funciones de consulta especializadas.
  """

  import Ecto.Query, warn: false
  alias <%= app_name %>.Repo
  alias <%= app_name %>.<%= context_name %>.<%= schema_name %>

  @doc """
  Retorna la lista de <%= plural_name %>.

  ## Ejemplos

      iex> list_<%= plural_name %>()
      [%<%= schema_name %>{}, ...]

  """
  def list_<%= plural_name %> do
    Repo.all(<%= schema_name %>)
  end

  @doc """
  Lista <%= plural_name %> con paginación.

  ## Ejemplos

      iex> list_<%= plural_name %>_paginated(1, 10)
      %{entries: [%<%= schema_name %>{}, ...], page_number: 1, page_size: 10, total_entries: 50, total_pages: 5}

  """
  def list_<%= plural_name %>_paginated(page \\ 1, page_size \\ 10) do
    <%= schema_name %>
    |> order_by(desc: :inserted_at)
    |> Repo.paginate(page: page, page_size: page_size)
  end

  @doc """
  Busca <%= plural_name %> por término.

  ## Ejemplos

      iex> search_<%= plural_name %>("término")
      [%<%= schema_name %>{}, ...]

  """
  def search_<%= plural_name %>(term) when is_binary(term) do
    search_term = "%#{term}%"
    
    <%= schema_name %>
    |> where([s], ilike(s.name, ^search_term) or ilike(s.description, ^search_term))
    |> order_by(desc: :inserted_at)
    |> Repo.all()
  end

  @doc """
  Obtiene un <%= schema_name %> por ID.

  Lanza `Ecto.NoResultsError` si el <%= schema_name %> no existe.

  ## Ejemplos

      iex> get_<%= singular_name %>!(123)
      %<%= schema_name %>{}

      iex> get_<%= singular_name %>!(456)
      ** (Ecto.NoResultsError)

  """
  def get_<%= singular_name %>!(id), do: Repo.get!(<%= schema_name %>, id)

  @doc """
  Obtiene un <%= schema_name %> por ID.

  ## Ejemplos

      iex> get_<%= singular_name %>(123)
      %<%= schema_name %>{}

      iex> get_<%= singular_name %>(456)
      nil

  """
  def get_<%= singular_name %>(id), do: Repo.get(<%= schema_name %>, id)

  @doc """
  Crea un <%= schema_name %>.

  ## Ejemplos

      iex> create_<%= singular_name %>(%{field: value})
      {:ok, %<%= schema_name %>{}}

      iex> create_<%= singular_name %>(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_<%= singular_name %>(attrs \\ %{}) do
    %<%= schema_name %>{}
    |> <%= schema_name %>.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Actualiza un <%= schema_name %>.

  ## Ejemplos

      iex> update_<%= singular_name %>(<%= singular_name %>, %{field: new_value})
      {:ok, %<%= schema_name %>{}}

      iex> update_<%= singular_name %>(<%= singular_name %>, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_<%= singular_name %>(%<%= schema_name %>{} = <%= singular_name %>, attrs) do
    <%= singular_name %>
    |> <%= schema_name %>.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Elimina un <%= schema_name %>.

  ## Ejemplos

      iex> delete_<%= singular_name %>(<%= singular_name %>)
      {:ok, %<%= schema_name %>{}}

      iex> delete_<%= singular_name %>(<%= singular_name %>)
      {:error, %Ecto.Changeset{}}

  """
  def delete_<%= singular_name %>(%<%= schema_name %>{} = <%= singular_name %>) do
    Repo.delete(<%= singular_name %>)
  end

  @doc """
  Retorna un `%Ecto.Changeset{}` para trackear cambios en <%= schema_name %>.

  ## Ejemplos

      iex> change_<%= singular_name %>(<%= singular_name %>)
      %Ecto.Changeset{data: %<%= schema_name %>{}}

  """
  def change_<%= singular_name %>(%<%= schema_name %>{} = <%= singular_name %>, attrs \\ %{}) do
    <%= schema_name %>.changeset(<%= singular_name %>, attrs)
  end

  # Funciones de consulta especializadas

  @doc """
  Cuenta el total de <%= plural_name %>.
  """
  def count_<%= plural_name %> do
    Repo.aggregate(<%= schema_name %>, :count, :id)
  end

  @doc """
  Obtiene <%= plural_name %> activos.
  """
  def list_active_<%= plural_name %> do
    <%= schema_name %>
    |> where([s], s.active == true)
    |> order_by(desc: :inserted_at)
    |> Repo.all()
  end

  @doc """
  Exporta <%= plural_name %> a CSV.
  """
  def export_<%= plural_name %>_to_csv do
    <%= plural_name %> = list_<%= plural_name %>()
    
    # Implementar lógica de exportación CSV
    # Esto es un placeholder - implementar según necesidades específicas
    ""
  end
end
```

#### Template: Schema Avanzado
`.claude/templates/schema_template.ex`:

```elixir
defmodule <%= app_name %>.<%= context_name %>.<%= schema_name %> do
  @moduledoc """
  Schema para <%= schema_name %>.
  
  Representa <%= description %> en el sistema.
  """

  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  @required_fields [<%= required_fields %>]
  @optional_fields [<%= optional_fields %>]
  @all_fields @required_fields ++ @optional_fields

  schema "<%= table_name %>" do
<%= for {field, type} <- fields do %>
    field :<%= field %>, :<%= type %><%= if type in [:string, :text], do: ", default: \"\"", else: "" %>
<% end %>

    timestamps()
  end

  @doc """
  Changeset principal para <%= schema_name %>.
  
  Valida todos los campos requeridos y aplica las transformaciones necesarias.
  """
  def changeset(<%= singular_name %>, attrs) do
    <%= singular_name %>
    |> cast(attrs, @all_fields)
    |> validate_required(@required_fields)
    |> validate_formats()
    |> validate_lengths()
    |> validate_business_rules()
    |> unique_constraints()
  end

  @doc """
  Changeset para actualizaciones que no requieren todos los campos.
  """
  def update_changeset(<%= singular_name %>, attrs) do
    <%= singular_name %>
    |> cast(attrs, @all_fields)
    |> validate_formats()
    |> validate_lengths()
    |> validate_business_rules()
    |> unique_constraints()
  end

  # Validaciones de formato
  defp validate_formats(changeset) do
    changeset
<%= for {field, type} <- fields do %>
<%= if String.contains?(field, "email") do %>
    |> validate_format(:<%= field %>, ~r/^[^\s]+@[^\s]+\.[^\s]+$/, message: "debe ser un email válido")
<% end %>
<%= if String.contains?(field, "phone") do %>
    |> validate_format(:<%= field %>, ~r/^[\d\+\-\(\)\s]+$/, message: "debe ser un teléfono válido")
<% end %>
<%= if String.contains?(field, "url") do %>
    |> validate_format(:<%= field %>, ~r/^https?:\/\//, message: "debe ser una URL válida")
<% end %>
<% end %>
  end

  # Validaciones de longitud
  defp validate_lengths(changeset) do
    changeset
<%= for {field, type} <- fields do %>
<%= if type == :string do %>
    |> validate_length(:<%= field %>, min: 1, max: 255)
<% end %>
<%= if type == :text do %>
    |> validate_length(:<%= field %>, max: 5000)
<% end %>
<% end %>
  end

  # Validaciones de reglas de negocio
  defp validate_business_rules(changeset) do
    changeset
    |> validate_dates()
    |> validate_numbers()
    |> validate_custom_rules()
  end

  defp validate_dates(changeset) do
    changeset
<%= for {field, type} <- fields do %>
<%= if type in [:date, :naive_datetime, :utc_datetime] do %>
    |> validate_date_not_in_future(:<%= field %>)
<% end %>
<% end %>
  end

  defp validate_numbers(changeset) do
    changeset
<%= for {field, type} <- fields do %>
<%= if type == :integer do %>
    |> validate_number(:<%= field %>, greater_than: 0)
<% end %>
<% end %>
  end

  defp validate_custom_rules(changeset) do
    # Implementar validaciones específicas del dominio
    changeset
  end

  # Constraints de unicidad
  defp unique_constraints(changeset) do
    changeset
<%= for {field, _type} <- fields do %>
<%= if String.contains?(field, "email") or String.contains?(field, "username") or String.contains?(field, "slug") do %>
    |> unique_constraint(:<%= field %>, message: "<%= field %> ya está en uso")
<% end %>
<% end %>
  end

  # Helper para validar fechas no futuras
  defp validate_date_not_in_future(changeset, field) do
    validate_change(changeset, field, fn _, date ->
      if Date.compare(date, Date.utc_today()) == :gt do
        [{field, "no puede ser una fecha futura"}]
      else
        []
      end
    end)
  end
end
```

### 5. Configuración del Agente en Claude Code

#### Script de Inicialización
`.claude/init_agent.sh`:

```bash
#!/bin/bash

echo "🤖 Inicializando Agente Elixir/Phoenix para Claude Code..."

# Verificar que estamos en un proyecto Claude Code
if [ ! -f ".claude/config.json" ]; then
    echo "❌ No se detectó configuración de Claude Code"
    echo "Ejecuta 'claude code init' primero"
    exit 1
fi

# Registrar el agente
claude code agent register phoenix \
  --description "Agente especializado en desarrollo Elixir/Phoenix" \
  --context-file .claude/phoenix_agent.md \
  --commands-dir .claude/commands \
  --templates-dir .claude/templates

echo "✅ Agente Elixir/Phoenix registrado exitosamente"

# Configurar comandos personalizados
echo "🔧 Configurando comandos personalizados..."

# Hacer ejecutables todos los scripts
chmod +x .claude/commands/*.sh

# Crear aliases para comandos frecuentes
cat >> .claude/aliases.sh << 'EOF'
#!/bin/bash

# Aliases para comandos de Phoenix frecuentes
alias pnew='.claude/commands/phoenix_new.sh'
alias pcontext='.claude/commands/phoenix_context.sh'
alias plive='.claude/commands/phoenix_liveview.sh'
alias pauth='.claude/commands/phoenix_auth.sh'
alias pdocker='.claude/commands/phoenix_docker.sh'
alias papi='.claude/commands/phoenix_api.sh'
alias ptest='.claude/commands/phoenix_test.sh'
alias pdeploy='.claude/commands/phoenix_deploy.sh'
EOF

chmod +x .claude/aliases.sh

echo "✅ Comandos personalizados configurados"
echo ""
echo "📋 Agente listo para usar. Comandos disponibles:"
echo "   claude 'Crea un nuevo proyecto Phoenix llamado mi_app con LiveView'"
echo "   claude 'Genera un contexto Blog con schema Post para título y contenido'"
echo "   claude 'Implementa autenticación con Guardian JWT'"
echo "   claude 'Configura Docker para desarrollo y producción'"
echo ""
```

### 6. Comandos Adicionales Especializados

#### Comando: Autenticación con Guardian
`.claude/commands/phoenix_auth.sh`:

```bash
#!/bin/bash

set -e

AUTH_TYPE=${1:-"jwt"}  # jwt, session, oauth
PROVIDER=${2:-"google"}  # google, github, facebook (para oauth)

echo "🔐 Configurando autenticación: $AUTH_TYPE"

setup_jwt_auth() {
    echo "Configurando autenticación JWT con Guardian..."
    
    # Agregar dependencias
    cat >> mix.exs.tmp << 'EOF'
      {:guardian, "~> 2.3"},
      {:guardian_phoenix, "~> 2.0"},
      {:bcrypt_elixir, "~> 3.0"},
      {:comeonin, "~> 5.3"},
EOF
    
    sed '/# Producción/i\
'"$(cat mix.exs.tmp)" mix.exs > mix.exs.new && mv mix.exs.new mix.exs
    rm mix.exs.tmp
    
    mix deps.get
    
    # Crear configuración Guardian
    cat > lib/my_app_web/auth/guardian.ex << 'EOF'
defmodule MyAppWeb.Auth.Guardian do
  use Guardian, otp_app: :my_app

  alias MyApp.Accounts

  def subject_for_token(%{id: id}, _claims) do
    {:ok, to_string(id)}
  end

  def subject_for_token(_, _) do
    {:error, :invalid_resource}
  end

  def resource_from_claims(%{"sub" => id}) do
    case Accounts.get_user(id) do
      nil -> {:error, :resource_not_found}
      user -> {:ok, user}
    end
  end

  def resource_from_claims(_claims) do
    {:error, :invalid_claims}
  end

  def authenticate(email, password) do
    case Accounts.get_user_by_email(email) do
      nil ->
        Bcrypt.no_user_verify()
        {:error, :invalid_credentials}

      user ->
        if Bcrypt.verify_pass(password, user.password_hash) do
          create_token(user)
        else
          {:error, :invalid_credentials}
        end
    end
  end

  def create_token(user) do
    {:ok, token, _claims} = encode_and_sign(user, %{}, ttl: {24, :hours})
    {:ok, user, token}
  end
end
EOF

    # Crear pipeline de autenticación
    cat > lib/my_app_web/auth/pipeline.ex << 'EOF'
defmodule MyAppWeb.Auth.Pipeline do
  use Guardian.Plug.Pipeline,
    otp_app: :my_app,
    error_handler: MyAppWeb.Auth.ErrorHandler,
    module: MyAppWeb.Auth.Guardian

  plug Guardian.Plug.VerifyHeader, realm: "Bearer"
  plug Guardian.Plug.EnsureAuthenticated
  plug Guardian.Plug.LoadResource
end
EOF

    # Error handler
    cat > lib/my_app_web/auth/error_handler.ex << 'EOF'
defmodule MyAppWeb.Auth.ErrorHandler do
  import Plug.Conn
  import Phoenix.Controller

  @behaviour Guardian.Plug.ErrorHandler

  @impl Guardian.Plug.ErrorHandler
  def auth_error(conn, {type, _reason}, _opts) do
    body = Jason.encode!(%{error: to_string(type)})
    
    conn
    |> put_resp_content_type("application/json")
    |> send_resp(401, body)
  end
end
EOF

    # Contexto de Accounts
    mix phx.gen.context Accounts User users \
      email:string:unique \
      name:string \
      password_hash:string \
      active:boolean

    # Mejorar schema User
    cat > lib/my_app/accounts/user.ex << 'EOF'
defmodule MyApp.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset

  @primary_key {:id, :binary_id, autogenerate: true}
  @foreign_key_type :binary_id

  schema "users" do
    field :email, :string
    field :name, :string
    field :password_hash, :string
    field :password, :string, virtual: true
    field :password_confirmation, :string, virtual: true
    field :active, :boolean, default: true

    timestamps()
  end

  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name, :password, :password_confirmation, :active])
    |> validate_required([:email, :name, :password])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+\.[^\s]+$/)
    |> validate_length(:password, min: 8)
    |> validate_confirmation(:password)
    |> unique_constraint(:email)
    |> hash_password()
  end

  def update_changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :name, :active])
    |> validate_required([:email, :name])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+\.[^\s]+$/)
    |> unique_constraint(:email)
  end

  defp hash_password(%Ecto.Changeset{valid?: true, changes: %{password: password}} = changeset) do
    changeset
    |> put_change(:password_hash, Bcrypt.hash_pwd_salt(password))
    |> delete_change(:password)
    |> delete_change(:password_confirmation)
  end

  defp hash_password(changeset), do: changeset
end
EOF

    # Controllers de autenticación
    cat > lib/my_app_web/controllers/auth_controller.ex << 'EOF'
defmodule MyAppWeb.AuthController do
  use MyAppWeb, :controller
  
  alias MyAppWeb.Auth.Guardian
  alias MyApp.Accounts

  def register(conn, %{"user" => user_params}) do
    case Accounts.create_user(user_params) do
      {:ok, user} ->
        {:ok, user, token} = Guardian.create_token(user)
        
        conn
        |> put_status(:created)
        |> json(%{
          user: %{
            id: user.id,
            email: user.email,
            name: user.name
          },
          token: token
        })

      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: translate_errors(changeset)})
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    case Guardian.authenticate(email, password) do
      {:ok, user, token} ->
        conn
        |> json(%{
          user: %{
            id: user.id,
            email: user.email,
            name: user.name
          },
          token: token
        })

      {:error, :invalid_credentials} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Invalid credentials"})
    end
  end

  def logout(conn, _params) do
    token = Guardian.Plug.current_token(conn)
    Guardian.revoke(token)
    
    conn
    |> json(%{message: "Logged out successfully"})
  end

  def profile(conn, _params) do
    user = Guardian.Plug.current_resource(conn)
    
    conn
    |> json(%{
      user: %{
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active
      }
    })
  end

  defp translate_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, &translate_error/1)
  end
end
EOF

    echo "✅ Autenticación JWT configurada"
}

setup_oauth() {
    echo "Configurando OAuth con $PROVIDER..."
    
    # Agregar dependencias OAuth
    cat >> mix.exs.tmp << 'EOF'
      {:ueberauth, "~> 0.10"},
      {:ueberauth_google, "~> 0.10"},
      {:ueberauth_github, "~> 0.8"},
EOF
    
    sed '/# Producción/i\
'"$(cat mix.exs.tmp)" mix.exs > mix.exs.new && mv mix.exs.new mix.exs
    rm mix.exs.tmp
    
    mix deps.get
    
    # Configuración Ueberauth
    cat > lib/my_app_web/auth/oauth.ex << 'EOF'
defmodule MyAppWeb.Auth.OAuth do
  alias MyApp.Accounts
  alias MyAppWeb.Auth.Guardian

  def handle_oauth(%Ueberauth.Auth{} = auth) do
    case find_or_create_user(auth) do
      {:ok, user} ->
        Guardian.create_token(user)
      
      {:error, reason} ->
        {:error, reason}
    end
  end

  defp find_or_create_user(%Ueberauth.Auth{info: info}) do
    case Accounts.get_user_by_email(info.email) do
      nil ->
        Accounts.create_user(%{
          email: info.email,
          name: info.name || info.nickname,
          password: generate_random_password()
        })
      
      user ->
        {:ok, user}
    end
  end

  defp generate_random_password do
    :crypto.strong_rand_bytes(32) |> Base.encode64()
  end
end
EOF

    echo "✅ OAuth configurado para $PROVIDER"
}

case $AUTH_TYPE in
    "jwt")
        setup_jwt_auth
        ;;
    "oauth")
        setup_oauth
        ;;
    *)
        echo "Tipo de autenticación no soportado: $AUTH_TYPE"
        exit 1
        ;;
esac

echo ""
echo "🎉 Autenticación $AUTH_TYPE configurada exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Agregar rutas al router"
echo "   2. Configurar variables de entorno"
echo "   3. Ejecutar migraciones: mix ecto.migrate"
```

#### Comando: API RESTful Completa
`.claude/commands/phoenix_api.sh`:

```bash
#!/bin/bash

set -e

CONTEXT_NAME=${1?"Error: Especifica el nombre del contexto"}
RESOURCE_NAME=${2?"Error: Especifica el nombre del recurso"}
PLURAL_NAME=${3:-"${RESOURCE_NAME,,}s"}
shift 3
FIELDS=$@

echo "🔌 Generando API REST para: $CONTEXT_NAME.$RESOURCE_NAME"

generate_api_resource() {
    echo "Generando recurso API..."
    
    # Generar contexto y schema
    mix phx.gen.json $CONTEXT_NAME $RESOURCE_NAME $PLURAL_NAME \
        --binary-id \
        $FIELDS
    
    echo "✅ Recurso base generado"
}

enhance_api_controller() {
    echo "Mejorando controller API..."
    
    local app_name=$(mix phx.new.ecto --app | tail -1)
    local controller_file="lib/${app_name}_web/controllers/$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_controller.ex"
    
    # Backup
    cp "$controller_file" "${controller_file}.backup"
    
    # Controller mejorado con paginación, filtros y validaciones
    cat > "$controller_file" << EOF
defmodule ${app_name}Web.$(echo $RESOURCE_NAME)Controller do
  use ${app_name}Web, :controller

  alias ${app_name}.${CONTEXT_NAME}
  alias ${app_name}.${CONTEXT_NAME}.${RESOURCE_NAME}

  action_fallback ${app_name}Web.FallbackController

  def index(conn, params) do
    case get_index_strategy(params) do
      {:paginated, page, page_size} ->
        paginated_index(conn, page, page_size, params)
      
      {:filtered, filters} ->
        filtered_index(conn, filters)
      
      {:search, term} ->
        search_index(conn, term)
      
      :default ->
        default_index(conn)
    end
  end

  defp paginated_index(conn, page, page_size, _params) do
    result = ${CONTEXT_NAME}.list_$(echo $PLURAL_NAME)_paginated(page, page_size)
    
    conn
    |> put_resp_header("x-total-count", to_string(result.total_entries))
    |> put_resp_header("x-total-pages", to_string(result.total_pages))
    |> put_resp_header("x-current-page", to_string(result.page_number))
    |> render(:index, $(echo $PLURAL_NAME): result.entries)
  end

  defp filtered_index(conn, filters) do
    $(echo $PLURAL_NAME) = ${CONTEXT_NAME}.filter_$(echo $PLURAL_NAME)(filters)
    render(conn, :index, $(echo $PLURAL_NAME): $(echo $PLURAL_NAME))
  end

  defp search_index(conn, term) do
    $(echo $PLURAL_NAME) = ${CONTEXT_NAME}.search_$(echo $PLURAL_NAME)(term)
    render(conn, :index, $(echo $PLURAL_NAME): $(echo $PLURAL_NAME))
  end

  defp default_index(conn) do
    $(echo $PLURAL_NAME) = ${CONTEXT_NAME}.list_$(echo $PLURAL_NAME)()
    render(conn, :index, $(echo $PLURAL_NAME): $(echo $PLURAL_NAME))
  end

  def show(conn, %{"id" => id}) do
    $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]') = ${CONTEXT_NAME}.get_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')!(id)
    render(conn, :show, $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'): $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'))
  end

  def create(conn, %{"$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')" => $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_params}) do
    with {:ok, %${RESOURCE_NAME}{} = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')} <- ${CONTEXT_NAME}.create_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')($(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_params) do
      conn
      |> put_status(:created)
      |> put_resp_header("location", ~p"/api/$(echo $PLURAL_NAME)/#{$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')}")
      |> render(:show, $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'): $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'))
    end
  end

  def update(conn, %{"id" => id, "$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')" => $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_params}) do
    $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]') = ${CONTEXT_NAME}.get_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')!(id)

    with {:ok, %${RESOURCE_NAME}{} = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')} <- ${CONTEXT_NAME}.update_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')($(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'), $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_params) do
      render(conn, :show, $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'): $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'))
    end
  end

  def delete(conn, %{"id" => id}) do
    $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]') = ${CONTEXT_NAME}.get_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')!(id)

    with {:ok, %${RESOURCE_NAME}{}} <- ${CONTEXT_NAME}.delete_$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')($(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')) do
      send_resp(conn, :no_content, "")
    end
  end

  # Endpoints adicionales para operaciones bulk
  def bulk_create(conn, %{"$(echo $PLURAL_NAME)" => $(echo $PLURAL_NAME)_list}) do
    case ${CONTEXT_NAME}.bulk_create_$(echo $PLURAL_NAME)($(echo $PLURAL_NAME)_list) do
      {:ok, created_$(echo $PLURAL_NAME)} ->
        conn
        |> put_status(:created)
        |> render(:index, $(echo $PLURAL_NAME): created_$(echo $PLURAL_NAME))
      
      {:error, errors} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: errors})
    end
  end

  def bulk_update(conn, %{"updates" => updates}) do
    case ${CONTEXT_NAME}.bulk_update_$(echo $PLURAL_NAME)(updates) do
      {:ok, updated_$(echo $PLURAL_NAME)} ->
        render(conn, :index, $(echo $PLURAL_NAME): updated_$(echo $PLURAL_NAME))
      
      {:error, errors} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{errors: errors})
    end
  end

  def bulk_delete(conn, %{"ids" => ids}) do
    case ${CONTEXT_NAME}.bulk_delete_$(echo $PLURAL_NAME)(ids) do
      {:ok, _count} ->
        send_resp(conn, :no_content, "")
      
      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> json(%{error: reason})
    end
  end

  # Helpers para determinar estrategia de listado
  defp get_index_strategy(%{"page" => page, "page_size" => page_size}) do
    {:paginated, String.to_integer(page), String.to_integer(page_size)}
  end

  defp get_index_strategy(%{"search" => term}) when is_binary(term) and term != "" do
    {:search, term}
  end

  defp get_index_strategy(params) when map_size(params) > 0 do
    filters = Map.take(params, ["status", "category", "active"])
    if map_size(filters) > 0 do
      {:filtered, filters}
    else
      :default
    end
  end

  defp get_index_strategy(_), do: :default
end
EOF

    echo "✅ Controller API mejorado"
}

create_api_documentation() {
    echo "Creando documentación OpenAPI..."
    
    cat > lib/my_app_web/api_spec.ex << EOF
defmodule MyAppWeb.ApiSpec do
  alias OpenApiSpex.{Info, OpenApi, Paths, Server}
  alias MyAppWeb.Schemas

  @behaviour OpenApi

  @impl OpenApi
  def spec do
    %OpenApi{
      servers: [
        Server.from_endpoint(MyAppWeb.Endpoint)
      ],
      info: %Info{
        title: "MyApp API",
        version: "1.0",
        description: """
        API REST para gestión de recursos MyApp.
        
        ## Autenticación
        
        La API utiliza Bearer tokens para autenticación.
        Incluye el header: \`Authorization: Bearer <token>\`
        
        ## Paginación
        
        Los endpoints de listado soportan paginación via query parameters:
        - \`page\`: Número de página (default: 1)
        - \`page_size\`: Elementos por página (default: 20, max: 100)
        
        ## Filtros
        
        Muchos endpoints soportan filtros via query parameters.
        Ver documentación específica de cada endpoint.
        """
      },
      paths: Paths.from_router(MyAppWeb.Router)
    }
    |> OpenApiSpex.resolve_schema_modules()
  end
end
EOF

    # Schema para la documentación
    mkdir -p lib/my_app_web/schemas
    
    cat > lib/my_app_web/schemas/$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_schemas.ex << EOF
defmodule MyAppWeb.Schemas.$(echo $RESOURCE_NAME)Schemas do
  alias OpenApiSpex.Schema

  defmodule $(echo $RESOURCE_NAME) do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "$(echo $RESOURCE_NAME)",
      description: "Un recurso $(echo $RESOURCE_NAME)",
      type: :object,
      properties: %{
        id: %Schema{type: :string, format: :uuid, description: "ID único"},
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    case $field_type in
        "string") echo "        $field_name: %Schema{type: :string, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "text") echo "        $field_name: %Schema{type: :string, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "integer") echo "        $field_name: %Schema{type: :integer, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "boolean") echo "        $field_name: %Schema{type: :boolean, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "date") echo "        $field_name: %Schema{type: :string, format: :date, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "datetime") echo "        $field_name: %Schema{type: :string, format: :'date-time', description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
    esac
done)
        inserted_at: %Schema{type: :string, format: :'date-time', description: "Fecha de creación"},
        updated_at: %Schema{type: :string, format: :'date-time', description: "Fecha de última actualización"}
      },
      required: [:id],
      example: %{
        id: "550e8400-e29b-41d4-a716-446655440000",
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    case $field_type in
        "string") echo "        $field_name: \"ejemplo\"," ;;
        "text") echo "        $field_name: \"Texto de ejemplo más largo\"," ;;
        "integer") echo "        $field_name: 42," ;;
        "boolean") echo "        $field_name: true," ;;
        "date") echo "        $field_name: \"2023-12-01\"," ;;
        "datetime") echo "        $field_name: \"2023-12-01T10:00:00Z\"," ;;
    esac
done)
        inserted_at: "2023-12-01T10:00:00Z",
        updated_at: "2023-12-01T10:00:00Z"
      }
    })
  end

  defmodule $(echo $RESOURCE_NAME)Request do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "$(echo $RESOURCE_NAME)Request",
      description: "Datos para crear/actualizar $(echo $RESOURCE_NAME)",
      type: :object,
      properties: %{
$(for field in $FIELDS; do
    field_name=$(echo $field | cut -d: -f1)
    field_type=$(echo $field | cut -d: -f2)
    
    case $field_type in
        "string") echo "        $field_name: %Schema{type: :string, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "text") echo "        $field_name: %Schema{type: :string, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "integer") echo "        $field_name: %Schema{type: :integer, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "boolean") echo "        $field_name: %Schema{type: :boolean, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "date") echo "        $field_name: %Schema{type: :string, format: :date, description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
        "datetime") echo "        $field_name: %Schema{type: :string, format: :'date-time', description: \"$(echo $field_name | sed 's/_/ /g')\"}," ;;
    esac
done)
      },
      required: [$(echo $FIELDS | head -1 | cut -d: -f1 | xargs -I {} echo ":{}")]
    })
  end

  defmodule $(echo $RESOURCE_NAME)Response do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "$(echo $RESOURCE_NAME)Response",
      description: "Respuesta con datos de $(echo $RESOURCE_NAME)",
      type: :object,
      properties: %{
        data: $(echo $RESOURCE_NAME)
      }
    })
  end

  defmodule $(echo $RESOURCE_NAME)ListResponse do
    require OpenApiSpex

    OpenApiSpex.schema(%{
      title: "$(echo $RESOURCE_NAME)ListResponse",
      description: "Lista de $(echo $PLURAL_NAME)",
      type: :object,
      properties: %{
        data: %Schema{
          type: :array,
          items: $(echo $RESOURCE_NAME)
        }
      }
    })
  end
end
EOF

    echo "✅ Documentación OpenAPI creada"
}

create_api_tests() {
    echo "Creando tests comprehensivos para API..."
    
    local test_file="test/my_app_web/controllers/$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_controller_test.exs"
    
    cat >> "$test_file" << EOF

  describe "pagination" do
    test "supports pagination parameters", %{conn: conn} do
      # Crear múltiples registros
      Enum.each(1..25, fn i ->
        $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{name: "Item #{i}"})
      end)
      
      conn = get(conn, ~p"/api/$(echo $PLURAL_NAME)?page=2&page_size=10")
      
      assert json_response(conn, 200)["data"] |> length() == 10
      assert get_resp_header(conn, "x-current-page") == ["2"]
      assert get_resp_header(conn, "x-total-pages") == ["3"]
    end
  end

  describe "search" do
    test "searches $(echo $PLURAL_NAME) by term", %{conn: conn} do
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{name: "Búsqueda específica"})
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')2 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{name: "Otro término"})
      
      conn = get(conn, ~p"/api/$(echo $PLURAL_NAME)?search=específica")
      
      response = json_response(conn, 200)["data"]
      assert length(response) == 1
      assert List.first(response)["id"] == $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1.id
    end
  end

  describe "bulk operations" do
    test "creates multiple $(echo $PLURAL_NAME)", %{conn: conn} do
      $(echo $PLURAL_NAME)_data = [
        %{name: "Bulk 1"},
        %{name: "Bulk 2"},
        %{name: "Bulk 3"}
      ]
      
      conn = post(conn, ~p"/api/$(echo $PLURAL_NAME)/bulk", $(echo $PLURAL_NAME): $(echo $PLURAL_NAME)_data)
      
      response = json_response(conn, 201)["data"]
      assert length(response) == 3
    end
    
    test "updates multiple $(echo $PLURAL_NAME)", %{conn: conn} do
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')2 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      
      updates = [
        %{id: $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1.id, name: "Updated 1"},
        %{id: $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')2.id, name: "Updated 2"}
      ]
      
      conn = put(conn, ~p"/api/$(echo $PLURAL_NAME)/bulk", updates: updates)
      
      assert json_response(conn, 200)
    end
    
    test "deletes multiple $(echo $PLURAL_NAME)", %{conn: conn} do
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')2 = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture()
      
      ids = [$(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')1.id, $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')2.id]
      
      conn = delete(conn, ~p"/api/$(echo $PLURAL_NAME)/bulk", ids: ids)
      
      assert response(conn, 204)
    end
  end

  describe "error handling" do
    test "returns 404 for non-existent $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')", %{conn: conn} do
      conn = get(conn, ~p"/api/$(echo $PLURAL_NAME)/00000000-0000-0000-0000-000000000000")
      assert json_response(conn, 404)["errors"]["detail"] == "Not found"
    end
    
    test "returns validation errors on invalid data", %{conn: conn} do
      conn = post(conn, ~p"/api/$(echo $PLURAL_NAME)", $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]'): %{})
      
      assert json_response(conn, 422)["errors"] != %{}
    end
  end

  describe "filtering" do
    test "filters $(echo $PLURAL_NAME) by status", %{conn: conn} do
      _active = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{active: true})
      _inactive = $(echo $RESOURCE_NAME | tr '[:upper:]' '[:lower:]')_fixture(%{active: false})
      
      conn = get(conn, ~p"/api/$(echo $PLURAL_NAME)?active=true")
      
      response = json_response(conn, 200)["data"]
      assert length(response) == 1
      assert List.first(response)["active"] == true
    end
  end
EOF

    echo "✅ Tests API creados"
}

main() {
    generate_api_resource
    enhance_api_controller
    create_api_documentation
    create_api_tests
    
    echo ""
    echo "🔌 ¡API REST para $CONTEXT_NAME.$RESOURCE_NAME generada exitosamente!"
    echo ""
    echo "📋 Características incluidas:"
    echo "   ✅ CRUD completo"
    echo "   ✅ Paginación"
    echo "   ✅ Búsqueda"
    echo "   ✅ Filtros"
    echo "   ✅ Operaciones bulk"
    echo "   ✅ Documentación OpenAPI"
    echo "   ✅ Tests comprehensivos"
    echo ""
    echo "🔗 Agregar rutas al router:"
    echo "   scope \"/api\", MyAppWeb do"
    echo "     pipe_through :api"
    echo "     resources \"/$(echo $PLURAL_NAME)\", $(echo $RESOURCE_NAME)Controller"
    echo "     post \"/$(echo $PLURAL_NAME)/bulk\", $(echo $RESOURCE_NAME)Controller, :bulk_create"
    echo "     put \"/$(echo $PLURAL_NAME)/bulk\", $(echo $RESOURCE_NAME)Controller, :bulk_update"
    echo "     delete \"/$(echo $PLURAL_NAME)/bulk\", $(echo $RESOURCE_NAME)Controller, :bulk_delete"
    echo "   end"
}

main
```

#### Comando: Configuración Docker
`.claude/commands/phoenix_docker.sh`:

```bash
#!/bin/bash

set -e

ENV_TYPE=${1:-"development"}  # development, production
APP_NAME=${2:-"my_phoenix_app"}

echo "🐳 Configurando Docker para: $ENV_TYPE"

create_dockerfile() {
    echo "Creando Dockerfile..."
    
    cat > Dockerfile << 'EOF'
# Etapa de construcción
FROM hexpm/elixir:1.15.4-erlang-26.0.2-alpine-3.18.2 AS build

# Instalar dependencias del sistema
RUN apk add --no-cache \
    build-base \
    git \
    nodejs \
    npm

# Preparar directorio de trabajo
WORKDIR /app

# Instalar hex y rebar
RUN mix local.hex --force && \
    mix local.rebar --force

# Copiar archivos de configuración
COPY mix.exs mix.lock ./
COPY config config

# Instalar dependencias
ENV MIX_ENV=prod
RUN mix deps.get --only prod
RUN mix deps.compile

# Copiar assets y compilar
COPY assets assets
RUN cd assets && npm ci && npm run build
RUN mix phx.digest

# Copiar código fuente
COPY lib lib
COPY priv priv

# Compilar aplicación
RUN mix compile

# Crear release
RUN mix release

# Etapa de runtime
FROM alpine:3.18.2 AS runtime

# Instalar dependencias de runtime
RUN apk add --no-cache \
    openssl \
    ncurses-libs \
    libstdc++

# Crear usuario no-root
RUN addgroup -g 1000 -S phoenix && \
    adduser -u 1000 -S phoenix -G phoenix

# Crear directorios
WORKDIR /app
RUN chown phoenix:phoenix /app

# Copiar release
COPY --from=build --chown=phoenix:phoenix /app/_build/prod/rel/my_app ./

USER phoenix

# Configurar variables de entorno
ENV HOME=/app
ENV MIX_ENV=prod
ENV SECRET_KEY_BASE=changeme
ENV PHX_HOST=localhost
ENV PHX_PORT=4000

# Exponer puerto
EXPOSE 4000

# Comando por defecto
CMD ["bin/my_app", "start"]
EOF

    echo "✅ Dockerfile creado"
}

create_docker_compose() {
    echo "Creando docker-compose.yml..."
    
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${APP_NAME}_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./priv/repo/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  app:
    build: .
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/${APP_NAME}_dev"
      REDIS_URL: "redis://redis:6379/0"
      SECRET_KEY_BASE: "\${SECRET_KEY_BASE:-$(openssl rand -base64 48)}"
      PHX_HOST: "localhost"
      PHX_PORT: "4000"
      MIX_ENV: "${ENV_TYPE}"
    ports:
      - "4000:4000"
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - mix_deps:/app/deps
      - mix_build:/app/_build
      - node_modules:/app/assets/node_modules
    command: >
      sh -c "
        mix deps.get &&
        mix ecto.setup &&
        mix phx.server
      "

  app_test:
    build: .
    environment:
      DATABASE_URL: "postgresql://postgres:postgres@db:5432/${APP_NAME}_test"
      MIX_ENV: "test"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - .:/app
      - mix_deps:/app/deps
      - mix_build:/app/_build
    command: >
      sh -c "
        mix deps.get &&
        mix ecto.create &&
        mix ecto.migrate &&
        mix test
      "
    profiles:
      - testing

volumes:
  postgres_data:
  redis_data:
  mix_deps:
  mix_build:
  node_modules:
EOF

    echo "✅ docker-compose.yml creado"
}

create_production_compose() {
    echo "Creando docker-compose.prod.yml..."
    
    cat > docker-compose.prod.yml << EOF
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: "\${DATABASE_URL}"
      SECRET_KEY_BASE: "\${SECRET_KEY_BASE}"
      PHX_HOST: "\${PHX_HOST:-localhost}"
      PHX_PORT: "\${PHX_PORT:-4000}"
      REDIS_URL: "\${REDIS_URL}"
      MIX_ENV: "prod"
    ports:
      - "\${PHX_PORT:-4000}:4000"
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
    depends_on:
      - app
    restart: unless-stopped
EOF

    echo "✅ docker-compose.prod.yml creado"
}

create_dockerignore() {
    echo "Creando .dockerignore..."
    
    cat > .dockerignore << 'EOF'
# Git
.git
.gitignore

# Documentation
README.md
CHANGELOG.md

# Dependencies
deps/
_build/
node_modules/

# Testing
test/
cover/

# Development files
.elixir_ls/
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log

# Runtime
*.beam
*.ez

# Environment
.env
.env.local
.env.production

# Assets
assets/node_modules/
priv/static/assets/

# Database
*.db
*.sqlite
*.sqlite3
EOF

    echo "✅ .dockerignore creado"
}

create_health_endpoint() {
    echo "Creando endpoint de health check..."
    
    cat > lib/my_app_web/controllers/health_controller.ex << 'EOF'
defmodule MyAppWeb.HealthController do
  use MyAppWeb, :controller

  def check(conn, _params) do
    status = %{
      status: "ok",
      timestamp: DateTime.utc_now(),
      version: Application.spec(:my_app, :vsn),
      checks: %{
        database: check_database(),
        redis: check_redis()
      }
    }

    conn
    |> put_status(if all_healthy?(status.checks), do: :ok, else: :service_unavailable)
    |> json(status)
  end

  defp check_database do
    try do
      MyApp.Repo.query!("SELECT 1")
      %{status: "healthy", response_time: measure_time(fn -> MyApp.Repo.query!("SELECT 1") end)}
    rescue
      _ -> %{status: "unhealthy", error: "Database connection failed"}
    end
  end

  defp check_redis do
    try do
      case Redix.command(:redix, ["PING"]) do
        {:ok, "PONG"} -> 
          %{status: "healthy", response_time: measure_time(fn -> Redix.command(:redix, ["PING"]) end)}
        _ -> 
          %{status: "unhealthy", error: "Redis ping failed"}
      end
    rescue
      _ -> %{status: "unhealthy", error: "Redis connection failed"}
    end
  end

  defp all_healthy?(checks) do
    Enum.all?(checks, fn {_service, check} -> check.status == "healthy" end)
  end

  defp measure_time(fun) do
    {time, _result} = :timer.tc(fun)
    "#{time / 1000}ms"
  end
end
EOF

    echo "✅ Health endpoint creado"
}

create_nginx_config() {
    echo "Creando configuración Nginx..."
    
    cat > nginx.conf << 'EOF'
events {
    worker_connections 1024;
}

http {
    upstream phoenix {
        server app:4000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=web:10m rate=5r/s;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    server {
        listen 80;
        server_name _;

        # Redirect HTTP to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name _;

        # SSL Configuration
        ssl_certificate /etc/ssl/cert.pem;
        ssl_certificate_key /etc/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Static files
        location /css {
            alias /app/priv/static/css;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /js {
            alias /app/priv/static/js;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /images {
            alias /app/priv/static/images;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API routes with rate limiting
        location /api {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://phoenix;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Health check
        location /health {
            proxy_pass http://phoenix;
            access_log off;
        }

        # Main application
        location / {
            limit_req zone=web burst=10 nodelay;
            proxy_pass http://phoenix;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
        }
    }
}
EOF

    echo "✅ Configuración Nginx creada"
}

create_makefile() {
    echo "Creando Makefile para comandos comunes..."
    
    cat > Makefile << 'EOF'
.PHONY: help build up down logs shell test clean setup deploy

help: ## Mostrar ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $1, $2}'

build: ## Construir imagen Docker
	docker-compose build

up: ## Levantar servicios de desarrollo
	docker-compose up -d

down: ## Detener servicios
	docker-compose down

logs: ## Ver logs de la aplicación
	docker-compose logs -f app

shell: ## Acceder al shell de la aplicación
	docker-compose exec app /bin/sh

test: ## Ejecutar tests
	docker-compose --profile testing up app_test

clean: ## Limpiar containers y volúmenes
	docker-compose down -v
	docker system prune -f

setup: ## Setup inicial del proyecto
	docker-compose up -d db redis
	docker-compose run --rm app mix ecto.setup
	docker-compose run --rm app mix deps.get

deploy: ## Deploy a producción
	docker-compose -f docker-compose.prod.yml up -d

# Comandos de desarrollo
dev-setup: ## Setup de desarrollo completo
	make build
	make setup
	make up

dev-reset: ## Reset completo del entorno de desarrollo
	make clean
	make dev-setup

# Comandos de base de datos
db-migrate: ## Ejecutar migraciones
	docker-compose exec app mix ecto.migrate

db-rollback: ## Hacer rollback de última migración
	docker-compose exec app mix ecto.rollback

db-reset: ## Reset completo de la base de datos
	docker-compose exec app mix ecto.reset

# Comandos de testing
test-watch: ## Ejecutar tests en modo watch
	docker-compose exec app mix test.watch

test-coverage: ## Ejecutar tests con coverage
	docker-compose exec app mix test --cover

# Comandos de calidad de código
lint: ## Ejecutar linter
	docker-compose exec app mix credo --strict

format: ## Formatear código
	docker-compose exec app mix format

dialyzer: ## Ejecutar análisis estático
	docker-compose exec app mix dialyzer
EOF

    echo "✅ Makefile creado"
}

case $ENV_TYPE in
    "development")
        create_dockerfile
        create_docker_compose
        create_dockerignore
        create_health_endpoint
        create_makefile
        ;;
    "production")
        create_dockerfile
        create_docker_compose
        create_production_compose
        create_dockerignore
        create_health_endpoint
        create_nginx_config
        create_makefile
        ;;
    *)
        echo "Tipo de entorno no soportado: $ENV_TYPE"
        exit 1
        ;;
esac

echo ""
echo "🐳 ¡Configuración Docker para $ENV_TYPE completada!"
echo ""
echo "📋 Archivos creados:"
echo "   - Dockerfile"
echo "   - docker-compose.yml"
if [ "$ENV_TYPE" = "production" ]; then
    echo "   - docker-compose.prod.yml"
    echo "   - nginx.conf"
fi
echo "   - .dockerignore"
echo "   - Makefile"
echo ""
echo "🚀 Comandos útiles:"
echo "   make dev-setup  # Setup inicial completo"
echo "   make up         # Levantar servicios"
echo "   make logs       # Ver logs"
echo "   make test       # Ejecutar tests"
echo "   make help       # Ver todos los comandos"
```

### 7. Configuración Final y Uso del Agente

#### Activación del Agente
```bash
# Inicializar el agente
.claude/init_agent.sh

# Activar el agente en Claude Code
claude code use-agent phoenix

# Verificar que el agente está activo
claude code agent list
```

#### Ejemplos de Uso con Claude Code

```bash
# 1. Crear proyecto completo
claude "Crea un nuevo proyecto Phoenix llamado 'ecommerce_api' como API-only con PostgreSQL y autenticación JWT"

# 2. Generar contexto de negocio
claude "Genera un contexto Products con schema Product que tenga nombre, descripción, precio, stock y categoria_id como foreign key"

# 3. Implementar LiveView
claude "Crea un LiveView para Products con componentes reutilizables, búsqueda en tiempo real y filtros por categoría"

# 4. API REST completa
claude "Genera una API REST completa para Products con paginación, filtros, búsqueda, operaciones bulk y documentación OpenAPI"

# 5. Configurar autenticación
claude "Implementa autenticación JWT con Guardian, incluyendo registro, login, logout y middleware de protección"

# 6. Setup de Docker
claude "Configura Docker para desarrollo y producción con PostgreSQL, Redis, Nginx y health checks"

# 7. Testing comprehensivo
claude "Crea tests completos para el contexto Products incluyendo unit tests, integration tests y factories"

# 8. Deployment
claude "Configura deployment automatizado con Docker, CI/CD en GitHub Actions y variables de entorno"
```

### 8. Mejores Prácticas del Agente

El agente está configurado para seguir automáticamente las mejores prácticas de Elixir/Phoenix:

- **Arquitectura**: Contexts para lógica de negocio, separación clara entre capas web y dominio
- **Performance**: Queries optimizadas con Ecto, caching con Redis, lazy loading
- **Seguridad**: Validaciones robustas, sanitización de inputs, rate limiting
- **Testing**: Cobertura completa, factories para datos de prueba, tests de integración
- **Deployment**: Containerización con Docker, health checks, configuración de producción
- **Documentación**: OpenAPI specs, README comprehensivos, comentarios en código

### 9. Extensibilidad

El agente es completamente extensible:

- **Comandos personalizados**: Agregar nuevos scripts en `.claude/commands/`
- **Plantillas**: Crear templates específicos en `.claude/templates/`
- **Configuración**: Modificar comportamiento en `.claude/phoenix_agent.md`
- **Integraciones**: Conectar con otros servicios via MCP

Este agente especializado transforma Claude Code en un desarrollador Elixir/Phoenix experto, capaz de crear proyectos completos y robustos siguiendo las mejores prácticas del ecosistema.