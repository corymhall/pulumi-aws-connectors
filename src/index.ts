import * as path from 'path';
import { componentProviderHost } from '@pulumi/pulumi/provider/experimental';

componentProviderHost(path.join(__dirname, '../')).catch((err) => {
  console.error(err);
  process.exit(1);
});
