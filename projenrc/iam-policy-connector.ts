import { Code, SourceCodeInfo } from './code';
import { IConnectorInfo } from './types';

export function generateIamPolicyConnector(info: IConnectorInfo) {
  const componentName = `${info.componentName}ConnectorReadWrite`;
  if (info.readStatement && info.writeStatement) {
    new Code(
      this.project,
      `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}-ReadWrite.ts`.toLowerCase(),
      componentName,
      {
        access: 'ReadWrite',
        componentNamePrefix: info.componentName,
        statement: info.readStatement,
        ...info,
      },
    );
  } else {
    if (info.readStatement) {
      new Code(
        this.project,
        `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}-Read.ts`.toLowerCase(),
        componentName,
        {
          access: 'Read',
          componentNamePrefix: info.componentName,
          statement: info.readStatement,
          ...info,
        },
      );
    }
    if (info.writeStatement) {
      new Code(
        this.project,
        `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}-Write.ts`.toLowerCase(),
        componentName,
        {
          access: 'Write',
          statement: info.writeStatement,
          componentNamePrefix: info.componentName,
          ...info,
        },
      );
    }
  }
}
