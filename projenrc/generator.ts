import { Construct } from 'constructs';
import { Project, TextFile } from 'projen';
import { generateIamPolicyConnector } from './iam-policy-connector';
import { generateLambdaPermissionPolicyConnector } from './lambda-permission-connector';
import { MarkdownEntry } from './markdown';
import {
  ConnectorProfiles,
  DestinationConfig,
  LambdaPermission,
  parseProfiles,
  Policy,
} from './profiles';
import { generateSnsTopicPolicyConnector } from './sns-topic-policy-connector';
import { generateSqsQueuePolicyConnector } from './sqs-queue-policy-connector';
import { IConnectorInfo } from './types';

export class ProfilesGenerator extends Construct {
  private profiles: ConnectorProfiles;
  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.profiles = parseProfiles();
    const markdownEntries: MarkdownEntry[] = [];
    const exports: string[] = [];

    for (const [sourceType, sourceConfig] of Object.entries(
      this.profiles.Permissions,
    )) {
      for (const [destType, destConfig] of Object.entries(sourceConfig)) {
        if (
          // TODO: need to figure out how to create the event source mapping which requires extra props
          destConfig.Properties.DependedBy ===
          'DESTINATION_EVENT_SOURCE_MAPPING'
        ) {
          console.log(
            `Skipping ${sourceType}-${destType} due to DESTINATION_EVENT_SOURCE_MAPPING`,
          );
          continue;
        }
        const connectorInfo = new ConnectorInfo(
          this,
          `${sourceType}-${destType}`,
          {
            destinationConfig: destConfig,
            destinationType: destType,
            sourceType: sourceType,
          },
        );
        if (connectorInfo.markdownEntry) {
          markdownEntries.push(connectorInfo.markdownEntry);
        }
        exports.push(`export * from './${connectorInfo.fileImport}';`);
      }
    }
    new TextFile(this, 'src/generated/index.ts', {
      lines: exports,
    });
    new TextFile(this, 'profiles.md', {
      committed: false,
      lines: [
        '## Supported Connectors',
        '',
        '<!-- Keep this section at the end of the file. -->',
        '',
        '',
        '| ConnectorName | Description | Connected With |',
        '| ------------- | ----------- | -------------- |',
      ].concat(
        markdownEntries.flatMap((entry) => {
          return [
            `| ${entry.componentName} | ${entry.description} | ${entry.link} |`,
          ];
        }),
      ),
    });
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
  public readStatement?: Policy;
  public writeStatement?: Policy;
  public lambdaPermission?: LambdaPermission;
  public sourcePolicy: boolean;
  public markdownEntry?: MarkdownEntry;
  public fileImport: string;
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
    this.fileImport =
      `${this.sourceModule}-${this.sourceResource}-${this.destModule}-${this.destResource}`.toLowerCase();
    const ac = props.destinationConfig.Properties.AccessCategories;

    if ('Read' in ac) {
      this.readStatement = ac.Read as Policy;
    }
    if ('Write' in ac) {
      if ('Statement' in ac.Write) {
        this.writeStatement = ac.Write as Policy;
      } else {
        this.lambdaPermission = ac.Write as LambdaPermission;
      }
    }
    switch (this.connectorType) {
      case 'AWS_SNS_TOPIC_POLICY':
        this.markdownEntry = generateSnsTopicPolicyConnector(
          this.project,
          this,
        );
        break;
      case 'AWS_SQS_QUEUE_POLICY':
        this.markdownEntry = generateSqsQueuePolicyConnector(
          this.project,
          this,
        );
        break;
      case 'AWS_LAMBDA_PERMISSION':
        this.markdownEntry = generateLambdaPermissionPolicyConnector(
          this.project,
          this,
        );
        break;
      case 'AWS_IAM_ROLE_MANAGED_POLICY':
        this.markdownEntry = generateIamPolicyConnector(this.project, this);
        break;
      default:
        console.log('Unsupported type: ', this.connectorType);
    }
  }
  public get componentName(): string {
    const sourceModule =
      this.sourceModule === 'StepFunctions' ? 'Sfn' : this.sourceModule;
    const destModule =
      this.destModule === 'StepFunctions' ? 'Sfn' : this.destModule;
    return `${sourceModule}${this.sourceResource}To${destModule}${this.destResource}`;
  }
}
