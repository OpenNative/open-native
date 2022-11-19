import { globProm, readFile } from '../common';
import * as path from 'path';
const CODEGEN_NATIVE_COMPONENT_REGEX =
  /codegenNativeComponent(<.*>)?\s*\(\s*["'`](\w+)["'`](,?[\s\S]+interfaceOnly:\s*(\w+))?/m;

export async function extractComponentDescriptors(
  packageRoot: string
): Promise<string[]> {
  const filepaths = await globProm('**/+(*.js|*.jsx|*.ts|*.tsx)', {
    cwd: packageRoot,
    nodir: true,
  });

  const contentsArr = await Promise.all(
    filepaths.map((filePath) =>
      readFile(path.join(packageRoot, filePath), 'utf8')
    )
  );

  const codegenComponent = contentsArr
    .map(matchComponentDescriptors)
    .filter((c): c is string => !!c);

  // Filter out duplicates as it happens that libraries contain multiple outputs
  // due to package publishing.
  // TODO: consider using "codegenConfig" to avoid this.
  return Array.from(new Set(codegenComponent));
}

export function matchComponentDescriptors(contents: string): string | null {
  const match = contents.match(CODEGEN_NATIVE_COMPONENT_REGEX);
  if (!(match?.[4] === 'true') && match?.[2]) {
    return `${match[2]}ComponentDescriptor`;
  }
  return null;
}
