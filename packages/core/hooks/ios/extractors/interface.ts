import { logPrefix, ModuleNamesToMethodDescriptions } from '../common';
import { getSwiftInterfaceImplementationContents } from '../getters/swift-interface-impl';
import { extractModuleAliasedName } from './module-aliased-name';
import { extractObjcMethodContents } from './method';
import { extractMethodParamTypes } from './method-param-types';
/**
 * Extracts interfaces representing the methods added to any RCTBridgeModule by
 * macros (e.g. RCT_EXPORT_METHOD).
 */
export function extractInterfaces(sourceCode: string, sourceFiles: string[]) {
  /**
   * Every swift module interface file should have this piece of code.
   */
  const isSwiftModuleInterface = sourceCode.includes(
    `@interface RCT_EXTERN_MODULE`
  );

  if (!isSwiftModuleInterface && !sourceCode.includes('RCT_EXPORT_MODULE')) {
    return {};
  }

  /**
   * A record of JS bridge module names to method descriptions.
   * @example
   * {
   *    RNTestModule: [
   *      {
   *        exportedName: 'show',
   *        jsName: 'showWithRejecter',
   *        selector: 'show:withRejecter:',
   *        signature: '- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;',
   *        types: ['void', 'RCTPromiseResolveBlock', 'RCTPromiseRejectBlock'],
   *      }
   *    ]
   * }
   */
  const moduleNamesToMethodDescriptions = [
    ...sourceCode.matchAll(
      isSwiftModuleInterface
        ? /\s*@interface\s+RCT_EXTERN_MODULE\(\s*([A-z0-9$]+),\s+(?:.|[\r\n])*?@end/gm
        : /\s*@implementation\s+([A-z0-9$]+)\s+(?:.|[\r\n])*?@end/gm
    ),
  ].reduce<ModuleNamesToMethodDescriptions>((acc, matches) => {
    const [fullMatch, objcClassName] = matches;
    if (!objcClassName) {
      return acc;
    }

    /**
     * Extract swift implementation for the interface so we can later
     * check for things like methodQueu & exportedConstants etc that
     * only exist in the implementation.
     */
    const swiftImplContents = isSwiftModuleInterface
      ? getSwiftInterfaceImplementationContents(objcClassName, sourceFiles)
      : undefined;

    /**
     * In case of swift modules, the objc name is the exported
     * module name by default.
     */
    const exportedModuleName = isSwiftModuleInterface
      ? objcClassName
      : (extractModuleAliasedName(fullMatch) || objcClassName).replace(
          /^RCT/,
          ''
        );
    if (!exportedModuleName) {
      return acc;
    }

    /**
     * Extract the signatures of any methods registered using RCT_EXTERN_METHOD.
     * @example
     * RCT_EXTERN_METHOD(generate:(NSString *)keyTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
     */
    const externMethods = [
      /**
       * This is a crazy regex but it works, we start matching methods from
       * top to bottom of the file. We match from method to method, leaving
       * the start & end of each so the next match won't overlap with the
       * previous match and get skipped.
       */
      ...fullMatch.matchAll(/ERN_METHOD\((.|[\r\n])*?\)*(RCT_EXT|@end)/gm),
      ...fullMatch.matchAll(
        /ERN__BLOCKING_SYNCHRONOUS_METHOD\((.|[\r\n])*?\)*(RCT_EXT|@end)/gm
      ),
    ].map((match) => {
      const isSync = match[0].includes('BLOCKING_SYNCHRONOUS');
      const [
        ,
        /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromMethodName,
      ] = match[0]
        //Remove next method's starting RCT_EXT & trim out and whitespace at the end.
        .replace('RCT_EXT', '')
        .trim()
        .split(
          isSync ? /ERN__BLOCKING_SYNCHRONOUS_METHOD\(\s*/ : /ERN_METHOD\(\s*/
        );

      /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject' */
      const methodNameAndArgs = fromMethodName
        .split(')')
        .slice(0, -1)
        .join(')');
      const methodName = methodNameAndArgs.split(':')[0].trim();
      return extractObjcMethodContents(methodNameAndArgs, methodName, isSync);
    });

    /**
     * Extract the signatures of any methods registered using RCT_REMAP_METHOD.
     * @example
     * ['- (void)showWithRemappedName:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject']
     */
    const remappedMethods = [
      ...fullMatch.matchAll(/^\s*RCT_REMAP_METHOD\((.|[\r\n])*?\)*?\{/gm),
    ].map((match) => {
      const [
        ,
        /** @example 'showWithRemappedName , show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromMethodName,
      ] = match[0].split(/RCT_REMAP_METHOD\(\s*/);

      const [
        /** @example 'showWithRemappedName' */
        methodRemappedName,
        /** @example ' show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
        fromUnmappedMethodName,
      ] = fromMethodName.split(/\s*,/);

      /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject' */
      const methodUnmappedNameAndArgs = fromUnmappedMethodName
        .split(')')
        .slice(0, -1)
        .join(')');

      return extractObjcMethodContents(
        methodUnmappedNameAndArgs,
        methodRemappedName.trim()
      );
    });

    /**
     * Extract the signatures of any methods registered using RCT_EXPORT_METHOD.
     * @example
     * ['- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject']
     */
    const exportedMethods = [
      ...fullMatch.matchAll(/^\s*RCT_EXPORT_METHOD\((.|[\r\n])*?\)*\{/gm),
      ...fullMatch.matchAll(
        /^\s*RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD\((.|[\r\n])*?\)*\{/gm
      ),
    ]
      .map((match) => {
        const isSync = match[0].includes('BLOCKING_SYNCHRONOUS');
        const [
          ,
          /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject) {' */
          fromMethodName,
        ] = match[0].split(
          isSync
            ? /RCT_EXPORT_BLOCKING_SYNCHRONOUS_METHOD\(\s*/
            : /RCT_EXPORT_METHOD\(\s*/
        );

        /** @example 'show : (RCTPromiseResolveBlock)resolve\n    withRejecter : (RCTPromiseRejectBlock)reject' */
        const methodNameAndArgs = fromMethodName
          .split(')')
          .slice(0, -1)
          .join(')');
        const methodName = methodNameAndArgs.split(':')[0].trim();
        return methodName === 'name'
          ? null
          : extractObjcMethodContents(methodNameAndArgs, methodName, isSync);
      })
      .filter((method) => method !== null);

    /**
     * Extract the signatures of any methods registered using RCT_EXPORT_METHOD.
     * @example
     * ['- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject']
     */
    const quickExportedMethods = [
      ...fullMatch.matchAll(
        /(?<=(QUICK_RCT_EXPORT_COMMAND_METHOD|QUICK_RCT_EXPORT_COMMAND_METHOD_PARAMS)\()(.*)(?=\))/gm
      ),
    ]
      .map((match) => {
        const [name, type] = match[0].split(',');

        const methodNameAndArgs = `${name}:(nonnull NSNumber *)reactTag${
          type ? ` ${type}` : ''
        }`;
        return name === 'name'
          ? null
          : extractObjcMethodContents(methodNameAndArgs, name, false);
      })
      .filter((method) => method !== null);

    const viewProps = [
      ...fullMatch.matchAll(
        /(?<=(RCT_EXPORT_VIEW_PROPERTY|RCT_CUSTOM_VIEW_PROPERTY)\()(.*)(?=\))/gm
      ),
    ].map((match) => {
      const [name, type] = match[0].split(',');

      return {
        name: name.trim(),
        type: extractMethodParamTypes(type.trim()) || type,
      };
    });

    const allMethods = [
      ...remappedMethods,
      ...exportedMethods,
      ...externMethods,
      ...quickExportedMethods,
    ];

    if (!allMethods.length) {
      console.warn(
        `${logPrefix} Unable to extract any methods from RCTBridgeModule named "${exportedModuleName}".`
      );
    }

    const exportsConstants = isSwiftModuleInterface
      ? swiftImplContents?.includes('func constantsToExport()') || false
      : /\s+-\s+\(NSDictionary\s?\*\s?\)constantsToExport\s+{/.test(fullMatch);

    const hasMethodQueue =
      fullMatch.includes('methodQueue') ||
      swiftImplContents?.includes('methodQueue') ||
      false;

    acc[exportedModuleName] = {
      jsName: objcClassName,
      exportsConstants,
      hasMethodQueue,
      methods: allMethods,
      isSwiftModule: isSwiftModuleInterface,
      viewProps: viewProps,
    };

    return acc;
  }, {});

  /**
   * For each module name, form an interface from the extracted method
   * signatures. Concatenate the resulting array of interfaces.
   * @example
   * @interface RNTestModule1
   *  - (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;
   * @end
   *
   * @interface RNTestModule2
   *  - (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;
   * @end
   */
  const interfaceDecl = Object.keys(moduleNamesToMethodDescriptions)
    .map((exportedModuleName) => {
      const { jsName, methods, isSwiftModule } =
        moduleNamesToMethodDescriptions[exportedModuleName];

      return !methods || methods.length === 0 || isSwiftModule
        ? ''
        : [
            `@interface ${jsName} (TNS${jsName})`,
            methods.map((record) => record.signature).join('\n\n'),
            '@end',
          ].join('\n');
    })
    .join('\n\n');

  return {
    interfaceDecl,
    moduleNamesToMethodDescriptions,
    isSwiftModuleInterface: isSwiftModuleInterface,
  };
}
