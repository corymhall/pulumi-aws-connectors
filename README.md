# Pulumi AWS Connectors Component Library

This is a Pulumi Component Library for connecting one AWS resource to another
through simple well-scoped permissions.
This is based on [AWS SAM Connectors](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/managing-permissions-connectors.html).

## Getting Started

To add this component to your Pulumi app run `pulumi package add`

```console
$ pulumi package add https://github.com/corymhall/pulumi-aws-connectors
```

## Example

Below is an example of granting a Lambda Function write access to a DynamoDB
Table.

```ts
import * as aws from '@pulumi/aws';
import * as connectors from '@pulumi/aws-connectors';

const lambda = new aws.lambda.Function(...);
const table = new aws.dynamodb.Table(...);

new connectors.LambdaFunctionToDynamoDBTableConnector({
  function: lambda,
  table: table,
  access: 'Write',
})
```

## Supported Connectors

<!-- Keep this section at the end of the file. -->


| ConnectorName | Description | Connected With |
| ------------- | ----------- | -------------- |
| EventsRuleToSNSTopic | Connect a Events Rule to a SNS Topic. | [aws.sns.TopicPolicy](https://www.pulumi.com/docs/reference/pkg/aws/sns/topicpolicy/) |
| EventsRuleToEventsEventBus | Connect a Events Rule to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| EventsRuleToSfnStateMachine | Connect a Events Rule to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| EventsRuleToLambdaFunction | Connect a Events Rule to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| EventsRuleToSQSQueue | Connect a Events Rule to a SQS Queue. | [aws.sqs.QueuePolicy](https://www.pulumi.com/docs/reference/pkg/aws/sqs/queuepolicy/) |
| LambdaFunctionToLambdaFunction | Connect a Lambda Function to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToS3Bucket | Connect a Lambda Function to a S3 Bucket. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToDynamoDBTable | Connect a Lambda Function to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSQSQueue | Connect a Lambda Function to a SQS Queue. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSNSTopic | Connect a Lambda Function to a SNS Topic. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSfnStateMachine | Connect a Lambda Function to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToEventsEventBus | Connect a Lambda Function to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToLocationPlaceIndex | Connect a Lambda Function to a Location PlaceIndex. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| ApiGatewayV2ApiToLambdaFunction | Connect a ApiGatewayV2 Api to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| ApiGatewayRestApiToLambdaFunction | Connect a ApiGateway RestApi to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| SNSTopicToSQSQueue | Connect a SNS Topic to a SQS Queue. | [aws.sqs.QueuePolicy](https://www.pulumi.com/docs/reference/pkg/aws/sqs/queuepolicy/) |
| SNSTopicToLambdaFunction | Connect a SNS Topic to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| S3BucketToLambdaFunction | Connect a S3 Bucket to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| SfnStateMachineToLambdaFunction | Connect a StepFunctions StateMachine to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSNSTopic | Connect a StepFunctions StateMachine to a SNS Topic. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSQSQueue | Connect a StepFunctions StateMachine to a SQS Queue. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToS3Bucket | Connect a StepFunctions StateMachine to a S3 Bucket. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToDynamoDBTable | Connect a StepFunctions StateMachine to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSfnStateMachine | Connect a StepFunctions StateMachine to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToEventsEventBus | Connect a StepFunctions StateMachine to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToDynamoDBTable | Connect a AppSync DataSource to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToLambdaFunction | Connect a AppSync DataSource to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToEventsEventBus | Connect a AppSync DataSource to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncGraphQLApiToLambdaFunction | Connect a AppSync GraphQLApi to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |

