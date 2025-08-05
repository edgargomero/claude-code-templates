const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');

async function init() {
    try {
        const files = await new Promise((resolve, reject) => {
            glob('**/*', { ignore: ['node_modules/**', '.git/**'], nodir: true }, (err, files) => {
                if (err) {
                    return reject(err);
                }
                resolve(files);
            });
        });

        const projectRoot = process.cwd();
        const geminiConfigPath = path.join(projectRoot, 'GEMINI.md');

        let content = '# Gemini Configuration\n\nThis file contains the configuration for Gemini.\n\n## Project Structure\n\nThis project appears to be a '; 

        const packageJsonPath = path.join(projectRoot, 'package.json');
        try {
            const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
            content += `**${packageJson.name}** project.\n\n`;

            if (packageJson.dependencies) {
                content += '### Dependencies\n\n';
                content += Object.keys(packageJson.dependencies).map(dep => `- ${dep}`).join('\n');
                content += '\n\n';
            }

            if (packageJson.devDependencies) {
                content += '### Dev Dependencies\n\n';
                content += Object.keys(packageJson.devDependencies).map(dep => `- ${dep}`).join('\n');
                content += '\n\n';
            }

            if (packageJson.scripts) {
                content += '### Scripts\n\n';
                content += Object.entries(packageJson.scripts).map(([name, script]) => `- **${name}**: `${script}``).join('\n');
                content += '\n\n';
            }

        } catch (error) {
            // no package.json found
            content += 'project.\n\n';
        }

        content += '## Files\n\n';
        content += files.map(file => `- `${file}``).join('\n');

        await fs.writeFile(geminiConfigPath, content);
        console.log(`Created configuration file at ${geminiConfigPath}`);

    } catch (error) {
        console.error('Error creating GEMINI.md:', error);
    }
}

module.exports = { init };
