// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface S3BucketToLambdaFunctionArgs {
  /**
   * The source resource.
   */
  source: aws.s3.BucketV2;

  /**
   * The target resource.
   */
  target: aws.lambda.Function;
}

/**
 * Connect a S3 Bucket to a Lambda Function.
 */
export class S3BucketToLambdaFunction extends pulumi.ComponentResource {
  constructor(name: string, args: S3BucketToLambdaFunctionArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:S3BucketToLambdaFunction', name, args, opts);
    new aws.lambda.Permission(`${name}-policy`, {
      statementId: 'S3BucketToLambdaFunction',
      action: 'lambda:InvokeFunction',
      function: args.target.name,
      principal: 's3.amazonaws.com',
      sourceArn: pulumi.interpolate`${args.source.arn}`,
      sourceAccount: `${aws.getCallerIdentityOutput({}, { parent: this }).accountId}`,
    }, { parent: this });
    this.registerOutputs({});
  }
}