import { readFileSync, writeFile } from '../common';

const DEPRECATED_REACT_DEP = `s.dependency 'React'`;
const DEPRECATED_REACT_DEP2 = `s.dependency "React"`;

export async function migratePodspecFile(path: string) {
  const originalContents = readFileSync(path, 'utf-8');
  const lines = originalContents.split('\n');
  const newContent: string[] = [];
  let modifed = false;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.includes(DEPRECATED_REACT_DEP) ||
      trimmedLine.includes(DEPRECATED_REACT_DEP2)) {
      if (!originalContents.includes(`s.dependency 'React-Core'`) &&
        !originalContents.includes(`s.dependency "React-Core"`)) {
        newContent.push(`  s.dependency 'React-Core'`);
      }
      modifed = true;
      continue;
    }

    if (trimmedLine.includes(`install_modules_dependencies`) &&
      !originalContents.includes(`respond_to?(:install_modules_dependencies`)) {
      modifed = true;
      continue;
    }

    newContent.push(line);
  }

  if (modifed) {
    await writeFile(path, newContent.join('\n'), {
      encoding: 'utf-8',
    });
  }
}
