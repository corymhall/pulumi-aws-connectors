import { parseProfiles, parseInfoFromProfiles } from '../../projenrc';

test('parseProfiles', () => {
  const profiles = parseProfiles();
  expect(() => {
    parseInfoFromProfiles(profiles);
  }).not.toThrow();
});
