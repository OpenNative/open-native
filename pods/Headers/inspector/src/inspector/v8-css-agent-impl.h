#ifndef v8_css_agent_impl_h
#define v8_css_agent_impl_h

#include "src/inspector/v8-inspector-impl.h"
#include "src/inspector/protocol/CSS.h"
#include "src/inspector/protocol/Protocol.h"

namespace v8_inspector {

class V8InspectorSessionImpl;

using v8_inspector::protocol::Maybe;
using String = v8_inspector::String16;
using protocol::DispatchResponse;


class V8CSSAgentImpl : public protocol::CSS::Backend {
public:
    V8CSSAgentImpl(V8InspectorSessionImpl*, protocol::FrontendChannel*,
                   protocol::DictionaryValue* state);

    ~V8CSSAgentImpl() override;
    V8CSSAgentImpl(const V8CSSAgentImpl&) = delete;
    V8CSSAgentImpl& operator=(const V8CSSAgentImpl&) = delete;

    void enable(std::unique_ptr<EnableCallback> callback) override;
    DispatchResponse disable() override;
    DispatchResponse getMatchedStylesForNode(int in_nodeId, Maybe<protocol::CSS::CSSStyle>* out_inlineStyle, Maybe<protocol::CSS::CSSStyle>* out_attributesStyle, Maybe<protocol::Array<protocol::CSS::RuleMatch>>* out_matchedCSSRules, Maybe<protocol::Array<protocol::CSS::PseudoElementMatches>>* out_pseudoElements, Maybe<protocol::Array<protocol::CSS::InheritedStyleEntry>>* out_inherited, Maybe<protocol::Array<protocol::CSS::CSSKeyframesRule>>* out_cssKeyframesRules) override;
    DispatchResponse getInlineStylesForNode(int in_nodeId, Maybe<protocol::CSS::CSSStyle>* out_inlineStyle, Maybe<protocol::CSS::CSSStyle>* out_attributesStyle) override;
    DispatchResponse getComputedStyleForNode(int in_nodeId, std::unique_ptr<protocol::Array<protocol::CSS::CSSComputedStyleProperty>>* out_computedStyle) override;
    DispatchResponse getPlatformFontsForNode(int in_nodeId, std::unique_ptr<protocol::Array<protocol::CSS::PlatformFontUsage>>* out_fonts) override;
    DispatchResponse getStyleSheetText(const String& in_styleSheetId, String* out_text) override;
    DispatchResponse addRule(const String& in_styleSheetId, const String& in_ruleText, std::unique_ptr<protocol::CSS::SourceRange> in_location, std::unique_ptr<protocol::CSS::CSSRule>* out_rule) override;
    DispatchResponse collectClassNames(const String& in_styleSheetId, std::unique_ptr<protocol::Array<String>>* out_classNames) override;
    DispatchResponse createStyleSheet(const String& in_frameId, String* out_styleSheetId) override;
    DispatchResponse forcePseudoState(int in_nodeId, std::unique_ptr<protocol::Array<String>> in_forcedPseudoClasses) override;
    DispatchResponse getBackgroundColors(int in_nodeId, Maybe<protocol::Array<String>>* out_backgroundColors, Maybe<String>* out_computedFontSize, Maybe<String>* out_computedFontWeight) override;
    DispatchResponse getMediaQueries(std::unique_ptr<protocol::Array<protocol::CSS::CSSMedia>>* out_medias) override;
    DispatchResponse setEffectivePropertyValueForNode(int in_nodeId, const String& in_propertyName, const String& in_value) override;
    DispatchResponse setKeyframeKey(const String& in_styleSheetId, std::unique_ptr<protocol::CSS::SourceRange> in_range, const String& in_keyText, std::unique_ptr<protocol::CSS::Value>* out_keyText) override;
    DispatchResponse setMediaText(const String& in_styleSheetId, std::unique_ptr<protocol::CSS::SourceRange> in_range, const String& in_text, std::unique_ptr<protocol::CSS::CSSMedia>* out_media) override;
    DispatchResponse setRuleSelector(const String& in_styleSheetId, std::unique_ptr<protocol::CSS::SourceRange> in_range, const String& in_selector, std::unique_ptr<protocol::CSS::SelectorList>* out_selectorList) override;
    DispatchResponse setStyleSheetText(const String& in_styleSheetId, const String& in_text, Maybe<String>* out_sourceMapURL) override;
    DispatchResponse setStyleTexts(std::unique_ptr<protocol::Array<protocol::CSS::StyleDeclarationEdit>> in_edits, std::unique_ptr<protocol::Array<protocol::CSS::CSSStyle>>* out_styles) override;
    DispatchResponse startRuleUsageTracking() override;
    DispatchResponse stopRuleUsageTracking(std::unique_ptr<protocol::Array<protocol::CSS::RuleUsage>>* out_ruleUsage) override;
    DispatchResponse takeCoverageDelta(std::unique_ptr<protocol::Array<protocol::CSS::RuleUsage>>* out_coverage) override;

    static V8CSSAgentImpl* Instance;

private:
    protocol::CSS::Frontend m_frontend;
    protocol::DictionaryValue* m_state;
    V8InspectorImpl* m_inspector;
    V8InspectorSessionImpl* m_session;

    bool m_enabled;
};

}

#endif /* v8_css_agent_impl_h */
