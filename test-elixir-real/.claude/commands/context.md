# Elixir Context Generator

Create an Elixir context named $ARGUMENTS following Phoenix conventions.

## Steps

1. **Analyze project structure**: Check existing contexts to understand file organization and naming patterns
2. **Examine schema patterns**: Review existing schemas to understand field types, validations, and associations
3. **Review migration patterns**: Check existing migrations to understand database conventions
4. **Create context module**: Generate context module with proper functions and documentation
5. **Implement schema**: Create Ecto schema with appropriate fields, validations, and associations
6. **Generate migration**: Create database migration with proper field types and indexes
7. **Add tests**: Write comprehensive tests following ExUnit patterns
8. **Verify integration**: Ensure context works with existing project setup

## Requirements

- Follow Phoenix context conventions
- Use proper Ecto patterns for schemas and changesets
- Include comprehensive function documentation with @doc
- Add appropriate database indexes for queries
- Write both positive and negative test cases
- Follow existing project naming conventions
- Use proper Elixir types and specs

## Important Notes

- ALWAYS examine existing contexts first to understand project patterns
- Use the same field naming conventions as other schemas
- Follow the project's validation patterns and error handling
- Don't add new dependencies without asking first
- Consider query optimization with proper indexes
- Use Ecto.Multi for complex transactions when appropriate