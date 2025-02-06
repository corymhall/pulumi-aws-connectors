// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface StepFunctionsStateMachineToDynamoDBTableConnectorReadWriteArgs {
  source: aws.sfn.StateMachine;

  target: aws.dynamodb.Table;

}

export class StepFunctionsStateMachineToDynamoDBTableConnectorReadWrite extends pulumi.ComponentResource {
  constructor(name: string, args: StepFunctionsStateMachineToDynamoDBTableConnectorReadWriteArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:StepFunctionsStateMachineToDynamoDBTableConnectorReadWrite', name, args, opts);
    new aws.iam.RolePolicy(`${name}-policy`, {
      role: args.source.roleArn,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'dynamodb:GetItem',
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:BatchGetItem',
              'dynamodb:ConditionCheckItem',
              'dynamodb:PartiQLSelect',
            ],
            Resource: [
              pulumi.interpolate`${args.target.arn}`,
              pulumi.interpolate`${args.target.arn}/index/*`,
            ],
          },
        ],
      }
    });
    this.registerOutputs({});
  }
}