#ifndef JsV8InspectorClient_h
#define JsV8InspectorClient_h

#include <functional>
#include <dispatch/dispatch.h>
#include <string>
#include <vector>
#include <map>

#include "include/v8-inspector.h"
#include "runtime/Runtime.h"

namespace v8_inspector {

class JsV8InspectorClient : V8InspectorClient, V8Inspector::Channel {
public:
    JsV8InspectorClient(tns::Runtime* runtime);
    void init();
    void connect(int argc, char** argv);
    void createInspectorSession();
    void disconnect();
    void dispatchMessage(const std::string& message);

    void sendResponse(int callId, std::unique_ptr<StringBuffer> message) override;
    void sendNotification(std::unique_ptr<StringBuffer> message) override;
    void flushProtocolNotifications() override;

    void runMessageLoopOnPause(int contextGroupId) override;
    void quitMessageLoopOnPause() override;
    v8::Local<v8::Context> ensureDefaultContextInGroup(int contextGroupId) override;

    void scheduleBreak();
    void registerModules();

    static std::map<std::string, v8::Persistent<v8::Object>*> Domains;
private:
    static int contextGroupId;
    bool isConnected_;
    std::unique_ptr<V8Inspector> inspector_;
    v8::Persistent<v8::Context> context_;
    std::unique_ptr<V8InspectorSession> session_;
    tns::Runtime* runtime_;
    bool terminated_;
    std::vector<std::string> messages_;
    bool runningNestedLoops_;
    dispatch_queue_t messagesQueue_;
    dispatch_queue_t messageLoopQueue_;
    dispatch_semaphore_t messageArrived_;
    std::function<void (std::string)> sender_;
    bool isWaitingForDebugger_;

    void enableInspector(int argc, char** argv);
    void notify(std::unique_ptr<StringBuffer> message);
    void onFrontendConnected(std::function<void (std::string)> sender);
    void onFrontendMessageReceived(std::string message);
    template <class TypeName>
    static v8::Local<TypeName> PersistentToLocal(v8::Isolate* isolate, const v8::Persistent<TypeName>& persistent);
    std::string PumpMessage();
    static void registerDomainDispatcherCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void inspectorSendEventCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
    static void inspectorTimestampCallback(const v8::FunctionCallbackInfo<v8::Value>& args);
};

}

#endif /* JsV8InspectorClient_h */
