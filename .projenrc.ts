import {
  GithubCredentials,
  PulumiEscSetup,
  TypeScriptComponent,
} from '@hallcor/pulumi-projen-project-types';
import {
  NodePackageManager,
  UpgradeDependenciesSchedule,
} from 'projen/lib/javascript';
import { ProfilesGenerator } from './projenrc';

const project = new TypeScriptComponent({
  defaultReleaseBranch: 'main',
  name: '@hallcor/aws-connectors',
  projenrcTs: true,
  packageManager: NodePackageManager.NPM,
  depsUpgradeOptions: {
    workflowOptions: {
      branches: ['main'],
      labels: ['auto-approve'],
      schedule: UpgradeDependenciesSchedule.WEEKLY,
    },
  },
  autoApproveOptions: {
    label: 'auto-approve',
    allowedUsernames: ['corymhall', 'hallcor-projen-app[bot]'],
  },
  projenCredentials: GithubCredentials.fromApp({
    pulumiEscSetup: PulumiEscSetup.fromOidcAuth({
      environment: 'github/public',
      organization: 'corymhall',
    }),
  }),

  gitignore: ['examples/**/sdks', 'examples/**/package-lock.json'],

  deps: ['@pulumi/pulumi', '@pulumi/aws-native', '@pulumi/aws'],
  devDeps: ['@swc/core', '@swc/jest', '@hallcor/pulumi-projen-project-types'],
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.defaultTask?.spawn(
  project.addTask('docs', { exec: 'npx ts-node ./projenrc/markdown.ts' }),
);

new ProfilesGenerator(project, 'generator');

project.synth();
