import { Project } from 'projen';
import { Code, CodeInfo } from './code';
import { Policy } from './profiles';
import { IConnectorInfo } from './types';

export interface SnsTopicPolicyCodeInfo extends CodeInfo {
  statement?: Policy;
}

export function generateSnsTopicPolicyConnector(
  project: Project,
  info: IConnectorInfo,
) {
  const componentName = `${info.componentName}Connector`;
  new SnsTopicPolicyCode(
    project,
    `src/connectors/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}.ts`.toLowerCase(),
    componentName,
    {
      componentNamePrefix: info.componentName,
      statement: info.writeStatement,
      ...info,
    },
  );
}

export class SnsTopicPolicyCode extends Code {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: SnsTopicPolicyCodeInfo,
  ) {
    super(project, filePath, componentName, info);

    this.open('new aws.sns.TopicPolicy(`${name}-policy`, {');
    this.line(`arn: args.target.arn,`);

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
}
