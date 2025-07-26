# GenServer Generator

Create an Elixir GenServer named $ARGUMENTS following OTP conventions.

## Steps

1. **Analyze project structure**: Check existing GenServers to understand supervision and organization patterns
2. **Examine supervisor patterns**: Review existing supervisors to understand child specification patterns
3. **Review state management**: Check how other GenServers manage state and handle calls/casts
4. **Create GenServer module**: Generate GenServer with proper callbacks and documentation
5. **Implement client API**: Create public client functions for interacting with the server
6. **Add supervision**: Update application supervisor or create child supervisor
7. **Implement error handling**: Add proper error handling and recovery patterns
8. **Add tests**: Write comprehensive tests for both client API and server callbacks
9. **Verify integration**: Ensure GenServer integrates properly with application supervision tree

## Requirements

- Follow OTP GenServer conventions and patterns
- Implement proper init/1 callback with state initialization
- Add handle_call/3, handle_cast/2, and handle_info/2 as needed
- Include comprehensive client API with proper documentation
- Add proper supervision with restart strategies
- Use proper Elixir types and specs (@spec)
- Implement graceful shutdown with terminate/2 if needed
- Write both unit tests and integration tests

## Important Notes

- ALWAYS examine existing GenServers first to understand project patterns
- Follow the project's supervision tree structure
- Use appropriate restart strategies (:permanent, :temporary, :transient)
- Consider using Registry for process discovery if needed
- Don't forget to add the GenServer to the supervision tree
- Implement proper backpressure and rate limiting if handling external requests
- Use proper timeout values for calls to prevent blocking