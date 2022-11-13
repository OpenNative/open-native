#ifndef Runtime_h
#define Runtime_h

#include "libplatform/libplatform.h"
#include "Common.h"
#include "ModuleInternal.h"
#include "MetadataBuilder.h"

namespace tns {

class Runtime {
public:
    Runtime();
    ~Runtime();
    v8::Isolate* CreateIsolate();
    void Init(v8::Isolate* isolate);
    void RunMainScript();
    v8::Isolate* GetIsolate();

    const int WorkerId();

    void SetWorkerId(int workerId);

    void RunModule(const std::string moduleName);

    static void Initialize();

    static Runtime* GetCurrentRuntime() {
        return currentRuntime_;
    }

    static bool IsWorker() {
        if (currentRuntime_ == nullptr) {
            return false;
        }

        return currentRuntime_->WorkerId() > 0;
    }

    static std::shared_ptr<v8::Platform> GetPlatform() {
        return platform_;
    }

    static id GetAppConfigValue(std::string key);

    static bool IsAlive(v8::Isolate* isolate);
private:
    static thread_local Runtime* currentRuntime_;
    static std::shared_ptr<v8::Platform> platform_;
    static std::vector<v8::Isolate*> isolates_;
    static bool mainThreadInitialized_;

    void DefineGlobalObject(v8::Local<v8::Context> context);
    void DefineCollectFunction(v8::Local<v8::Context> context);
    void DefineNativeScriptVersion(v8::Isolate* isolate, v8::Local<v8::ObjectTemplate> globalTemplate);
    void DefinePerformanceObject(v8::Isolate* isolate, v8::Local<v8::ObjectTemplate> globalTemplate);
    void DefineTimeMethod(v8::Isolate* isolate, v8::Local<v8::ObjectTemplate> globalTemplate);
    void DefineDrainMicrotaskMethod(v8::Isolate* isolate, v8::Local<v8::ObjectTemplate> globalTemplate);
    static void PerformanceNowCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    v8::Isolate* isolate_;
    std::unique_ptr<ModuleInternal> moduleInternal_;
    int workerId_;
};

}

#endif /* Runtime_h */
