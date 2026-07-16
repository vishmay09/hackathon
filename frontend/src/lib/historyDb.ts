import { openDB, type DBSchema } from "idb";

export type StrategyRequest = {
  statement: string;
  team_roles: string[];
  duration_hours: number;
  constraints: string;
  technologies: string;
  target_audience: string;
  demo_time_minutes: number;
  additional_notes: string;
};

export type GeneratedStrategy = {
  scores?: {
    winning_potential?: number | string;
    [key: string]: unknown;
  };
  [key: string]: any;
};

export type StrategyHistoryItem = {
  id: string;
  title: string;
  createdAt: number;
  request: StrategyRequest;
  strategy: GeneratedStrategy;
};

interface HistoryDatabase extends DBSchema {
  strategies: {
    key: string;
    value: StrategyHistoryItem;
    indexes: {
      "by-created-at": number;
    };
  };
}

const databasePromise = openDB<HistoryDatabase>(
  "hackathon-strategy-history",
  1,
  {
    upgrade(database) {
      if (!database.objectStoreNames.contains("strategies")) {
        const store = database.createObjectStore("strategies", {
          keyPath: "id",
        });

        store.createIndex("by-created-at", "createdAt");
      }
    },
  }
);

export function createHistoryId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export async function getAllHistoryItems(): Promise<
  StrategyHistoryItem[]
> {
  const database = await databasePromise;

  const items = await database.getAllFromIndex(
    "strategies",
    "by-created-at"
  );

  return items.reverse();
}

export async function getHistoryItem(
  id: string
): Promise<StrategyHistoryItem | undefined> {
  const database = await databasePromise;
  return database.get("strategies", id);
}

export async function saveHistoryItem(
  item: StrategyHistoryItem
): Promise<void> {
  const database = await databasePromise;
  await database.put("strategies", item);
}

export async function deleteHistoryItem(
  id: string
): Promise<void> {
  const database = await databasePromise;
  await database.delete("strategies", id);
}

export async function renameHistoryItem(
  id: string,
  title: string
): Promise<StrategyHistoryItem> {
  const database = await databasePromise;
  const transaction = database.transaction(
    "strategies",
    "readwrite"
  );

  const existing = await transaction.store.get(id);

  if (!existing) {
    throw new Error("Strategy not found");
  }

  const updated: StrategyHistoryItem = {
    ...existing,
    title: title.trim() || "Untitled Strategy",
  };

  await transaction.store.put(updated);
  await transaction.done;

  return updated;
}

export async function duplicateHistoryItem(
  id: string
): Promise<StrategyHistoryItem> {
  const existing = await getHistoryItem(id);

  if (!existing) {
    throw new Error("Strategy not found");
  }

  const duplicated: StrategyHistoryItem = {
    ...existing,
    id: createHistoryId(),
    title: `${existing.title} (Copy)`,
    createdAt: Date.now(),
  };

  await saveHistoryItem(duplicated);

  return duplicated;
}