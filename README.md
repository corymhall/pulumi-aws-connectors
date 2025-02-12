# Pulumi AWS Connectors Component Library

This is a Pulumi Component Library for connecting one AWS resource to another
through simple well-scoped permissions.
This is based on [AWS SAM Connectors](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/managing-permissions-connectors.html).

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
  access: connectors.Access.WRITE,
})
```

## Supported Connectors

<!-- Keep this section at the end of the file. -->


| ConnectorName | Description | Connected With |
| ------------- | ----------- | -------------- |
| EventsRuleToSNSTopicConnector | Connect a Events Rule to a SNS Topic. | [aws.sns.TopicPolicy](https://www.pulumi.com/docs/reference/pkg/aws/sns/topicpolicy/) |
| EventsRuleToEventsEventBusConnector | Connect a Events Rule to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| EventsRuleToSfnStateMachineConnector | Connect a Events Rule to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| EventsRuleToLambdaFunctionConnector | Connect a Events Rule to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| EventsRuleToSQSQueueConnector | Connect a Events Rule to a SQS Queue. | [aws.sqs.QueuePolicy](https://www.pulumi.com/docs/reference/pkg/aws/sqs/queuepolicy/) |
| LambdaFunctionToLambdaFunctionConnector | Connect a Lambda Function to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToS3BucketConnector | Connect a Lambda Function to a S3 Bucket. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToDynamoDBTableConnector | Connect a Lambda Function to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSQSQueueConnector | Connect a Lambda Function to a SQS Queue. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSNSTopicConnector | Connect a Lambda Function to a SNS Topic. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToSfnStateMachineConnector | Connect a Lambda Function to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToEventsEventBusConnector | Connect a Lambda Function to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| LambdaFunctionToLocationPlaceIndexConnector | Connect a Lambda Function to a Location PlaceIndex. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| ApiGatewayV2ApiToLambdaFunctionConnector | Connect a ApiGatewayV2 Api to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| ApiGatewayRestApiToLambdaFunctionConnector | Connect a ApiGateway RestApi to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| SNSTopicToSQSQueueConnector | Connect a SNS Topic to a SQS Queue. | [aws.sqs.QueuePolicy](https://www.pulumi.com/docs/reference/pkg/aws/sqs/queuepolicy/) |
| SNSTopicToLambdaFunctionConnector | Connect a SNS Topic to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| S3BucketToLambdaFunctionConnector | Connect a S3 Bucket to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |
| SfnStateMachineToLambdaFunctionConnector | Connect a StepFunctions StateMachine to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSNSTopicConnector | Connect a StepFunctions StateMachine to a SNS Topic. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSQSQueueConnector | Connect a StepFunctions StateMachine to a SQS Queue. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToS3BucketConnector | Connect a StepFunctions StateMachine to a S3 Bucket. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToDynamoDBTableConnector | Connect a StepFunctions StateMachine to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToSfnStateMachineConnector | Connect a StepFunctions StateMachine to a StepFunctions StateMachine. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| SfnStateMachineToEventsEventBusConnector | Connect a StepFunctions StateMachine to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToDynamoDBTableConnector | Connect a AppSync DataSource to a DynamoDB Table. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToLambdaFunctionConnector | Connect a AppSync DataSource to a Lambda Function. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncDataSourceToEventsEventBusConnector | Connect a AppSync DataSource to a Events EventBus. | [aws.iam.RolePolicy](https://www.pulumi.com/docs/reference/pkg/aws/iam/rolepolicy/) |
| AppSyncGraphQLApiToLambdaFunctionConnector | Connect a AppSync GraphQLApi to a Lambda Function. | [aws.lambda.Permission](https://www.pulumi.com/docs/reference/pkg/aws/lambda/permission/) |

