import { useCallback, useSyncExternalStore } from "react";

import * as Types from "@/modules/movies/types";

type Entry = Types.Entity.Media;
type ListName = "saved" | "recent";

const STORAGE_KEYS: Record<ListName, string> = {
  saved: "posters:saved",
  recent: "posters:recent",
};

const RECENT_LIMIT = 20;
const EMPTY: Entry[] = [];

const cache: Partial<Record<ListName, Entry[]>> = {};
const listeners = new Set<() => void>();

const read = (name: ListName): Entry[] => {
  if (cache[name]) return cache[name]!;
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEYS[name]) || "[]");
    cache[name] = Array.isArray(parsed) ? parsed : EMPTY;
  } catch {
    cache[name] = EMPTY;
  }
  return cache[name]!;
};

const write = (name: ListName, items: Entry[]) => {
  cache[name] = items;
  try {
    localStorage.setItem(STORAGE_KEYS[name], JSON.stringify(items));
  } catch {
    // storage may be full or blocked (private mode) — keep the in-memory copy
  }
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  // keep several open tabs in sync
  const onStorage = (e: StorageEvent) => {
    const name = (Object.keys(STORAGE_KEYS) as ListName[]).find(k => STORAGE_KEYS[k] === e.key);
    if (!name) return;
    delete cache[name];
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

const sameItem = (a: Entry, b: Pick<Entry, "type" | "id">) => a.type === b.type && a.id === b.id;

// store only what the cards need, not the whole details payload
const toEntry = (item: Entry): Entry => ({
  id: item.id,
  type: item.type,
  title: item.title,
  original_title: item.original_title,
  overview: "",
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  release_date: item.release_date,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
  genre_ids: [],
  original_language: item.original_language,
});

const useList = (name: ListName) =>
  useSyncExternalStore(subscribe, () => read(name), () => EMPTY);

export const useSaved = () => {
  const items = useList("saved");

  const isSaved = useCallback(
    (item: Pick<Entry, "type" | "id">) => items.some(saved => sameItem(saved, item)),
    [items]
  );

  const toggle = useCallback((item: Entry) => {
    const current = read("saved");
    write(
      "saved",
      current.some(saved => sameItem(saved, item))
        ? current.filter(saved => !sameItem(saved, item))
        : [toEntry(item), ...current]
    );
  }, []);

  return { items, isSaved, toggle };
};

export const useRecent = () => {
  const items = useList("recent");

  const add = useCallback((item: Entry) => {
    const rest = read("recent").filter(recent => !sameItem(recent, item));
    write("recent", [toEntry(item), ...rest].slice(0, RECENT_LIMIT));
  }, []);

  const clear = useCallback(() => write("recent", []), []);

  return { items, add, clear };
};
