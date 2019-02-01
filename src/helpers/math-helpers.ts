/**
 * This method ceilings a number to it's nearest number that is the power of 2.
 * @param number The number needed to be ceiling-ed.
 */
export function ceil2(number: number): number {
  return Math.pow(2, Math.ceil(Math.log(number) / Math.log(2)));
}
