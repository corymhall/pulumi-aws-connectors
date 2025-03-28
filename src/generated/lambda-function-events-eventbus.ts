// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { roleNameFromArn } from '../utils';

export interface LambdaFunctionToEventsEventBusArgs {
  /**
   * The source resource.
   */
  source: aws.lambda.Function;

  /**
   * The target resource.
   */
  target: aws.cloudwatch.EventBus;
}

/**
 * Connect a Lambda Function to a Events EventBus.
 */
export class LambdaFunctionToEventsEventBus extends pulumi.ComponentResource {
  constructor(name: string, args: LambdaFunctionToEventsEventBusArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:LambdaFunctionToEventsEventBus', name, args, opts);
    const statements: aws.iam.PolicyStatement[] = [];
    statements.push(
      {
        Effect: 'Allow',
        Action: [
          'events:PutEvents',
        ],
        Resource: [
          pulumi.interpolate`${args.target.arn}`,
        ],
      },
    );
    new aws.iam.RolePolicy(`${name}-policy`, {
      role: roleNameFromArn(args.source.role),
      policy: {
        Version: '2012-10-17',
        Statement: statements,
      }
    }, { parent: this });
    this.registerOutputs({});
  }
}