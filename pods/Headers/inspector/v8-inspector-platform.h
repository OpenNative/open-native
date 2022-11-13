#ifndef v8_inspector_platform_h
#define v8_inspector_platform_h

using namespace std;
using namespace v8;
using namespace platform;

#include "include/v8-platform.h"
#include "src/base/platform/mutex.h"
#include "src/libplatform/default-platform.h"

#ifdef DEBUG
[[noreturn]]
void V8_Fatal(const char* file, int line, const char* format, ...) {
    printf("FATAL ERROR");
    throw;
}
#endif

namespace v8_inspector {

class V8InspectorPlatform: public DefaultPlatform {
public:
    explicit V8InspectorPlatform(int thread_pool_size = 0, v8::platform::IdleTaskSupport idle_task_support = IdleTaskSupport::kDisabled, unique_ptr<TracingController> tracing_controller = {}) {
    }

    void CallDelayedOnWorkerThread(unique_ptr<Task> task, double delay_in_seconds) override {
        DefaultPlatform::CallDelayedOnWorkerThread(move(task), 0);
    }

    static std::unique_ptr<Platform> CreateDefaultPlatform() {
        return NewDefaultPlatform();
    }
private:
    static unique_ptr<Platform> NewDefaultPlatform() {
        unique_ptr<DefaultPlatform> platform(new V8InspectorPlatform());
        platform->EnsureBackgroundTaskRunnerInitialized();
        return move(platform);
    }
};

}

#endif /* v8_inspector_platform_h */
