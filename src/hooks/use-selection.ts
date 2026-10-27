import { useCallback, useMemo, useState } from "react";

export interface Selectable {
  id: string;
}

const useSelection = <T extends Selectable>() => {
  const [selected, setSelected] = useState<Map<string, T>>(() => new Map());

  const toggle = useCallback((item: T) => {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.set(item.id, item);
      return next;
    });
  }, []);

  const setMany = useCallback((items: T[], value: boolean) => {
    setSelected(prev => {
      const next = new Map(prev);
      items.forEach(item => (value ? next.set(item.id, item) : next.delete(item.id)));
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Map()), []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const items = useMemo(() => [...selected.values()], [selected]);

  return { items, count: selected.size, isSelected, toggle, setMany, clear };
};

export type Selection<T extends Selectable> = ReturnType<typeof useSelection<T>>;

export default useSelection;
