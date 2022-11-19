import * as path from 'path';
import { globProm } from '../common';

export async function getManifestPath(folder: string): Promise<string | null> {
  const manifestPath = (
    await globProm(path.join('**', 'AndroidManifest.xml'), {
      cwd: folder,
      ignore: [
        'node_modules/**',
        '**/build/**',
        '**/debug/**',
        'Examples/**',
        'examples/**',
      ],
    })
  )[0];

  return manifestPath ? path.join(folder, manifestPath) : null;
}
