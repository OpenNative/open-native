import { exists, readFile, writeFile } from '../common';

const MARKER = `// open-native patched application`;
export async function writeAndroidApplication(projectDir: string) {
  const androidApplicationPath =
    projectDir +
    '/platforms/android/app/src/main/java/com/tns/NativeScriptApplication.java';
  const androidApplicationJava = await readFile(androidApplicationPath, {
    encoding: 'utf-8',
  });
  if (androidApplicationJava.includes(MARKER)) return;
  const chunks = androidApplicationJava.split('\n');

  // Implement ReactApplication interface
  const indexOfClassDef = chunks.findIndex((l) => l.startsWith('public class'));
  const indexOfImplements = chunks.findIndex((l) =>
    l.startsWith('implements ')
  );
  if (indexOfImplements > -1) {
    chunks[indexOfImplements] = chunks[indexOfImplements].replace(
      'implements ',
      'implements ReactApplication,'
    );
  } else {
    chunks[indexOfClassDef] = chunks[indexOfClassDef].replace(
      'extends Application',
      'extends Application implements ReactApplication'
    );
  }

  // Add imports
  const indexOfPackageDef = chunks.findIndex((l) => l.startsWith('package'));
  chunks.splice(
    indexOfPackageDef + 1,
    0,
    [
      '',
      'import com.facebook.react.ReactNativeHost;',
      'import com.facebook.react.ReactApplication;',
    ].join('\n')
  );
  // Install ReactNativeHost
  const indexOfConstructor = chunks.findIndex((l) =>
    l.includes(`thiz = this;`)
  );
  chunks.splice(
    indexOfConstructor + 1,
    0,
    [`        mReactNativeHost = new ReactNativeHost(this);`].join('\n')
  );
  // Add methods
  chunks.splice(
    chunks.lastIndexOf(chunks.filter((l) => l.includes('}')).pop()),
    0,
    [
      '',
      '    public static ReactNativeHost mReactNativeHost;',
      '    public ReactNativeHost getReactNativeHost() {',
      '        if (mReactNativeHost != null) return mReactNativeHost;',
      '        mReactNativeHost = new ReactNativeHost(this);',
      '        return mReactNativeHost;',
      '     }',
    ].join('\n')
  );
  chunks.push(MARKER);

  if (!(await exists(androidApplicationPath))) return;
  return await writeFile(androidApplicationPath, chunks.join('\n'), {
    encoding: 'utf-8',
  });
}
