// Simple test to debug the actual interactive flow
const { interactivePrompts } = require('./src/prompts');

async function testRealInteractive() {
  console.log('🧪 Testing REAL interactive prompts...');
  
  const projectInfo = {
    detectedLanguage: 'common',
    detectedFramework: 'none'
  };
  
  const options = {}; // No language or framework specified, force interactive
  
  try {
    console.log('🔄 Calling interactivePrompts...');
    const result = await interactivePrompts(projectInfo, options);
    console.log('✅ Interactive prompts result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Error in interactive prompts:', error.message);
  }
}

testRealInteractive();