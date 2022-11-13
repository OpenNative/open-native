#ifndef Helpers_h
#define Helpers_h

#include <functional>
#include <string>
#include "Common.h"
#include "DataWrapper.h"

#ifdef __OBJC__
#include <Foundation/Foundation.h>
#else
#include <CoreFoundation/CoreFoundation.h>
extern "C" void NSLog(CFStringRef format, ...);
#endif

namespace tns {

v8::Local<v8::String> ToV8String(v8::Isolate* isolate, std::string value);
std::string ToString(v8::Isolate* isolate, const v8::Local<v8::Value>& value);
std::u16string ToUtf16String(v8::Isolate* isolate, const v8::Local<v8::Value>& value);
double ToNumber(v8::Isolate* isolate, const v8::Local<v8::Value>& value);
bool ToBool(const v8::Local<v8::Value>& value);
std::vector<uint16_t> ToVector(const std::string& value);

bool Exists(const char* fullPath);
v8::Local<v8::String> ReadModule(v8::Isolate* isolate, const std::string &filePath);
const char* ReadText(const std::string& filePath, long& length, bool& isNew);
std::string ReadText(const std::string& file);
uint8_t* ReadBinary(const std::string path, long& length, bool& isNew);
bool WriteBinary(const std::string& path, const void* data, long length);

void SetPrivateValue(const v8::Local<v8::Object>& obj, const v8::Local<v8::String>& propName, const v8::Local<v8::Value>& value);
v8::Local<v8::Value> GetPrivateValue(const v8::Local<v8::Object>& obj, const v8::Local<v8::String>& propName);

void SetValue(v8::Isolate* isolate, const v8::Local<v8::Object>& obj, BaseDataWrapper* value);
BaseDataWrapper* GetValue(v8::Isolate* isolate, const v8::Local<v8::Value>& val);
void DeleteValue(v8::Isolate* isolate, const v8::Local<v8::Value>& val);
std::vector<v8::Local<v8::Value>> ArgsToVector(const v8::FunctionCallbackInfo<v8::Value>& info);

inline bool IsString(const v8::Local<v8::Value>& value) {
    return !value.IsEmpty() && (value->IsString() || value->IsStringObject());
}

inline bool IsNumber(const v8::Local<v8::Value>& value) {
    return !value.IsEmpty() && (value->IsNumber() || value->IsNumberObject());
}

inline bool IsBool(const v8::Local<v8::Value>& value) {
    return !value.IsEmpty() && (value->IsBoolean() || value->IsBooleanObject());
}


bool IsArrayOrArrayLike(v8::Isolate* isolate, const v8::Local<v8::Value>& value);
void* TryGetBufferFromArrayBuffer(const v8::Local<v8::Value>& value, bool& isArrayBuffer);

void ExecuteOnMainThread(std::function<void ()> func, bool async = true);

void LogError(v8::Isolate* isolate, v8::TryCatch& tc);
void LogBacktrace(int skip = 1);
#ifndef __OBJC__
#define Log(fmt, ...) NSLog(CFSTR(fmt), ##__VA_ARGS__)
#else
#define Log(...) NSLog(__VA_ARGS__)
#endif

v8::Local<v8::String> JsonStringifyObject(v8::Local<v8::Context> context, v8::Local<v8::Value> value, bool handleCircularReferences = true);
v8::Local<v8::Function> GetSmartJSONStringifyFunction(v8::Isolate* isolate);

std::string ReplaceAll(const std::string source, std::string find, std::string replacement);

const std::string BuildStacktraceFrameLocationPart(v8::Isolate* isolate, v8::Local<v8::StackFrame> frame);
const std::string BuildStacktraceFrameMessage(v8::Isolate* isolate, v8::Local<v8::StackFrame> frame);
const std::string GetStackTrace(v8::Isolate* isolate);
const std::string GetCurrentScriptUrl(v8::Isolate* isolate);

bool LiveSync(v8::Isolate* isolate);

void Assert(bool condition, v8::Isolate* isolate = nullptr, std::string const &reason = std::string());

void StopExecutionAndLogStackTrace(v8::Isolate* isolate);

}

#endif /* Helpers_h */
