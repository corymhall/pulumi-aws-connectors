import { Project } from 'projen';
import { Code, CodeInfo } from './code';
import { LambdaPermission } from './profiles';
import { IConnectorInfo } from './types';

export interface LambdaPermissionPolicyCodeInfo extends CodeInfo {
  permission: LambdaPermission;
}

export function generateLambdaPermissionPolicyConnector(
  project: Project,
  info: IConnectorInfo,
) {
  const componentName = `${info.componentName}Connector`;
  new LambdaPermissionPolicyCode(
    project,
    `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}.ts`.toLowerCase(),
    componentName,
    {
      componentNamePrefix: info.componentName,
      permission: info.lambdaPermission!,
      ...info,
    },
  );
}

export class LambdaPermissionPolicyCode extends Code {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: LambdaPermissionPolicyCodeInfo,
  ) {
    const hasQualifier = info.permission.SourceArn.includes('Source.Qualifier');
    const additionalArgs = hasQualifier
      ? ['sourceQualifier: string;']
      : undefined;
    super(project, filePath, componentName, info, additionalArgs);

    if (hasQualifier) {
      this.line("const qualifier = args.sourceQualifier ?? '*';");
      this.line();
    }
    this.open('new aws.lambda.Permission(`${name}-policy`, {');
    this.line(`statementId: '${componentName}',`);
    this.line(`action: 'lambda:InvokeFunction',`);
    this.line('function: args.target.name,');
    this.line(`principal: '${info.permission.Principal}',`);
    this.line(
      this.replace(
        `sourceArn: pulumi.interpolate\`${info.permission.SourceArn}\`,`,
        info,
      ),
    );
    if (info.permission.SourceAccount) {
      const sourceAccount = this.replace(info.permission.SourceAccount, info);
      this.line(`sourceAccount: \`${sourceAccount}\`,`);
    }

    this.close('});');

    this.closeCode();
  }
}
