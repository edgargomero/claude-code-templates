# GEMINI.md: Guía Maestra de Interacción y Desarrollo

Este archivo es la guía central para Gemini. Proporciona el contexto, los comandos y las convenciones necesarias para colaborar eficazmente en este repositorio.

## 1. Cómo Interactuar con Gemini

Mi objetivo es ser un asistente proactivo y autónomo. No necesitas darme instrucciones demasiado explícitas. Háblame en lenguaje natural y yo me encargaré de los detalles.

- **Para ejecutar comandos:** "Ejecuta las pruebas unitarias", "Inicia el servidor de desarrollo", "Formatea el código".
- **Para escribir código:** "Crea una función que reciba un usuario y devuelva su nombre completo", "Refactoriza este componente para que use hooks".
- **Para analizar código:** "Explícame cómo funciona el sistema de autenticación", "Encuentra posibles bugs en este archivo".
- **Para gestionar el repositorio:** "Prepara un commit con los últimos cambios y un mensaje apropiado", "Crea una nueva rama para desarrollar la funcionalidad de pagos".

Yo me encargaré de encontrar los comandos correctos, seguir las convenciones de código y aplicar las mejores prácticas definidas en este archivo.

---

## 2. Guías de Desarrollo Universales

### Git Workflow
- **Ramas:** `feat/nombre-funcionalidad`, `fix/nombre-bug`, `chore/nombre-tarea`.
- **Commits:** Sigue el estándar de [Conventional Commits](https://www.conventionalcommits.org/).
  - `feat:` para nuevas funcionalidades.
  - `fix:` para corrección de errores.
  - `docs:` para cambios en la documentación.
  - `style:` para formateo y estilos.
  - `refactor:` para refactorizaciones de código.
  - `test:` para añadir o modificar pruebas.
  - `chore:` para tareas de mantenimiento.
- **Pull Requests (PRs):** Deben tener una descripción clara y estar vinculados a un issue si aplica.

### Calidad de Código
- **Principio de Responsabilidad Única (SRP):** Cada función, clase o módulo debe hacer una sola cosa.
- **DRY (Don't Repeat Yourself):** Evita la duplicación de código.
- **KISS (Keep It Simple, Stupid):** Prefiere soluciones sencillas y claras.
- **Comentarios:** Comenta el *porqué* del código, no el *qué*. El código debe ser autoexplicativo.

---

## 3. Configuración Específica del Proyecto

**(Esta sección debe ser adaptada para cada proyecto)**

### 3.1. Comandos de Desarrollo

| Tarea | Comando | Directorio |
| :--- | :--- | :--- |
| **Instalar Dependencias** | `npm install` | `(root)` |
| **Iniciar Servidor Dev** | `npm run dev` | `(root)` |
| **Ejecutar Pruebas** | `npm test` | `(root)` |
| **Pruebas Unitarias** | `npm run test:unit` | `(root)` |
| **Pruebas de Integración**| `npm run test:integration`| `(root)` |
| **Linting** | `npm run lint` | `(root)` |
| **Formateo de Código** | `npm run format` | `(root)` |
| **Build de Producción** | `npm run build` | `(root)` |

### 3.2. Pila Tecnológica
- **Lenguaje Principal:** JavaScript / TypeScript
- **Framework Frontend:** React / Next.js
- **Framework Backend:** Node.js / Express.js
- **Base de Datos:** PostgreSQL
- **Testing:** Jest, Testing Library, Cypress
- **Estilos:** Tailwind CSS

### 3.3. Estructura del Proyecto
```
/
├── src/
│   ├── components/     # Componentes de UI reutilizables
│   ├── pages/          # Páginas o rutas de la aplicación
│   ├── lib/            # Funciones de ayuda, clientes de API
│   ├── hooks/          # Hooks de React personalizados
│   ├── styles/         # Estilos globales
│   └── types/          # Definiciones de TypeScript
├── tests/
│   ├── unit/
│   └── integration/
├── public/             # Archivos estáticos
├── .github/            # Workflows de CI/CD
├── package.json
└── tsconfig.json
```

### 3.4. Convenciones de Código
- **Nombrado de Archivos:** `kebab-case.ts` (ej. `user-profile.tsx`)
- **Componentes:** `PascalCase` (ej. `UserProfile`)
- **Variables y Funciones:** `camelCase` (ej. `getUserProfile`)
- **Constantes:** `UPPER_SNAKE_CASE` (ej. `API_URL`)
- **Tipos e Interfaces:** `PascalCase` (ej. `IUserProfile`)

---

## 4. Flujo de Trabajo de Desarrollo con Gemini

1.  **Pide la funcionalidad:** "Implementa el login de usuario con correo y contraseña".
2.  **Revisión (Opcional):** Yo crearé los archivos y el código necesarios. Puedes revisarlos si quieres.
3.  **Pruebas:** Automáticamente, crearé y ejecutaré las pruebas para la nueva funcionalidad.
4.  **Commit:** Una vez que las pruebas pasen, prepararé un commit con un mensaje descriptivo.
5.  **Siguiente paso:** Te preguntaré qué hacer a continuación.

¡Estoy listo para empezar a trabajar!
