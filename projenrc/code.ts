import { Project, SourceCode } from 'projen';
import { Policy } from './profiles';

export interface SourceCodeInfo {
  sourceModule: string;
  sourceResource: string;
  destModule: string;
  destResource: string;
  componentNamePrefix: string;
  access: 'Read' | 'Write' | 'ReadWrite';
  statement?: Policy;
}

export class Code extends SourceCode {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: SourceCodeInfo,
  ) {
    super(project, filePath);
    if (this.marker) {
      this.line(`// ${this.marker}`);
    }
    this.line(`import * as pulumi from '@pulumi/pulumi';`);
    this.line(`import * as aws from '@pulumi/aws';`);
    this.line();
    this.open(`export interface ${componentName}Args {`);
    this.line(this.getArgLine('source', info.sourceResource));
    this.line();
    this.line(this.getArgLine('target', info.destResource));
    this.line();
    this.close('}');
    this.line();

    this.open(
      `export class ${componentName} extends pulumi.ComponentResource {`,
    );
    this.open(
      `constructor(name: string, args: ${componentName}Args, opts?: pulumi.ComponentResourceOptions) {`,
    );
    this.line(
      `super('aws-connectors:index:${componentName}', name, args, opts);`,
    );

    this.open('new aws.iam.RolePolicy(`${name}-policy`, {');
    this.line('role: args.target.role,');

    this.open('policy: {');
    this.line("Version: '2012-10-17',");
    this.open('Statement: [');
    if (info.statement) {
      this.writePolicy(this, info, info.statement);
    }

    this.close('});');

    this.line('this.registerOutputs({});');
    this.close('}');
  }

  private writePolicy(src: SourceCode, info: SourceCodeInfo, policy: Policy) {
    for (const statement of policy.Statement) {
      src.open('{');
      src.line(`Effect: '${statement.Effect}',`);
      src.line(
        `Action: ${Array.isArray(statement.Action) ? statement.Action.join(', ') : statement.Action},`,
      );
      src.line(
        `Resource: ${Array.isArray(statement.Resource) ? statement.Resource.join(', ') : statement.Resource},`.replace(
          /%{(\w+)\.(\w+)}/g,
          (_match, type, attr) => {
            return this.getInterpolateString(info, type, attr);
          },
        ),
      );
      if (statement.Principal) {
        src.open('Principal: {');
        src.line(`Service: '${statement.Principal.Service}',`);
        src.close('},');
      }
      if (statement.Condition) {
        src.open('Condition: {');
        src.open('ArnEquals: {');
        src.line(
          `'aws:SourceArn': '${statement.Condition.ArnEquals['aws:SourceArn']}',`,
        );
        src.close('},');
        src.close('},');
      }
      src.close('},');
    }
  }
  private getInterpolateString(
    info: SourceCodeInfo,
    referenceType: string,
    attribute: string,
  ): string {
    if (referenceType === 'Source') {
      return `pulumi.interpolate\`\${args.source.${this.getReference(info.sourceResource, attribute)}}\``;
    }
    return `pulumi.interpolate\`\${args.target.${this.getReference(info.destResource, attribute)}}\``;
  }

  private getReference(resourceType: string, attribute: string): string {
    switch (resourceType) {
      case 'Function':
        switch (attribute) {
          case 'Arn':
            return 'arn';
          default:
            throw new Error(`Unsupported attribute: ${attribute}`);
        }
      default:
        throw new Error(`Unsupported type: ${resourceType}`);
    }
  }
  private getArgLine(typ: string, resourceType: string): string {
    switch (resourceType) {
      case 'Function':
        return `${typ}: aws.lambda.Function;`;
      default:
        throw new Error(`Unsupported type: ${resourceType}`);
    }
  }
}
