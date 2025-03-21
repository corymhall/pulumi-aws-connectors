import * as path from 'path';
import { componentProviderHost } from '@pulumi/pulumi/provider/experimental';
// TODO: https://github.com/pulumi/pulumi/issues/18973
import '@pulumi/aws';

componentProviderHost(path.join(__dirname, '../')).catch((err) => {
  console.error(err);
  process.exit(1);
});
