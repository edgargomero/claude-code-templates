# gemini-config.md: Guía para Interactuar con Gemini

Este archivo es tu guía para trabajar conmigo, Gemini, en este repositorio. El objetivo es que puedas usar mis capacidades para realizar las mismas tareas que harías con la herramienta `claude-code-templates`, pero de una manera más conversacional y flexible.

## 1. El Archivo `GEMINI.md`: Mi Fuente de Verdad

He creado archivos `GEMINI.md` a lo largo del proyecto, que son mi principal fuente de conocimiento sobre la arquitectura, comandos y convenciones de este repositorio.

- **Qué es:** Un manual de instrucciones para mí. Contiene los comandos de desarrollo, la estructura del proyecto, las guías de estilo de código y las tecnologías utilizadas.
- **Cómo usarlo:** Antes de pedirme una tarea, puedes consultar el `GEMINI.md` relevante para conocer los comandos disponibles. Sin embargo, no es estrictamente necesario que lo hagas, ya que yo lo consultaré automáticamente cuando me pidas algo.

**Ejemplo de interacción:**
> **Tú:** "Necesito iniciar el servidor de desarrollo para la documentación."
> **Yo:** (Consulto `GEMINI.md` en `/docu`, encuentro el comando `npm start` y te propongo ejecutarlo).

## 2. Ejecución de Comandos

Puedo ejecutar cualquier comando definido en los archivos `GEMINI.md`. Simplemente tienes que pedírmelo en lenguaje natural.

- **Instalar dependencias:**
  - "Instala las dependencias del CLI." (Ejecutaré `npm install` en `/cli-tool`)
- **Iniciar servicios:**
  - "Inicia el dashboard de analíticas." (Ejecutaré `npm run analytics:start` en `/cli-tool`)
- **Correr pruebas:**
  - "Ejecuta todas las pruebas para el CLI." (Ejecutaré `npm test` en `/cli-tool`)
  - "Corre solo las pruebas de integración." (Ejecutaré `npm run test:integration` en `/cli-tool`)
- **Calidad de código:**
  - "Formatea todo el código del CLI con Prettier." (Ejecutaré `npm run format` en `/cli-tool`)
  - "Revisa si hay errores de linting." (Ejecutaré `npm run lint` en `/cli-tool`)

## 3. Uso de Plantillas de Proyecto

El corazón de `claude-code-templates` es su sistema de plantillas. Puedes pedirme que use esas mismas plantillas para configurar nuevos módulos o proyectos.

- **Ruta de plantillas:** `/cli-tool/templates`
- **Cómo usarlo:** Sé específico sobre la plantilla que quieres usar y dónde quieres aplicarla.

**Ejemplo de interacción:**
> **Tú:** "Crea una nueva configuración para una aplicación de React en la carpeta `mi-nueva-app-react` usando las plantillas existentes."
> **Yo:** (Buscaré la plantilla de React en `/cli-tool/templates/javascript-typescript/examples/react-app`, copiaré los archivos (`GEMINI.md`, `.mcp.json`, etc.) a la nueva carpeta y los adaptaré si es necesario).

## 4. Reemplazo de Comandos Personalizados (Slash Commands)

Mientras que Claude puede usar "slash commands" (ej. `/lint`), mi enfoque es conversacional. No necesitas memorizar comandos específicos.

- **En lugar de `/lint`:**
  - "Revisa la calidad del código en el archivo `cli-tool/src/analytics.js`."
- **En lugar de `/test`:**
  - "Escribe y ejecuta pruebas para la nueva función `calculateStats` que acabo de agregar."
- **En lugar de `/commit`:**
  - "Prepara un commit con los últimos cambios. El mensaje debe ser 'feat: Añade soporte para WebSockets en el servidor de analíticas'."

## 5. Flujo de Trabajo de Desarrollo Sugerido

1.  **Análisis y Comprensión:**
    - "Analiza el archivo `cli-tool/src/file-operations.js` y explícame qué hace y cómo se relaciona con otros módulos."
2.  **Implementación de Cambios:**
    - "Añade una nueva función a `file-operations.js` llamada `deleteFile(filePath)` que elimine un archivo de forma segura."
3.  **Pruebas:**
    - "Ahora, crea pruebas unitarias para la función `deleteFile` y ejecútalas para asegurarte de que funciona correctamente."
4.  **Verificación y Commit:**
    - "Verifica que todos los tests del proyecto sigan pasando. Si es así, prepara un commit con los cambios."

Mi objetivo es ser un asistente proactivo. Siempre que realices cambios, te sugeriré los siguientes pasos lógicos, como correr pruebas o actualizar la documentación. ¡Solo tienes que pedírmelo!
