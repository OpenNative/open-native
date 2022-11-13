#ifndef Caches_h
#define Caches_h

#include <string>
#include <vector>
#include "ConcurrentMap.h"
#include "robin_hood.h"
#include "Common.h"
#include "Metadata.h"

namespace tns {

struct StructInfo;

struct pair_hash {
    template <class T1, class T2>
    std::size_t operator() (const std::pair<T1, T2> &pair) const {
        return std::hash<T1>()(pair.first) ^ std::hash<T2>()(pair.second);
    }
};

class Caches {
public:
    class WorkerState {
    public:
        WorkerState(v8::Isolate* isolate, std::shared_ptr<v8::Persistent<v8::Value>> poWorker, void* userData)
            : isolate_(isolate),
              poWorker_(poWorker),
              userData_(userData) {
        }

        v8::Isolate* GetIsolate() {
            return this->isolate_;
        }

        std::shared_ptr<v8::Persistent<v8::Value>> GetWorker() {
            return this->poWorker_;
        }

        void* UserData() {
            return this->userData_;
        }
    private:
        v8::Isolate* isolate_;
        std::shared_ptr<v8::Persistent<v8::Value>> poWorker_;
        void* userData_;
    };

    Caches(v8::Isolate* isolate);
    ~Caches();

    static std::shared_ptr<ConcurrentMap<std::string, const Meta*>> Metadata;
    static std::shared_ptr<ConcurrentMap<int, std::shared_ptr<Caches::WorkerState>>> Workers;

    static std::shared_ptr<Caches> Get(v8::Isolate* isolate);
    static void Remove(v8::Isolate* isolate);

    void SetContext(v8::Local<v8::Context> context);
    v8::Local<v8::Context> GetContext();

    robin_hood::unordered_map<const Meta*, std::unique_ptr<v8::Persistent<v8::Value>>> Prototypes;
    robin_hood::unordered_map<std::string, std::unique_ptr<v8::Persistent<v8::Object>>> ClassPrototypes;
    robin_hood::unordered_map<const BaseClassMeta*, std::unique_ptr<v8::Persistent<v8::FunctionTemplate>>> CtorFuncTemplates;
    robin_hood::unordered_map<std::string, std::unique_ptr<v8::Persistent<v8::Function>>> CtorFuncs;
    robin_hood::unordered_map<std::string, std::unique_ptr<v8::Persistent<v8::Function>>> ProtocolCtorFuncs;
    robin_hood::unordered_map<std::string, std::unique_ptr<v8::Persistent<v8::Function>>> StructConstructorFunctions;
    robin_hood::unordered_map<BinaryTypeEncodingType, std::unique_ptr<v8::Persistent<v8::Object>>> PrimitiveInteropTypes;
    robin_hood::unordered_map<std::string, std::unique_ptr<v8::Persistent<v8::Function>>> CFunctions;

    robin_hood::unordered_map<id, std::shared_ptr<v8::Persistent<v8::Value>>> Instances;
    robin_hood::unordered_map<std::pair<void*, std::string>, std::shared_ptr<v8::Persistent<v8::Value>>, pair_hash> StructInstances;
    robin_hood::unordered_map<const void*, std::shared_ptr<v8::Persistent<v8::Object>>> PointerInstances;

    std::function<v8::Local<v8::FunctionTemplate>(v8::Local<v8::Context>, const BaseClassMeta*, KnownUnknownClassPair, const std::vector<std::string>&)> ObjectCtorInitializer;
    std::function<v8::Local<v8::Function>(v8::Local<v8::Context>, StructInfo)> StructCtorInitializer;
    robin_hood::unordered_map<std::string, double> Timers;
    robin_hood::unordered_map<const InterfaceMeta*, std::vector<const MethodMeta*>> Initializers;

    std::unique_ptr<v8::Persistent<v8::Function>> EmptyObjCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> EmptyStructCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> SliceFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> OriginalExtendsFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> WeakRefGetterFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> WeakRefClearFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> SmartJSONStringifyFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> InteropReferenceCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> PointerCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> FunctionReferenceCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
    std::unique_ptr<v8::Persistent<v8::Function>> UnmanagedTypeCtorFunc = std::unique_ptr<v8::Persistent<v8::Function>>(nullptr);
private:
    static std::shared_ptr<ConcurrentMap<v8::Isolate*, std::shared_ptr<Caches>>> perIsolateCaches_;
    v8::Isolate* isolate_;
    std::shared_ptr<v8::Persistent<v8::Context>> context_;
};

}

#endif /* Caches_h */
