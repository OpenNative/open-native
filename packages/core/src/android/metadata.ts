import { Utils } from '@nativescript/core';
import { RNJavaSerialisableType } from '../common';

export type ModuleMetadata = {
  [name: string]: {
    types: number[];
    sync: boolean;
  };
};

export function parseModuleMetadata(moduleName: string): ModuleMetadata {
  const methods = Utils.dataDeserialize(
    global.reactNativeBridgeAndroid.getModuleMethods(moduleName)
  );
  const metadata = {};
  for (const method in methods) {
    metadata[method] = {
      types: methods[method].types.map((type) => {
        return extractMethodParamTypes(type);
      }),
      sync: methods[method].isSync,
    };
  }
  return metadata;
}

export function extractMethodParamTypes(
  javaType: string
): RNJavaSerialisableType {
  // Splitting before the generic should be redundant (we erased them earlier),
  // but just in case the implementation changes in future.
  const splitBeforeGeneric = javaType.split('<')[0];

  if (splitBeforeGeneric.includes('@NonNull String')) {
    return RNJavaSerialisableType.nonnullString;
  }
  if (splitBeforeGeneric.includes('String')) {
    return RNJavaSerialisableType.string;
  }

  // NonNull Java Integer Object & Integer
  if (splitBeforeGeneric.includes('@NonNull Integer')) {
    return RNJavaSerialisableType.nonnullJavaInteger;
  }
  if (splitBeforeGeneric.includes('Integer')) {
    return RNJavaSerialisableType.javaInteger;
  }
  // NonNull int and int
  if (splitBeforeGeneric.includes('@NonNull int')) {
    return RNJavaSerialisableType.nonnullInt;
  }
  if (splitBeforeGeneric.includes('int')) {
    return RNJavaSerialisableType.int;
  }

  // NonNull Java Boolean Object & Boolean Object
  if (splitBeforeGeneric.includes('@NonNull Boolean')) {
    return RNJavaSerialisableType.nonnullJavaBoolean;
  }

  if (splitBeforeGeneric.includes('Boolean')) {
    return RNJavaSerialisableType.javaBoolean;
  }
  // NonNull boolean & boolean
  if (splitBeforeGeneric.includes('@NonNull boolean')) {
    return RNJavaSerialisableType.nonnullBoolean;
  }

  if (splitBeforeGeneric.includes('boolean')) {
    return RNJavaSerialisableType.boolean;
  }

  // NonNull Java Double Object & Double Object
  if (splitBeforeGeneric.includes('@NonNull Double')) {
    return RNJavaSerialisableType.nonnullJavaDouble;
  }

  if (splitBeforeGeneric.includes('Double')) {
    return RNJavaSerialisableType.javaDouble;
  }
  // NonNull double & double
  if (splitBeforeGeneric.includes('@NonNull double')) {
    return RNJavaSerialisableType.nonnullDouble;
  }

  if (splitBeforeGeneric.includes('double')) {
    return RNJavaSerialisableType.double;
  }
  // NonNull Java Float Object & Float Object
  if (splitBeforeGeneric.includes('@NonNull Float')) {
    return RNJavaSerialisableType.nonnullJavaFloat;
  }

  if (splitBeforeGeneric.includes('Float')) {
    return RNJavaSerialisableType.javaFloat;
  }
  // NonNull float & float
  if (splitBeforeGeneric.includes('@NonNull float')) {
    return RNJavaSerialisableType.nonnullFloat;
  }

  if (splitBeforeGeneric.includes('float')) {
    return RNJavaSerialisableType.float;
  }

  if (splitBeforeGeneric.includes('@NonNull ReadableMap')) {
    return RNJavaSerialisableType.nonnullObject;
  }
  if (splitBeforeGeneric.includes('ReadableMap')) {
    return RNJavaSerialisableType.object;
  }
  if (splitBeforeGeneric.includes('@NonNull ReadableArray')) {
    return RNJavaSerialisableType.nonnullArray;
  }
  if (splitBeforeGeneric.includes('ReadableArray')) {
    return RNJavaSerialisableType.array;
  }
  if (splitBeforeGeneric.includes('@NonNull Callback')) {
    return RNJavaSerialisableType.nonnullCallback;
  }
  if (splitBeforeGeneric.includes('Callback')) {
    return RNJavaSerialisableType.Callback;
  }
  if (splitBeforeGeneric.includes('Promise')) {
    return RNJavaSerialisableType.Promise;
  }
  if (splitBeforeGeneric.includes('void')) {
    return RNJavaSerialisableType.void;
  }

  return RNJavaSerialisableType.other;
}
