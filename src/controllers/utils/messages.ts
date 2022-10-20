export function getVersionMissmatchError(
  currentVersion: string,
  latestVersion: string
): string {
  return `Version mismatch! Should be ${latestVersion} but is ${currentVersion}`
}

export function getBlockMissmatchError(
  currentBlock: string,
  latestBlock: string
): string {
  return `Out of sync! Should be at block ${latestBlock} but is at ${currentBlock}`
}
