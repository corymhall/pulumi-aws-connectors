import * as path from 'path';
import * as builder from '@hallcor/lambda-builders';
import * as connector from '@hallcor/aws-connectors';
import * as aws from '@pulumi/aws';

const role = new aws.iam.Role('test-role', {
  assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal(
    aws.iam.Principals.LambdaPrincipal,
  ),
  managedPolicyArns: [aws.iam.ManagedPolicy.AWSLambdaBasicExecutionRole],
});

const build = new builder.BuildNodejs('nodejs', {
  entry: path.join(__dirname, 'app', 'index.ts'),
  runtime: 'nodejs20.x',
});

const handler = new aws.lambda.Function('test-handler', {
  role: role.arn,
  code: build.asset,
  handler: 'index.handler',
  runtime: 'nodejs20.x',
});

const target = new aws.s3.BucketV2('test-bucket');
new connector.LambdaFunctionToS3Bucket('lambda-s3-policy', {
  source: handler,
  target,
  access: 'Read',
});
