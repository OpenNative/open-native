#ifndef v8_network_agent_impl_h
#define v8_network_agent_impl_h

#include <string>
#include <map>
#include "utils.h"
#include "src/inspector/v8-inspector-impl.h"
#include "src/inspector/protocol/Network.h"
#include "src/inspector/protocol/Protocol.h"

namespace v8_inspector {

class V8InspectorSessionImpl;

using v8_inspector::protocol::Maybe;
using String = v8_inspector::String16;
using v8_inspector::protocol::DispatchResponse;

class V8NetworkAgentImpl : public protocol::Network::Backend {
public:
    V8NetworkAgentImpl(V8InspectorSessionImpl*, protocol::FrontendChannel*,
                       protocol::DictionaryValue* state);
    ~V8NetworkAgentImpl() override;
    V8NetworkAgentImpl(const V8NetworkAgentImpl&) = delete;
    V8NetworkAgentImpl& operator=(const V8NetworkAgentImpl&) = delete;

    DispatchResponse enable(Maybe<int> in_maxTotalBufferSize, Maybe<int> in_maxResourceBufferSize, Maybe<int> in_maxPostDataSize) override;
    DispatchResponse disable() override;

    DispatchResponse setExtraHTTPHeaders(std::unique_ptr<protocol::Network::Headers> in_headers) override;

    /*
     * Returns content served for the given request.
     * The content of each response is stored in `m_responses` when a request completes.
     * @param in_requestId
     */
    void getResponseBody(const String& in_requestId, std::unique_ptr<GetResponseBodyCallback> callback) override;

    DispatchResponse setCacheDisabled(bool in_cacheDisabled) override;

    DispatchResponse canClearBrowserCache(bool* out_result) override;
    DispatchResponse canClearBrowserCookies(bool* out_result) override;
    DispatchResponse emulateNetworkConditions(bool in_offline, double in_latency, double in_downloadThroughput, double in_uploadThroughput, Maybe<String> in_connectionType) override;
    DispatchResponse getCertificate(const String& in_origin, std::unique_ptr<protocol::Array<String>>* out_tableNames) override;
    void getRequestPostData(const String& in_requestId, std::unique_ptr<GetRequestPostDataCallback> callback) override;
    DispatchResponse replayXHR(const String& in_requestId) override;
    DispatchResponse searchInResponseBody(const String& in_requestId, const String& in_query, Maybe<bool> in_caseSensitive, Maybe<bool> in_isRegex, std::unique_ptr<protocol::Array<protocol::Debugger::SearchMatch>>* out_result) override;
    DispatchResponse setBlockedURLs(std::unique_ptr<protocol::Array<String>> in_urls) override;
    DispatchResponse setBypassServiceWorker(bool in_bypass) override;
    DispatchResponse setDataSizeLimitsForTest(int in_maxTotalSize, int in_maxResourceSize) override;

    const bool enabled() {
        return m_enabled;
    };

    void dispatch(std::string message);
private:
    protocol::Network::Frontend m_frontend;
    protocol::DictionaryValue* m_state;
    V8InspectorImpl* m_inspector;
    V8InspectorSessionImpl* m_session;
    bool m_enabled;

    void RequestWillBeSent(const v8::Local<v8::Object>& obj);
    void ResponseReceived(const v8::Local<v8::Object>& obj);
    void LoadingFinished(const v8::Local<v8::Object>& obj);
};

}

#endif /* v8_network_agent_impl_h */
