class GlobalStore:
    def __init__(self):
        self._vector_store = None
    
    @property
    def vector_store(self):
        return self._vector_store
    
    @vector_store.setter
    def vector_store(self, store):
        self._vector_store = store

global_store = GlobalStore()