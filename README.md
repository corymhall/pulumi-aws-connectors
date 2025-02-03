# replace this


```ts
import * as aws from '@pulumi/aws';
import * as connectors from '@pulumi/connectors';

const lambda = new aws.lambda.Function(...);
const table = new aws.dynamodb.Table(...);

new connectors.LambdaFunctionToDynamoDBConnector(lambda, table, connectors.Access.WRITE)
new connectors.LambdaFunctionToDynamoDBConnector({
  lambdaFunctionArn: lambda.arn,
  dynamodbTableArn: table.arn,
  access: connectors.Access.WRITE,
})

new connectors.LambdaFunctionToDynamoDBConnector('connector', {
  function: lambda,
  table: table,
  access: connectors.Access.WRITE,
})

new connectors.LambdaFunctionToDynamoDBReadConnector('connector', {
  function: lambda,
  table: table,
})

```
