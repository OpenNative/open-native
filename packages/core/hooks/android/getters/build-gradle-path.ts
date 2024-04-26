import * as path from 'path';
import { globProm } from '../common';

export async function getBuildGradlePath(
  folder: string
): Promise<string | null> {
  const buildGradlePath = (
    await globProm(path.join('**', 'build.gradle'), {
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

  return buildGradlePath ? path.join(folder, buildGradlePath) : null;
}
