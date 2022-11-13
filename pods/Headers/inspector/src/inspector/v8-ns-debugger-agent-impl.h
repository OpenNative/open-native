#ifndef NSV8DebuggerAgentImpl_h
#define NSV8DebuggerAgentImpl_h

#include "src/inspector/v8-debugger-agent-impl.h"

namespace v8_inspector {

class NSV8DebuggerAgentImpl : public V8DebuggerAgentImpl {
public:
    NSV8DebuggerAgentImpl(V8InspectorSessionImpl*, protocol::FrontendChannel*, protocol::DictionaryValue *state);

    NSV8DebuggerAgentImpl(const NSV8DebuggerAgentImpl&) = delete;
    NSV8DebuggerAgentImpl& operator=(const NSV8DebuggerAgentImpl&) = delete;

    Response getPossibleBreakpoints(
            std::unique_ptr<protocol::Debugger::Location> start,
            Maybe<protocol::Debugger::Location> end,
            Maybe<bool> restrictToFunction,
            std::unique_ptr<protocol::Array<protocol::Debugger::BreakLocation>>* locations) override;
};

}

#endif /* NSV8DebuggerAgentImpl_h */
