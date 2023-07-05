import {
  MethodDescriptionsMinimal,
  ModuleNamesToMethodDescriptions,
  ModuleNamesToMethodDescriptionsMinimal,
  writeFile,
} from '../common';
import { extractMethodParamTypes } from '../extractors/method-param-types';

/**
 * @param {object} args
 * @param args.moduleNamesToMethodDescriptions A record of JS bridge module
 * names to method descriptions, e.g.:
 * {
 *    RNTestModule: [
 *      {
 *        name: 'show',
 *        methodTypes: ['void', 'RCTPromiseResolveBlock', 'RCTPromiseRejectBlock'],
 *        signature: '- (void)show:(RCTPromiseResolveBlock)resolve withRejecter:(RCTPromiseRejectBlock)reject;',
 *      }
 *    ]
 * }
 * @param args.outputModuleMapPath An absolute path to output the module map to.
 * @returns A Promise to write the module map file into the specified location.
 */
export async function writeModuleMapFile({
  moduleNamesToMethodDescriptions,
  outputModuleMapPath,
}: {
  moduleNamesToMethodDescriptions: ModuleNamesToMethodDescriptions;
  outputModuleMapPath: string;
}) {
  const moduleNamesToMethodDescriptionsMinimal = Object.keys(
    moduleNamesToMethodDescriptions
  ).reduce<ModuleNamesToMethodDescriptionsMinimal>(
    (acc, exportedModuleName) => {
      const { exportsConstants, methods, jsName, hasMethodQueue, viewProps } =
        moduleNamesToMethodDescriptions[exportedModuleName];

      acc[exportedModuleName] = {
        j: jsName,
        e: exportsConstants,
        mq: hasMethodQueue,
        p: viewProps?.map((prop) => ({
          j: prop.name,
          t: prop.type,
        })),
        v: viewProps?.length > 0,
        m: methods.reduce<MethodDescriptionsMinimal>(
          (innerAcc, methodDescription) => {
            const { exportedName, jsName, types } = methodDescription;
            innerAcc[exportedName] = {
              j: jsName,
              t: types.map((paramType) => extractMethodParamTypes(paramType)),
            };
            return innerAcc;
          },
          {}
        ),
      };

      return acc;
    },
    {}
  );

  return await writeFile(
    outputModuleMapPath,
    JSON.stringify(moduleNamesToMethodDescriptionsMinimal, null, 1) + '\n',
    { encoding: 'utf-8' }
  );
}
