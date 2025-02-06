import { Project } from 'projen';
import { Code, CodeInfo } from './code';
import { Policy } from './profiles';
import { IConnectorInfo } from './types';

export interface IamPolicyCodeInfo extends CodeInfo {
  sourcePolicy: boolean;
  access: 'Read' | 'Write' | 'ReadWrite';
  statement?: Policy;
}

export function generateIamPolicyConnector(
  project: Project,
  info: IConnectorInfo,
) {
  const componentName = `${info.componentName}ConnectorReadWrite`;
  if (info.readStatement && info.writeStatement) {
    new IamPolicyCode(
      project,
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
      new IamPolicyCode(
        project,
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
      new IamPolicyCode(
        project,
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

export class IamPolicyCode extends Code {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: IamPolicyCodeInfo,
  ) {
    super(project, filePath, componentName, info);

    this.open('new aws.iam.RolePolicy(`${name}-policy`, {');
    if (info.sourcePolicy) {
      this.line(
        `role: args.source.${this.getRoleAttribute(info.sourceResource)},`,
      );
    } else {
      this.line(
        `role: args.target.${this.getRoleAttribute(info.destResource)},`,
      );
    }

    this.open('policy: {');
    this.line("Version: '2012-10-17',");
    this.open('Statement: [');
    if (info.statement) {
      this.writePolicy(this, info, info.statement);
    }

    this.close('],');
    this.close('}');
    this.close('});');

    this.closeCode();
  }

  private getRoleAttribute(resourceType: string): string {
    switch (resourceType) {
      case 'Function':
        return 'role';
      case 'DataSource':
        return 'serviceRoleArn.apply(arn => arn!)';
      case 'Rule':
        return 'roleArn.apply(arn => arn!)';
      case 'StateMachine':
        return 'roleArn';
      default:
        return 'role';
    }
  }
}
