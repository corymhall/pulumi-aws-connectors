import * as fs from 'fs';
import * as path from 'path';

export interface PolicyStatement {
  Effect: string;
  Action: string | string[];
  Resource: string | string[];
  Principal?: { Service: string };
  Condition?: {
    ArnEquals: {
      'aws:SourceArn': string;
    };
  };
}
export interface Policy {
  Statement: PolicyStatement[];
}

export interface LambdaPermission {
  Action: string;
  Principal: string;
  SourceArn: string;
  SourceAccount?: string;
}

export interface DestinationConfig {
  Type: string;
  Properties: {
    SourcePolicy: boolean;
    DependedBy?: string;
    ValidAccessCategories?: string[][];
    AccessCategories: {
      [key: string]: Policy | LambdaPermission;
    };
  };
}

export interface ConnectorProfiles {
  Version: string;
  Permissions: {
    [key: string]: {
      [key: string]: DestinationConfig;
    };
  };
  CfnResourceProperties: {
    [key: string]: {
      Inputs?: {
        Role?: string;
        RoleArn?: string;
        ServiceRoleArn?: string;
        Function?: string;
      };
      Outputs: {
        Arn: {
          'Fn::GetAtt'?: [string, string];
          Ref?: string;
        };
        Name?: {
          'Fn::GetAtt': [string, string];
        };
        Id?: {
          'Fn::GetAtt': [string, string];
          Ref?: string;
        };
        Url?: {
          Ref: string;
        };
        Qualifier?: string;
      };
    };
  };
}

export function parseProfiles(): ConnectorProfiles {
  const contents = fs.readFileSync(
    path.join(__dirname, '../schemas/connector-profiles.json'),
    {
      encoding: 'utf-8',
    },
  );

  const profiles: ConnectorProfiles = JSON.parse(contents);
  return profiles;
}
