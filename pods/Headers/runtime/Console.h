#ifndef Console_h
#define Console_h

#include "Common.h"
#include <string>

namespace tns {

class Console {
public:
    static void Init(v8::Local<v8::Context> context);
private:
    static void AttachLogFunction(v8::Local<v8::Context> context, v8::Local<v8::Object> console, const std::string name, v8::FunctionCallback callback = Console::LogCallback);
    static void LogCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void AssertCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void DirCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void TimeCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void TimeEndCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static std::string BuildStringFromArgs(const v8::FunctionCallbackInfo<v8::Value>& args, int startingIndex = 0);
    static const v8::Local<v8::String> BuildStringFromArg(v8::Local<v8::Context> context, const v8::Local<v8::Value>& val);
    static const v8::Local<v8::String> TransformJSObject(v8::Local<v8::Object> object);
    static const std::string VerbosityToInspectorVerbosity(const std::string level);
};

}

#endif /* Console_h */
