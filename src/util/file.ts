import { access, constants } from 'fs/promises'

export async function exists (path: string): Promise<boolean> {
  return await access(path, constants.F_OK)
    .then(() => true)
    .catch(() => false)
}
