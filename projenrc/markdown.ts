import * as fs from 'fs';
import * as path from 'path';
export interface MarkdownEntry {
  componentName: string;
  description: string;
  link: string;
}

export function main() {
  const readme = fs.readFileSync(path.join(__dirname, '../README.md'), {
    encoding: 'utf-8',
  });
  const readmeLines = readme.split('\n');
  const profiles = fs.readFileSync(path.join(__dirname, '../profiles.md'), {
    encoding: 'utf-8',
  });
  const profilesLines = profiles.split('\n');
  const connectorIndex = readmeLines.indexOf('## Supported Connectors');
  const withoutConnectors = readmeLines.slice(0, connectorIndex);

  fs.writeFileSync(
    path.join(__dirname, '../README.md'),
    withoutConnectors.concat(profilesLines).concat(['\n']).join('\n'),
    { encoding: 'utf-8' },
  );
}

main();
