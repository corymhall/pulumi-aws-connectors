import { Policy } from './profiles';
export interface IConnectorInfo {
  sourceModule: string;
  sourcePolicy: boolean;
  sourceResource: string;
  destModule: string;
  connectorType: string;
  destResource: string;
  componentName: string;
  readStatement?: Policy;
  writeStatement?: Policy;
}
