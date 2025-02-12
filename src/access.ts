/**
 * The access level of the policy.
 */
export enum Access {
  /**
   * Only grant read access to the resource
   */
  READ = 'Read',

  /**
   * Only grant write access to the resource
   */
  WRITE = 'Write',

  /**
   * Grant both read and write access to the resource
   */
  READ_WRITE = 'ReadWrite',
}
