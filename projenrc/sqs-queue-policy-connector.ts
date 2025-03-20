import { Project } from 'projen';
import { Code, CodeInfo } from './code';
import { Policy } from './profiles';
import { IConnectorInfo } from './types';

export interface SqsQueuePolicyCodeInfo extends CodeInfo {
  statement?: Policy;
}

export function generateSqsQueuePolicyConnector(
  project: Project,
  info: IConnectorInfo,
) {
  const componentName = info.componentName;
  new SqsQueuePolicyCode(
    project,
    `src/generated/${info.sourceModule}-${info.sourceResource}-${info.destModule}-${info.destResource}.ts`.toLowerCase(),
    componentName,
    {
      componentNamePrefix: info.componentName,
      statement: info.writeStatement,
      ...info,
    },
  );
  return {
    componentName,
    description: `Connect a ${info.sourceModule} ${info.sourceResource} to a ${info.destModule} ${info.destResource}.`,
    link: `[aws.sqs.QueuePolicy](https://www.pulumi.com/docs/reference/pkg/aws/sqs/queuepolicy/)`,
  };
}

export class SqsQueuePolicyCode extends Code {
  constructor(
    project: Project,
    filePath: string,
    componentName: string,
    info: SqsQueuePolicyCodeInfo,
  ) {
    super(project, filePath, componentName, info);

    this.open('new aws.sqs.QueuePolicy(`${name}-policy`, {');
    this.line(`queueUrl: args.target.id,`);

    this.open('policy: {');
    this.line("Version: '2012-10-17',");
    this.open('Statement: [');
    if (info.statement) {
      this.writePolicy(this, info, info.statement);
    }

    this.close('],');
    this.close('}');
    this.close('}, { parent: this });');

    this.closeCode();
  }
}
