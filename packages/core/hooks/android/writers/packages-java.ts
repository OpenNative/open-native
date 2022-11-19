import { writeFile } from '../common';

/**
 * @param {object} args
 * @param args.packages An array of package information, with fields as such:
 *   [{
 *       packageImportPath: 'import com.testmodule.RNTestModulePackage;',
 *       packageInstance: 'new RNTestModulePackage()',
 *       modules: [{
 *         exportedModuleName: "RNTestModule",
 *         moduleClassName: "RNTestModule",
 *         moduleImportName: "com.testmodule.RNTestModule"
 *       }]
 *   }]
 * @returns A Promise to write the Packages.java file into the specified
 *   location.
 */
export async function writePackagesJavaFile({
  packages,
  outputPackagesJavaPath,
}: {
  packages: {
    packageImportPath: string;
    packageInstance: string;
    packageName: string;
    modules: {
      exportedModuleName: string;
      moduleImportName: string;
      moduleClassName: string;
    }[];
  }[];
  outputPackagesJavaPath: string;
}) {
  const contents = [
    'package com.bridge;',
    '',
    'import com.facebook.react.ReactPackage;',
    '',
    '// Import all module packages',
    ...packages.map(({ packageImportPath }) => packageImportPath),
    '',
    '// Import all module classes',
    ...packages.flatMap(({ modules }) =>
      modules.map((m) => `import ${m.moduleImportName};`)
    ),
    '',
    'import java.util.ArrayList;',
    'import java.util.Collections;',
    'import java.util.HashMap;',
    'import java.util.List;',
    '',
    'public class Packages {',
    '  public static List<ReactPackage> list = new ArrayList<>();',
    '  public static HashMap<String, Class> moduleClasses = new HashMap<>();',
    '  public static HashMap<String, String> modulePackageMap = new HashMap<>();',
    '',
    '  public static void init() {',
    "    // Register each package - we hopefully won't be using this for loading",
    '    // modules, as it breaks lazy loading logic',
    '    Collections.addAll(list,',
    ...packages.map(
      ({ packageInstance }, index) =>
        `      ${packageInstance}${index === packages.length - 1 ? '' : ','}`
    ),
    '    );',
    '',
    '    // Register each module class so that we can lazily access modules upon',
    '    // first function call',
    ...packages.flatMap(({ modules, packageImportPath }) =>
      modules.map((m) =>
        [
          `    moduleClasses.put("${m.exportedModuleName}", ${m.moduleClassName}.class);`,
          `    modulePackageMap.put("${m.moduleClassName}", "${packageImportPath
            ?.split('.')
            ?.pop()
            ?.replace(';', '')}");`,
        ].join('\n')
      )
    ),
    '',
    '  }',
    '}',
    '',
  ].join('\n');

  return await writeFile(outputPackagesJavaPath, contents, {
    encoding: 'utf-8',
  });
}
