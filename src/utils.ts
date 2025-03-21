import * as pulumi from '@pulumi/pulumi';

export function roleNameFromArn(
  arn: pulumi.Output<string>,
): pulumi.Output<string> {
  return arn.apply((a) => {
    const delimiter = 'role/';
    const index = a.indexOf(delimiter);
    if (index === -1) {
      throw new Error(
        `ARN ${a} does not contain the expected delimiter ${delimiter}`,
      );
    }
    return a.substring(index + delimiter.length);
  });
}
