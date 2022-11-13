#ifndef v8_log_agent_impl_h
#define v8_log_agent_impl_h

#include "src/inspector/protocol/Log.h"

namespace v8_inspector {
    
class V8InspectorSessionImpl;
    
using v8_inspector::protocol::DispatchResponse;
    
class V8LogAgentImpl : public protocol::Log::Backend {
public:
    V8LogAgentImpl(V8InspectorSessionImpl* session, protocol::FrontendChannel* frontend, protocol::DictionaryValue* state);
    ~V8LogAgentImpl() override;
    DispatchResponse enable() override;
    DispatchResponse disable() override;
    DispatchResponse clear() override;
    DispatchResponse startViolationsReport(std::unique_ptr<protocol::Array<protocol::Log::ViolationSetting>> in_config) override;
    DispatchResponse stopViolationsReport() override;
    
    static void EntryAdded(const std::string& text, std::string verbosityLevel, std::string url, int lineNumber);
    
private:
    protocol::Log::Frontend m_frontend;
    protocol::DictionaryValue* m_state;
    bool m_enabled;

    static V8LogAgentImpl* instance_;
};
    
}

#endif /* v8_log_agent_impl_h */
