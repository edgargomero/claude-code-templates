const { interactivePrompts } = require('./src/prompts');
const { getTemplateConfig } = require('./src/templates');

async function testInteractiveMode() {
  console.log('Testing interactive mode simulation...');
  
  // Simulate the projectInfo that would be detected
  const projectInfo = {
    detectedLanguage: 'common',
    detectedFramework: 'none'
  };
  
  // Simulate user answers as if they went through the interactive flow
  const mockAnswers = {
    language: 'elixir',
    framework: 'phoenix',
    commands: [],
    hooks: ['preToolUse', 'postToolUse'],
    mcps: ['elixir-ls', 'phoenix-server'],
    analytics: false,
    confirm: true
  };
  
  console.log('Mock answers:', mockAnswers);
  
  try {
    const templateConfig = getTemplateConfig(mockAnswers);
    console.log('SUCCESS: Template config generated:', templateConfig);
  } catch (error) {
    console.log('ERROR:', error.message);
    console.log('The config object passed was:', mockAnswers);
  }
}

testInteractiveMode();