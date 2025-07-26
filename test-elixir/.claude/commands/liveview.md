# Phoenix LiveView Generator

Create a Phoenix LiveView named $ARGUMENTS following LiveView conventions.

## Steps

1. **Analyze project structure**: Check existing LiveViews to understand file organization and patterns
2. **Examine component patterns**: Review existing components to understand styling and structure
3. **Review template patterns**: Check existing templates for consistent HTML structure
4. **Create LiveView module**: Generate LiveView with proper callbacks (mount, handle_event, handle_info)
5. **Implement template**: Create HEEx template with proper Phoenix components
6. **Add route configuration**: Update router with proper live routes
7. **Implement real-time features**: Add PubSub integration if needed
8. **Add tests**: Write comprehensive LiveView tests
9. **Verify integration**: Ensure LiveView works with existing project setup

## Requirements

- Follow Phoenix LiveView conventions and patterns
- Use proper mount/3 callback with socket assignment
- Implement handle_event/3 for user interactions
- Use Phoenix.Component for reusable UI elements
- Add proper loading states and error handling
- Include accessibility attributes in templates
- Write both unit and integration tests
- Follow existing project styling patterns

## Important Notes

- ALWAYS examine existing LiveViews first to understand project patterns
- Use the same component and styling approach as other LiveViews
- Follow the project's PubSub patterns for real-time features
- Don't add new dependencies without asking first
- Consider performance with temporary assigns for large data
- Use live_component for reusable stateful components
- Implement proper error boundaries and fallbacks