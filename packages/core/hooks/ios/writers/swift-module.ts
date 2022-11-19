import {
  ModuleNamesToMethodDescriptions,
  readFile,
  writeFile,
} from '../common';
import { getSwiftInterfaceImplementationFile } from '../getters/swift-interface-impl';
import * as fs from 'fs';
/**
 * Make all methods annotated with @objc public
 * in swift modules to expose them to the
 * metadata generator.
 */
export async function writePublicSwiftModule(
  moduleNamesToMethodDescriptions: ModuleNamesToMethodDescriptions,
  files: string[]
) {
  for (const key in moduleNamesToMethodDescriptions) {
    const swiftFile = getSwiftInterfaceImplementationFile(key, files);
    if (!swiftFile) continue;
    let contents = await readFile(swiftFile, { encoding: 'utf-8' });
    // Create a backup file & use it's contents
    // as a source to rewrite or update the module.
    if (!fs.existsSync(swiftFile + '.bkp')) {
      await writeFile(swiftFile + '.bkp', contents, {
        encoding: 'utf-8',
      });
    }
    contents = await readFile(swiftFile + '.bkp', { encoding: 'utf-8' });
    contents = contents.replace(/@objc[^!:]*?func/gm, (r) => {
      r = r.replace(/\n\s*/g, ' ');
      // Insert "public" after last annotation.
      const chunks = r.split(' ');
      for (let i = 0; i < chunks.length; i++) {
        if (chunks[i].startsWith('@')) continue;
        chunks.splice(i, 0, 'public');
        return chunks.join(' ');
      }
      return r;
    });
    // Insert "public" before class declaration.
    if (!contents.includes('public class')) {
      contents = contents.replace('class', 'public class');
    }
    await writeFile(swiftFile, contents, { encoding: 'utf-8' });
  }
}
