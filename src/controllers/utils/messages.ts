export function getVersionMissmatchError(
  component: string,
  currentVersion: string,
  latestVersion: string
): string {
  return `${component} version missmatch! Should be ${latestVersion} but it is ${currentVersion}`
}

export function getBlockMissmatchError(
  component: string,
  currentBlock: string,
  latestBlock: string
): string {
  return `${component} out of sync! Should be at block ${latestBlock} but it is at ${currentBlock}`
}
