/**
 * Defines the shape of a map in JSON format.
 */
export type JsonMap = StringMap<any>;

/**
 * Defines the shape of a dictionary whose keys are strings.
 */
export interface StringMap<T = string | undefined> {

  /**
   * Gets or sets the value for the given key.
   */
  [key: string]: T;
}
