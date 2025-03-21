// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { Access } from '../access';
import { roleNameFromArn } from '../utils';

export interface LambdaFunctionToDynamoDBTableArgs {
  /**
   * The source resource.
   */
  source: aws.lambda.Function;

  /**
   * The target resource.
   */
  target: aws.dynamodb.Table;

  /**
   * The access level for the policy.
   * Can be one of "Read", "Write", or "ReadWrite"
   *
   * @default "Read"
   */
  access?: string;
}

/**
 * Connect a Lambda Function to a DynamoDB Table.
 */
export class LambdaFunctionToDynamoDBTable extends pulumi.ComponentResource {
  constructor(name: string, args: LambdaFunctionToDynamoDBTableArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:LambdaFunctionToDynamoDBTable', name, args, opts);
    const access = args.access ?? Access.READ;

    const readPolicies: aws.iam.PolicyStatement[] = [];
    const writePolicies: aws.iam.PolicyStatement[] = [];
    readPolicies.push(
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
    );
    writePolicies.push(
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchWriteItem',
          'dynamodb:PartiQLDelete',
          'dynamodb:PartiQLInsert',
          'dynamodb:PartiQLUpdate',
        ],
        Resource: [
          pulumi.interpolate`${args.target.arn}`,
          pulumi.interpolate`${args.target.arn}/index/*`,
        ],
      },
    );
    const statements: aws.iam.PolicyStatement[] = [];
    if (access === Access.READ || access === Access.READ_WRITE) {
      statements.push(...readPolicies);
    }
    if (access === Access.WRITE || access === Access.READ_WRITE) {
      statements.push(...writePolicies);
    }
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