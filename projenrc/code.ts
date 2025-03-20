import { Project, SourceCode } from 'projen';
import { Policy } from './profiles';

export interface CodeInfo {
  sourceResource: string;
  sourceModule: string;
  destModule: string;
  destResource: string;
  componentNamePrefix: string;
  accessLevel?: boolean;
}

export class Code extends SourceCode {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: CodeInfo,
    additionalArgs?: string[],
  ) {
    super(project, filePath);
    if (this.marker) {
      this.line(`// ${this.marker}`);
    }
    this.line(`import * as aws from '@pulumi/aws';`);
    this.line(`import * as pulumi from '@pulumi/pulumi';`);
    if (info.accessLevel) {
      this.line(`import { Access } from '../access';`);
    }
    this.line();
    this.open(`export interface ${componentName}Args {`);
    this.line('/**');
    this.line(' * The source resource.');
    this.line(' */');
    this.line(
      this.getArgLine('source', info.sourceModule, info.sourceResource),
    );
    this.line();
    this.line('/**');
    this.line(' * The target resource.');
    this.line(' */');
    this.line(this.getArgLine('target', info.destModule, info.destResource));
    if (additionalArgs) {
      additionalArgs.forEach((arg) => this.line(arg));
    }
    this.close('}');
    this.line();

    this.line('/**');
    this.line(
      ` * Connect a ${info.sourceModule} ${info.sourceResource} to a ${info.destModule} ${info.destResource}.`,
    );
    this.line(' */');
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
          // TODO: if the match matches the whole string, we can use the match directly
          src.line(this.replace(`pulumi.interpolate\`${res}\`,`, info));
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

  protected replace(str: string, info: CodeInfo): string {
    return str
      .replace(/%{(\w+)\.(\w+)}/g, (_, type, attr) => {
        if (attr === 'Qualifier') {
          return '${qualifier}';
        }
        return `\${${this.getInterpolateString(info, type, attr)}}`;
      })
      .replace(
        'AWS::AccountId',
        'aws.getCallerIdentityOutput({}, { parent: this }).accountId',
      )
      .replace('AWS::Region', 'aws.getRegionOutput({}, { parent: this }).name')
      .replace(
        'AWS::Partition',
        'aws.getPartitionOutput({}, { parent: this }).partition',
      );
  }
  protected getInterpolateString(
    info: CodeInfo,
    referenceType: string,
    attribute: string,
  ): string {
    if (referenceType === 'Source') {
      return `args.source.${this.getReference(info.sourceResource, attribute)}`;
    }
    return `args.target.${this.getReference(info.destResource, attribute)}`;
  }

  protected getReference(resourceType: string, attribute: string): string {
    switch (attribute) {
      case 'ResourceId':
        return 'id';
      case 'Arn':
        switch (resourceType) {
          case 'Function':
            return 'arn';
          case 'PlaceIndex':
            return 'indexArn';
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
      case 'Bucket':
        return `${typ}: aws.s3.BucketV2;`;
      default:
        return `${typ}: aws.${module.toLowerCase()}.${resourceType};`;
    }
  }
}
