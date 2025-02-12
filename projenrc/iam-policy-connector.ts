import { Project } from 'projen';
import { Code, CodeInfo } from './code';
import { Policy } from './profiles';
import { IConnectorInfo } from './types';

export interface IamPolicyCodeInfo extends CodeInfo {
  sourcePolicy: boolean;
  readStatement?: Policy;
  writeStatement?: Policy;
}

export function generateIamPolicyConnector(
  project: Project,
  info: IConnectorInfo,
) {
  const componentName = `${info.componentName}Connector`;
  const description = `Connect a ${info.sourceModule} ${info.sourceResource} to a ${info.destModule} ${info.destResource}.`;
  new IamPolicyCode(
    project,
    `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}.ts`.toLowerCase(),
    componentName,
    {
      componentNamePrefix: info.componentName,
      readStatement: info.readStatement,
      writeStatement: info.writeStatement,
      ...info,
    },
  );
  return {
    componentName,
    description,
    link: `[aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/)`,
  };
}

export class IamPolicyCode extends Code {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: IamPolicyCodeInfo,
  ) {
    const additionalArgs =
      info.readStatement && info.writeStatement
        ? [
            '',
            '/**',
            ' * The access level for the policy.',
            ' *',
            ' * @default Access.READ',
            ' */',
            'access?: Access;',
          ]
        : undefined;
    super(
      project,
      filePath,
      componentName,
      {
        ...info,
        accessLevel: info.readStatement && info.writeStatement ? true : false,
      },
      additionalArgs,
    );

    if (info.readStatement && info.writeStatement) {
      this.line('const access = args.access ?? Access.READ;');
      this.line();
      this.line('const readPolicies: aws.iam.PolicyStatement[] = [];');
      this.line('const writePolicies: aws.iam.PolicyStatement[] = [];');
      this.open('readPolicies.push(');
      this.writePolicy(this, info, info.readStatement);
      this.close(');');
      this.open('writePolicies.push(');
      this.writePolicy(this, info, info.writeStatement);
      this.close(');');
    }

    this.line('const statements: aws.iam.PolicyStatement[] = [];');
    if (info.readStatement && !info.writeStatement) {
      this.open('statements.push(');
      this.writePolicy(this, info, info.readStatement);
      this.close(');');
    }
    if (!info.readStatement && info.writeStatement) {
      this.open('statements.push(');
      this.writePolicy(this, info, info.writeStatement);
      this.close(');');
    }
    if (info.readStatement && info.writeStatement) {
      this.open(
        'if (access === Access.READ || access === Access.READ_WRITE) {',
      );
      this.line('statements.push(...readPolicies);');
      this.close('}');
      this.open(
        'if (access === Access.WRITE || access === Access.READ_WRITE) {',
      );
      this.line('statements.push(...writePolicies);');
      this.close('}');
    }

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
    this.line('Statement: statements,');
    this.close('}');
    this.close('}, opts);');

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
