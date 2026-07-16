import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  deleteHistoryItem,
  duplicateHistoryItem,
  getAllHistoryItems,
  getHistoryItem,
  renameHistoryItem,
  saveHistoryItem,
  type StrategyHistoryItem,
} from "../lib/historyDb";

type HistoryContextValue = {
  items: StrategyHistoryItem[];
  loading: boolean;
  error: string | null;
  add: (item: StrategyHistoryItem) => Promise<void>;
  remove: (id: string) => Promise<void>;
  rename: (id: string, title: string) => Promise<void>;
  duplicate: (
    id: string
  ) => Promise<StrategyHistoryItem>;
  getById: (
    id: string
  ) => Promise<StrategyHistoryItem | undefined>;
  refresh: () => Promise<void>;
};

const HistoryContext =
  createContext<HistoryContextValue | null>(null);

type HistoryProviderProps = {
  children: ReactNode;
};

export function HistoryProvider({
  children,
}: HistoryProviderProps) {
  const [items, setItems] = useState<
    StrategyHistoryItem[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const savedItems = await getAllHistoryItems();
      setItems(savedItems);
    } catch (refreshError) {
      console.error(
        "Could not load strategy history:",
        refreshError
      );

      setError("Could not load saved strategies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (item: StrategyHistoryItem) => {
      try {
        setError(null);

        await saveHistoryItem(item);

        setItems((currentItems) => [
          item,
          ...currentItems.filter(
            (current) => current.id !== item.id
          ),
        ]);
      } catch (saveError) {
        console.error(
          "Could not save strategy:",
          saveError
        );

        setError("Could not save strategy.");
        throw saveError;
      }
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    try {
      setError(null);

      await deleteHistoryItem(id);

      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== id)
      );
    } catch (deleteError) {
      console.error(
        "Could not delete strategy:",
        deleteError
      );

      setError("Could not delete strategy.");
      throw deleteError;
    }
  }, []);

  const rename = useCallback(
    async (id: string, title: string) => {
      const cleanTitle = title.trim();

      if (!cleanTitle) {
        return;
      }

      try {
        setError(null);

        const updated = await renameHistoryItem(
          id,
          cleanTitle
        );

        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === id ? updated : item
          )
        );
      } catch (renameError) {
        console.error(
          "Could not rename strategy:",
          renameError
        );

        setError("Could not rename strategy.");
        throw renameError;
      }
    },
    []
  );

  const duplicate = useCallback(async (id: string) => {
    try {
      setError(null);

      const duplicated =
        await duplicateHistoryItem(id);

      setItems((currentItems) => [
        duplicated,
        ...currentItems,
      ]);

      return duplicated;
    } catch (duplicateError) {
      console.error(
        "Could not duplicate strategy:",
        duplicateError
      );

      setError("Could not duplicate strategy.");
      throw duplicateError;
    }
  }, []);

  const getById = useCallback(async (id: string) => {
    return getHistoryItem(id);
  }, []);

  const value = useMemo<HistoryContextValue>(
    () => ({
      items,
      loading,
      error,
      add,
      remove,
      rename,
      duplicate,
      getById,
      refresh,
    }),
    [
      items,
      loading,
      error,
      add,
      remove,
      rename,
      duplicate,
      getById,
      refresh,
    ]
  );

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error(
      "useHistory must be used inside HistoryProvider"
    );
  }

  return context;
}