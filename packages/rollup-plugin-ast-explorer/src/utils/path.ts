import { readdir, stat } from 'node:fs/promises'
import { extname, join } from 'node:path'

export async function getAllSubPaths(directory: string, options?: {
  /** return paths relative to directory */
  relative?: boolean
  /**
   * allowed files extensions
   *
   * @example ['.js', '.css']
   */
  allowedExtensions?: string[]
}) {
  const {
    relative = false,
    allowedExtensions = [],
  } = options ?? {}

  let paths: string[] = []

  const files = await readdir(directory)

  for (const file of files) {
    const filePath = join(directory, file)
    const stats = await stat(filePath).catch(() => null)
    if (!stats) {
      continue
    }
    if (stats.isDirectory()) {
      const subPaths = await getAllSubPaths(filePath, { relative, allowedExtensions })
        .then(paths => paths.map(path => relative ? join(file, path) : path))
      paths = paths.concat(subPaths)
    }
    else if (stats.isFile()) {
      if (!allowedExtensions.length || allowedExtensions.includes(extname(file))) {
        paths.push(relative ? file : filePath)
      }
    }
  }

  return paths
}
