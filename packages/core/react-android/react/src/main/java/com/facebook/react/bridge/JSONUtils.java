package com.facebook.react.bridge;

import java.util.List;
import java.util.Map;

public class JSONUtils {
  public static WritableArray fromArrayList(List<Object> list) {
    WritableNativeArray array = (WritableNativeArray) Arguments.createArray();
//    array.mLocalArray = list;
//    for (Object value: list) {
//      if (value instanceof Map) {
//        array.pushMap(fromHashMap((Map<String,Object>) value));
//      } else if (value instanceof List) {
//        array.pushArray(fromArrayList((List<Object>) value));
//      }
//    }
    return array;
  }

  public static WritableMap fromHashMap(Map<String,Object> hashMap) {
    WritableNativeMap map = (WritableNativeMap) Arguments.createMap();
//    map.mLocalMap = hashMap;
//    for (String key: hashMap.keySet()) {
//      Object value = hashMap.get(key);
//      if (value instanceof Map) {
//        map.putMap(key, fromHashMap((Map<String,Object>) value));
//      } else if (value instanceof List) {
//        map.putArray(key, fromArrayList((List<Object>) value));
//      }
//    }
    return map;
  }
}
