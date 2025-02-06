import { Project, SourceCode } from 'projen';
import { Policy } from './profiles';

export interface CodeInfo {
  sourceResource: string;
  sourceModule: string;
  destModule: string;
  destResource: string;
  componentNamePrefix: string;
}

export class Code extends SourceCode {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: CodeInfo,
  ) {
    super(project, filePath);
    if (this.marker) {
      this.line(`// ${this.marker}`);
    }
    this.line(`import * as aws from '@pulumi/aws';`);
    this.line(`import * as pulumi from '@pulumi/pulumi';`);
    this.line();
    this.open(`export interface ${componentName}Args {`);
    this.line(
      this.getArgLine('source', info.sourceModule, info.sourceResource),
    );
    this.line();
    this.line(this.getArgLine('target', info.destModule, info.destResource));
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
  }

  protected writePolicy(src: SourceCode, info: CodeInfo, policy: Policy) {
    for (const statement of policy.Statement) {
      const action = Array.isArray(statement.Action)
        ? statement.Action
        : [statement.Action];
      const resources = Array.isArray(statement.Resource)
        ? statement.Resource
        : [statement.Resource];
      src.open('{');
      src.line(`Effect: '${statement.Effect}',`);
      src.open('Action: [');
      action.forEach((a) => src.line(`'${a}',`));
      src.close('],');
      src.open('Resource: [');
      resources.forEach((res) => {
        const match = res.match(/%{(\w+)\.(\w+)}/);
        if (!match) {
          src.line(`'${res}',`);
        } else {
          src.line(
            `pulumi.interpolate\`${res}\`,`.replace(
              /%{(\w+)\.(\w+)}/g,
              (_, type, attr) => {
                return `\${${this.getInterpolateString(info, type, attr)}}`;
              },
            ),
          );
        }
      });
      src.close('],');
      if (statement.Principal) {
        src.open('Principal: {');
        src.line(`Service: '${statement.Principal.Service}',`);
        src.close('},');
      }
      if (statement.Condition) {
        src.open('Condition: {');
        src.open('ArnEquals: {');
        src.line(
          `'aws:SourceArn': ${this.getInterpolateString(info, 'Source', 'Arn')},`,
        );
        src.close('},');
        src.close('},');
      }
      src.close('},');
    }
  }

  protected closeCode(): void {
    this.line('this.registerOutputs({});');
    this.close('}');
    this.close('}');
  }
  protected getInterpolateString(
    info: CodeInfo,
    referenceType: string,
    attribute: string,
  ): string {
    if (referenceType === 'Source') {
      return `\args.source.${this.getReference(info.sourceResource, attribute)}`;
    }
    return `\args.target.${this.getReference(info.destResource, attribute)}`;
  }

  protected getReference(resourceType: string, attribute: string): string {
    switch (attribute) {
      case 'Arn':
        switch (resourceType) {
          case 'Function':
            return 'arn';
          default:
            return 'arn';
        }
      default:
        return attribute.toLowerCase();
    }
  }
  protected getArgLine(
    typ: string,
    module: string,
    resourceType: string,
  ): string {
    switch (resourceType) {
      case 'Function':
        return `${typ}: aws.lambda.Function;`;
      case 'StateMachine':
        return `${typ}: aws.sfn.StateMachine;`;
      case 'Rule':
        return `${typ}: aws.cloudwatch.EventRule;`;
      case 'EventBus':
        return `${typ}: aws.cloudwatch.EventBus;`;
      default:
        return `${typ}: aws.${module.toLowerCase()}.${resourceType};`;
    }
  }
}
