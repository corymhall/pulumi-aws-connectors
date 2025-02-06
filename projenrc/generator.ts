import { Construct } from 'constructs';
import { Project } from 'projen';
import { generateIamPolicyConnector } from './iam-policy-connector';
import {
  ConnectorProfiles,
  DestinationConfig,
  parseProfiles,
  Policy,
} from './profiles';
import { IConnectorInfo } from './types';
import { generateSnsTopicPolicyConnector } from './sns-topic-policy-connector';

export class ProfilesGenerator extends Construct {
  private profiles: ConnectorProfiles;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.profiles = parseProfiles();

    for (const [sourceType, sourceConfig] of Object.entries(
      this.profiles.Permissions,
    )) {
      for (const [destType, destConfig] of Object.entries(sourceConfig)) {
        if (
          // TODO: need to figure out how to create the event source mapping which requires extra props
          destConfig.Properties.DependedBy !==
          'DESTINATION_EVENT_SOURCE_MAPPING'
        ) {
          new ConnectorInfo(this, `${sourceType}-${destType}`, {
            destinationConfig: destConfig,
            destinationType: destType,
            sourceType: sourceType,
          });
        }
      }
    }
  }
}

export interface ProfileGeneratorProps {
  sourceType: string;
  destinationType: string;
  destinationConfig: DestinationConfig;
}

export class ConnectorInfo extends Construct implements IConnectorInfo {
  public sourceModule: string;
  public sourceResource: string;
  public destModule: string;
  public connectorType: string;
  public destResource: string;
  public componentName: string;
  public readStatement?: Policy;
  public writeStatement?: Policy;
  public sourcePolicy: boolean;
  private readonly project: Project;
  constructor(scope: Construct, id: string, props: ProfileGeneratorProps) {
    super(scope, id);
    this.project = Project.of(this);

    this.sourcePolicy = props.destinationConfig.Properties.SourcePolicy;
    this.connectorType = props.destinationConfig.Type;
    this.sourceModule = props.sourceType.split('::')[1];
    this.sourceResource = props.sourceType.split('::')[2];
    this.destModule = props.destinationType.split('::')[1];
    this.destResource = props.destinationType.split('::')[2];
    this.componentName = `${this.sourceModule}${this.sourceResource}To${this.destModule}${this.destResource}`;
    console.log('Component Name: ', this.componentName);

    if ('Read' in props.destinationConfig.Properties.AccessCategories) {
      this.readStatement =
        props.destinationConfig.Properties.AccessCategories.Read;
    }
    if ('Write' in props.destinationConfig.Properties.AccessCategories) {
      this.writeStatement =
        props.destinationConfig.Properties.AccessCategories.Write;
    }
    switch (this.connectorType) {
      case 'AWS_SNS_TOPIC_POLICY':
        generateSnsTopicPolicyConnector(this.project, this);
        break;
      case 'AWS_SQS_QUEUE_POLICY':
        break;
      case 'AWS_LAMBDA_PERMISSION':
        break;
      case 'AWS_IAM_ROLE_MANAGED_POLICY':
        generateIamPolicyConnector(this.project, this);
        break;
      default:
        console.log('Unsupported type: ', this.connectorType);
    }
  }
}
