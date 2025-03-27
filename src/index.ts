import { join } from 'path';
import {
  componentProviderHost,
  // getPulumiComponents,
} from '@pulumi/pulumi/provider/experimental';
// TODO: https://github.com/pulumi/pulumi/issues/18973
import { ApiGatewayRestApiToLambdaFunction } from './generated';
import '@pulumi/aws';

// // eslint-disable-next-line @typescript-eslint/no-require-imports
// const components = getPulumiComponents(require('./generated'));
componentProviderHost({
  components: [ApiGatewayRestApiToLambdaFunction],
  name: 'aws-connectors',
  dirname: join(__dirname, '..'),
  namespace: 'hallcor',
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
