// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface LambdaFunctionToEventsEventBusConnectorReadWriteArgs {
  source: aws.lambda.Function;

  target: aws.cloudwatch.EventBus;

}

export class LambdaFunctionToEventsEventBusConnectorReadWrite extends pulumi.ComponentResource {
  constructor(name: string, args: LambdaFunctionToEventsEventBusConnectorReadWriteArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:LambdaFunctionToEventsEventBusConnectorReadWrite', name, args, opts);
    new aws.iam.RolePolicy(`${name}-policy`, {
      role: args.source.role,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'events:PutEvents',
            ],
            Resource: [
              pulumi.interpolate`${args.target.arn}`,
            ],
          },
        ],
      }
    });
    this.registerOutputs({});
  }
}