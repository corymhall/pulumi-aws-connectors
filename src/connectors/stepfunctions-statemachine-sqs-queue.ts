// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface SfnStateMachineToSQSQueueConnectorArgs {
  /**
   * The source resource.
   */
  source: aws.sfn.StateMachine;

  /**
   * The target resource.
   */
  target: aws.sqs.Queue;
}

/**
 * Connect a StepFunctions StateMachine to a SQS Queue.
 */
export class SfnStateMachineToSQSQueueConnector extends pulumi.ComponentResource {
  constructor(name: string, args: SfnStateMachineToSQSQueueConnectorArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:SfnStateMachineToSQSQueueConnector', name, args, opts);
    const statements: aws.iam.PolicyStatement[] = [];
    statements.push(
      {
        Effect: 'Allow',
        Action: [
          'sqs:SendMessage',
        ],
        Resource: [
          pulumi.interpolate`${args.target.arn}`,
        ],
      },
    );
    new aws.iam.RolePolicy(`${name}-policy`, {
      role: args.source.roleArn,
      policy: {
        Version: '2012-10-17',
        Statement: statements,
      }
    }, opts);
    this.registerOutputs({});
  }
}