import type { StateStorage } from "zustand/middleware";

const IDB_NAME = "linkamor-builder-v1";
const IDB_STORE = "blobs";
const REF_PREFIX = "__linkamor_img:";
const FULL_IDB_PREFIX = "full:";

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("indexedDB unavailable"));
  }
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onerror = () => reject(req.error ?? new Error("indexedDB open failed"));
      req.onupgradeneeded = () => {
        req.result.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
    });
  }
  return dbPromise;
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await getDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("indexedDB write failed"));
  });
}

async function idbGet(key: string): Promise<string | undefined> {
  const db = await getDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result as string | undefined);
    req.onerror = () => reject(req.error ?? new Error("indexedDB read failed"));
  });
}

function isDataImageUrl(value: string): boolean {
  return value.startsWith("data:image/");
}

function isImgRef(value: string): boolean {
  return value.startsWith(REF_PREFIX);
}

function externalizeImages(
  value: unknown,
  pending: Map<string, string>,
  seen: Map<string, string>
): unknown {
  if (typeof value === "string") {
    if (isImgRef(value)) return value;
    if (!isDataImageUrl(value)) return value;
    const existing = seen.get(value);
    if (existing) return existing;
    const id = crypto.randomUUID();
    const ref = `${REF_PREFIX}${id}`;
    pending.set(id, value);
    seen.set(value, ref);
    return ref;
  }
  if (Array.isArray(value)) {
    return value.map((item) => externalizeImages(item, pending, seen));
  }
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
      out[key] = externalizeImages(nested, pending, seen);
    }
    return out;
  }
  return value;
}

async function internalizeImages(value: unknown): Promise<unknown> {
  if (typeof value === "string") {
    if (!isImgRef(value)) return value;
    const id = value.slice(REF_PREFIX.length);
    return (await idbGet(id)) ?? value;
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item) => internalizeImages(item)));
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(
        async ([key, nested]) => [key, await internalizeImages(nested)] as const
      )
    );
    return Object.fromEntries(entries);
  }
  return value;
}

function isQuotaError(err: unknown): boolean {
  return err instanceof DOMException && (err.name === "QuotaExceededError" || err.code === 22);
}

function isFullIdbPointer(parsed: unknown): parsed is { state: { __linkamor_full_idb: string } } {
  return (
    typeof parsed === "object" &&
    parsed !== null &&
    typeof (parsed as { state?: { __linkamor_full_idb?: string } }).state?.__linkamor_full_idb ===
      "string"
  );
}

/** Persiste rascunho do builder: imagens base64 vão para IndexedDB, JSON leve fica no localStorage. */
export function createBuilderPersistStorage(): StateStorage {
  return {
    getItem: async (name) => {
      const raw = localStorage.getItem(name);
      if (!raw) return null;

      try {
        const parsed = JSON.parse(raw) as unknown;
        if (isFullIdbPointer(parsed)) {
          return (await idbGet(`${FULL_IDB_PREFIX}${parsed.state.__linkamor_full_idb}`)) ?? null;
        }
        const restored = await internalizeImages(parsed);
        return JSON.stringify(restored);
      } catch {
        return raw;
      }
    },

    setItem: async (name, value) => {
      const parsed = JSON.parse(value) as unknown;
      const pending = new Map<string, string>();
      const seen = new Map<string, string>();
      const slim = externalizeImages(parsed, pending, seen);

      for (const [id, dataUrl] of pending) {
        await idbSet(id, dataUrl);
      }

      const json = JSON.stringify(slim);
      try {
        localStorage.setItem(name, json);
      } catch (err) {
        if (!isQuotaError(err)) throw err;
        localStorage.removeItem(name);
        try {
          localStorage.setItem(name, json);
          return;
        } catch (retryErr) {
          if (!isQuotaError(retryErr)) throw retryErr;
        }
        await idbSet(`${FULL_IDB_PREFIX}${name}`, value);
        localStorage.setItem(
          name,
          JSON.stringify({ state: { __linkamor_full_idb: name }, version: 0 })
        );
      }
    },

    removeItem: (name) => {
      localStorage.removeItem(name);
    },
  };
}
