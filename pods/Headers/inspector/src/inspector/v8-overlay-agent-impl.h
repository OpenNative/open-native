#ifndef v8_overlay_agent_impl_h
#define v8_overlay_agent_impl_h

#include "src/inspector/protocol/Overlay.h"

namespace v8_inspector {

class V8InspectorSessionImpl;

using v8_inspector::protocol::Maybe;
using String = v8_inspector::String16;
using v8_inspector::protocol::DispatchResponse;


class V8OverlayAgentImpl : public protocol::Overlay::Backend {
public:
    V8OverlayAgentImpl(V8InspectorSessionImpl *, protocol::FrontendChannel *,
                       protocol::DictionaryValue *state);

    ~V8OverlayAgentImpl() override;
    V8OverlayAgentImpl(const V8OverlayAgentImpl&) = delete;
    V8OverlayAgentImpl& operator=(const V8OverlayAgentImpl&) = delete;

    DispatchResponse enable() override;
    DispatchResponse disable() override;
    DispatchResponse setShowFPSCounter(bool in_show) override;
    DispatchResponse setPausedInDebuggerMessage(const Maybe<String> in_message) override;
    DispatchResponse setShowAdHighlights(bool in_show) override;

    DispatchResponse
    highlightNode(std::unique_ptr<protocol::Overlay::HighlightConfig> in_highlightConfig,
                  Maybe<int> in_nodeId, Maybe<int> in_backendNodeId, Maybe<String> in_objectId,
                  Maybe<String> in_selector) override;

    DispatchResponse
    highlightFrame(const String &in_frameId, Maybe<protocol::DOM::RGBA> in_contentColor,
                   Maybe<protocol::DOM::RGBA> in_contentOutlineColor) override;

    DispatchResponse hideHighlight() override;

    DispatchResponse getHighlightObjectForTest(int in_nodeId,
                                               Maybe<bool> in_includeDistance, Maybe<bool> in_includeStyle, std::unique_ptr<protocol::DictionaryValue>* out_highlight) override;

    DispatchResponse highlightQuad(std::unique_ptr<protocol::Array<double>> in_quad,
                                   Maybe<protocol::DOM::RGBA> in_color,
                                   Maybe<protocol::DOM::RGBA> in_outlineColor) override;

    DispatchResponse highlightRect(int in_x, int in_y, int in_width, int in_height,
                                   Maybe<protocol::DOM::RGBA> in_color,
                                   Maybe<protocol::DOM::RGBA> in_outlineColor) override;

    DispatchResponse setInspectMode(const String &in_mode,
                                    Maybe<protocol::Overlay::HighlightConfig> in_highlightConfig) override;

    DispatchResponse setShowDebugBorders(bool in_show) override;
    DispatchResponse setShowPaintRects(bool in_result) override;
    DispatchResponse setShowScrollBottleneckRects(bool in_show) override;
    DispatchResponse setShowHitTestBorders(bool in_show) override;
    DispatchResponse setShowViewportSizeOnResize(bool in_show) override;
    DispatchResponse setShowLayoutShiftRegions(bool in_result) override;

private:
    protocol::Overlay::Frontend m_frontend;
    protocol::DictionaryValue *m_state;
    bool m_enabled;
};

}

#endif /* v8_overlay_agent_impl_h */
