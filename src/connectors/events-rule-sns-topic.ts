// ~~ Generated by projen. To modify, edit .projenrc.ts and run "npx projen".
import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export interface EventsRuleToSNSTopicConnectorArgs {
  /**
   * The source resource.
   */
  source: aws.cloudwatch.EventRule;

  /**
   * The target resource.
   */
  target: aws.sns.Topic;
}

/**
 * Connect a Events Rule to a SNS Topic.
 */
export class EventsRuleToSNSTopicConnector extends pulumi.ComponentResource {
  constructor(name: string, args: EventsRuleToSNSTopicConnectorArgs, opts?: pulumi.ComponentResourceOptions) {
    super('aws-connectors:index:EventsRuleToSNSTopicConnector', name, args, opts);
    new aws.sns.TopicPolicy(`${name}-policy`, {
      arn: args.target.arn,
      policy: {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Action: [
              'sns:Publish',
            ],
            Resource: [
              pulumi.interpolate`${args.target.arn}`,
            ],
            Principal: {
              Service: 'events.amazonaws.com',
            },
            Condition: {
              ArnEquals: {
                'aws:SourceArn': args.source.arn,
              },
            },
          },
        ],
      }
    }, opts);
    this.registerOutputs({});
  }
}