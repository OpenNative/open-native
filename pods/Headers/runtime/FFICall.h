#ifndef FFICall_h
#define FFICall_h

#include <malloc/malloc.h>
#include <map>
#include "robin_hood.h"
#include "Metadata.h"
#include "DataWrapper.h"
#include "libffi.h"

namespace tns {

class BaseCall {
public:
    BaseCall(uint8_t* buffer, size_t returnOffset = 0)
        : buffer_(buffer),
          returnOffset_(returnOffset) {
    }

    ~BaseCall() {
    }

    void* ResultBuffer() {
        return this->buffer_ + this->returnOffset_;
    }

    template <typename T>
    T& GetResult() {
        return *static_cast<T*>(this->ResultBuffer());
    }
protected:
    uint8_t* buffer_;
    size_t returnOffset_;
};

class ParametrizedCall {
public:
    ParametrizedCall(ffi_cif* cif)
        : Cif(cif),
          ReturnOffset(0),
          StackSize(0) {
        unsigned int argsCount = cif->nargs;
        this->StackSize = 0;

        if (argsCount > 0) {
            this->StackSize = malloc_good_size(sizeof(void* [argsCount]));
        }

        this->ReturnOffset = this->StackSize;

        this->StackSize += malloc_good_size(std::max(cif->rtype->size, sizeof(ffi_arg)));

        this->ArgValueOffsets.reserve(argsCount);
        for (size_t i = 0; i < argsCount; i++) {
            this->ArgValueOffsets.push_back(this->StackSize);
            ffi_type* argType = cif->arg_types[i];
            this->StackSize += malloc_good_size(std::max(argType->size, sizeof(ffi_arg)));
        }
    }

    static ParametrizedCall* Get(const TypeEncoding* typeEncoding, const int initialParameterIndex, const int argsCount);

    ffi_cif* Cif;
    size_t ReturnOffset;
    size_t StackSize;
    std::vector<size_t> ArgValueOffsets;
private:
    static robin_hood::unordered_map<const TypeEncoding*, ParametrizedCall*> callsCache_;
};

class FFICall: public BaseCall {
public:
    FFICall(ParametrizedCall* parametrizedCall): BaseCall(nullptr) {
        this->returnOffset_ = parametrizedCall->ReturnOffset;
        this->buffer_ = reinterpret_cast<uint8_t*>(malloc(parametrizedCall->StackSize));

        this->argsArray_ = reinterpret_cast<void**>(this->buffer_);
        for (size_t i = 0; i < parametrizedCall->Cif->nargs; i++) {
            this->argsArray_[i] = this->buffer_ + parametrizedCall->ArgValueOffsets[i];
        }
    }

    ~FFICall() {
        free(this->buffer_);
    }

    static ffi_type* GetArgumentType(const TypeEncoding* typeEncoding, bool isStructMember = false);
    static StructInfo GetStructInfo(const StructMeta* structMeta, std::string structName = "");
    static StructInfo GetStructInfo(size_t fieldsCount, const TypeEncoding* fieldEncoding, const String* fieldNames, std::string structName = "");

    void* ArgumentBuffer(unsigned index) {
        return this->argsArray_[index];
    }

    void** ArgsArray() {
        return this->argsArray_;
    }
private:
    static robin_hood::unordered_map<std::string, StructInfo> structInfosCache_;
    void** argsArray_;
};

}

#endif /* FFICall_h */
