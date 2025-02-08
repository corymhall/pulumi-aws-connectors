import { JsonPatch, typescript } from 'projen';
import { NodePackageManager, Transform } from 'projen/lib/javascript';
import { ProfilesGenerator } from './projenrc';
const project = new typescript.TypeScriptProject({
  defaultReleaseBranch: 'main',
  name: 'pulumi-serverless-connectors',
  projenrcTs: true,
  release: false,
  entrypoint: 'src/index.ts',
  githubOptions: {
    mergify: false,
    workflows: false,
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
    },
  },
  eslintOptions: {
    dirs: [],
    prettier: true,
  },
  packageManager: NodePackageManager.NPM,

  deps: [
    'pulumi-ts-provider@https://gitpkg.vercel.app/mikhailshilkov/comp-as-comp/ts/pulumi-ts-provider?20621b672151ec13b7c384d570e713f765cc83ca',
    '@pulumi/pulumi',
    '@pulumi/aws-native',
    '@pulumi/aws',
  ],
  devDeps: ['@swc/core', '@swc/jest'],
  jestOptions: {
    configFilePath: 'jest.config.json',
  },
  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
const eslint = project.tryFindObjectFile('.eslintrc.json');
// I don't want to show linting errors for things that get auto fixed
eslint?.addOverride('extends', ['plugin:import/typescript']);

const jestConfig = project.tryFindObjectFile('jest.config.json');
jestConfig?.patch(JsonPatch.remove('/preset'));
jestConfig?.patch(JsonPatch.remove('/globals'));
jestConfig?.patch(
  JsonPatch.add('/transform', {
    '^.+\\.(t|j)sx?$': new Transform('@swc/jest'),
  }),
);

new ProfilesGenerator(project, 'generator');

project.synth();
