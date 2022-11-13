#ifndef ConcurrentMap_h
#define ConcurrentMap_h

#include <shared_mutex>
#include "robin_hood.h"

namespace tns {

template<class TKey, class TValue>
class ConcurrentMap {
public:
    void Insert(TKey& key, TValue value) {
        std::lock_guard<std::mutex> writerLock(this->containerMutex_);
        this->container_[key] = value;
    }

    TValue Get(TKey& key) {
        bool found;
        return this->Get(key, found);
    }

    TValue Get(TKey& key, bool& found) {
//      std::shared_lock<std::shared_timed_mutex> readerLock(this->containerMutex_);
        std::lock_guard<std::mutex> writerLock(this->containerMutex_);
        auto it = this->container_.find(key);
        found = it != this->container_.end();
        if (found) {
            return it->second;
        }
        return nullptr;
    }

    bool ContainsKey(TKey& key) {
//        std::shared_lock<std::shared_timed_mutex> readerLock(this->containerMutex_);
        std::lock_guard<std::mutex> writerLock(this->containerMutex_);
        auto it = this->container_.find(key);
        return it != this->container_.end();
    }

    void Remove(TKey& key) {
        std::lock_guard<std::mutex> writerLock(this->containerMutex_);
        this->container_.erase(key);
    }

    ConcurrentMap() = default;
    ConcurrentMap(const ConcurrentMap&) = delete;
    ConcurrentMap& operator=(const ConcurrentMap&) = delete;
private:
    std::mutex containerMutex_;
    robin_hood::unordered_map<TKey, TValue> container_;
};

}

#endif /* ConcurrentMap_h */
