/**
 * Contest Atlas — db.js
 * Dedicated IndexedDB Storage Abstraction Layer
 * Database: ContestAtlasDB
 * Version: 1
 * 
 * Local-First, Offline-First Architecture
 * Privacy Guarantee: All manuscript text and submission records remain local on this device.
 */

const DB_NAME = 'ContestAtlasDB';
const DB_VERSION = 1;

const STORES = {
  PIECES: 'pieces',
  PIECE_VERSIONS: 'piece_versions',
  OPPORTUNITIES: 'opportunities',
  OPPORTUNITY_RULE_VERSIONS: 'opportunity_rule_versions',
  SUBMISSION_PLANS: 'submission_plans',
  SUBMISSIONS: 'submissions',
  SUBMISSION_EVENTS: 'submission_events',
  SUBMISSION_SNAPSHOTS: 'submission_snapshots',
  BIOS: 'bios',
  BIO_VERSIONS: 'bio_versions',
  COVER_NOTES: 'cover_notes',
  COVER_NOTE_VERSIONS: 'cover_note_versions',
  AUTHOR_PROFILES: 'author_profiles',
  SETTINGS: 'settings',
  BACKUP_SNAPSHOTS: 'backup_snapshots'
};

class ContestAtlasDB {
  constructor() {
    this.db = null;
    this._initPromise = null;
  }

  async init() {
    if (this.db) return this.db;
    if (this._initPromise) return this._initPromise;

    this._initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // 1. Pieces
        if (!db.objectStoreNames.contains(STORES.PIECES)) {
          const pieceStore = db.createObjectStore(STORES.PIECES, { keyPath: 'id' });
          pieceStore.createIndex('by_type', 'type', { unique: false });
          pieceStore.createIndex('by_genre', 'genre', { unique: false });
          pieceStore.createIndex('by_status', 'status', { unique: false });
          pieceStore.createIndex('by_updatedAt', 'updatedAt', { unique: false });
        }

        // 2. Piece Versions
        if (!db.objectStoreNames.contains(STORES.PIECE_VERSIONS)) {
          const versionStore = db.createObjectStore(STORES.PIECE_VERSIONS, { keyPath: 'id' });
          versionStore.createIndex('by_pieceId', 'pieceId', { unique: false });
          versionStore.createIndex('by_parentVersionId', 'parentVersionId', { unique: false });
          versionStore.createIndex('by_createdAt', 'createdAt', { unique: false });
        }

        // 3. Opportunities
        if (!db.objectStoreNames.contains(STORES.OPPORTUNITIES)) {
          const oppStore = db.createObjectStore(STORES.OPPORTUNITIES, { keyPath: 'id' });
          oppStore.createIndex('by_type', 'type', { unique: false });
          oppStore.createIndex('by_deadlineUtc', 'deadlineUtc', { unique: false });
          oppStore.createIndex('by_organization', 'organization', { unique: false });
        }

        // 4. Opportunity Rule Versions
        if (!db.objectStoreNames.contains(STORES.OPPORTUNITY_RULE_VERSIONS)) {
          const ruleStore = db.createObjectStore(STORES.OPPORTUNITY_RULE_VERSIONS, { keyPath: 'id' });
          ruleStore.createIndex('by_opportunityId', 'opportunityId', { unique: false });
          ruleStore.createIndex('by_versionNumber', 'versionNumber', { unique: false });
        }

        // 5. Submission Plans (Working/Mutable state)
        if (!db.objectStoreNames.contains(STORES.SUBMISSION_PLANS)) {
          const planStore = db.createObjectStore(STORES.SUBMISSION_PLANS, { keyPath: 'id' });
          planStore.createIndex('by_pieceId', 'pieceId', { unique: false });
          planStore.createIndex('by_pieceVersionId', 'pieceVersionId', { unique: false });
          planStore.createIndex('by_opportunityId', 'opportunityId', { unique: false });
          planStore.createIndex('by_status', 'status', { unique: false });
        }

        // 6. Submissions (Captured historical records)
        if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
          const subStore = db.createObjectStore(STORES.SUBMISSIONS, { keyPath: 'id' });
          subStore.createIndex('by_pieceId', 'pieceId', { unique: false });
          subStore.createIndex('by_pieceVersionId', 'pieceVersionId', { unique: false });
          subStore.createIndex('by_opportunityId', 'opportunityId', { unique: false });
          subStore.createIndex('by_submittedAt', 'submittedAt', { unique: false });
        }

        // 7. Submission Events (Outcome timeline)
        if (!db.objectStoreNames.contains(STORES.SUBMISSION_EVENTS)) {
          const eventStore = db.createObjectStore(STORES.SUBMISSION_EVENTS, { keyPath: 'id' });
          eventStore.createIndex('by_submissionId', 'submissionId', { unique: false });
          eventStore.createIndex('by_type', 'type', { unique: false });
          eventStore.createIndex('by_date', 'date', { unique: false });
        }

        // 8. Submission Snapshots (Frozen write-protected packages)
        if (!db.objectStoreNames.contains(STORES.SUBMISSION_SNAPSHOTS)) {
          db.createObjectStore(STORES.SUBMISSION_SNAPSHOTS, { keyPath: 'id' });
        }

        // 9. Bios
        if (!db.objectStoreNames.contains(STORES.BIOS)) {
          db.createObjectStore(STORES.BIOS, { keyPath: 'id' });
        }

        // 10. Bio Versions
        if (!db.objectStoreNames.contains(STORES.BIO_VERSIONS)) {
          const bioVerStore = db.createObjectStore(STORES.BIO_VERSIONS, { keyPath: 'id' });
          bioVerStore.createIndex('by_bioId', 'bioId', { unique: false });
        }

        // 11. Cover Notes
        if (!db.objectStoreNames.contains(STORES.COVER_NOTES)) {
          db.createObjectStore(STORES.COVER_NOTES, { keyPath: 'id' });
        }

        // 12. Cover Note Versions
        if (!db.objectStoreNames.contains(STORES.COVER_NOTE_VERSIONS)) {
          const coverVerStore = db.createObjectStore(STORES.COVER_NOTE_VERSIONS, { keyPath: 'id' });
          coverVerStore.createIndex('by_coverNoteId', 'coverNoteId', { unique: false });
        }

        // 13. Author Profiles
        if (!db.objectStoreNames.contains(STORES.AUTHOR_PROFILES)) {
          db.createObjectStore(STORES.AUTHOR_PROFILES, { keyPath: 'id' });
        }

        // 14. Settings
        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }

        // 15. Backup Safety Snapshots
        if (!db.objectStoreNames.contains(STORES.BACKUP_SNAPSHOTS)) {
          const snapStore = db.createObjectStore(STORES.BACKUP_SNAPSHOTS, { keyPath: 'id' });
          snapStore.createIndex('by_createdAt', 'createdAt', { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        console.error('ContestAtlasDB initialization error:', event.target.error);
        reject(event.target.error);
      };
    });

    return this._initPromise;
  }

  // --- GENERIC CRUD HELPERS ---

  async get(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async getByIndex(storeName, indexName, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const index = store.index(indexName);
      const req = index.getAll(value);
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  async put(storeName, value) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(value);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async putBulk(storeName, items) {
    if (!items || items.length === 0) return;
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      items.forEach(item => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async delete(storeName, key) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async clear(storeName) {
    await this.init();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // --- COMPLETE BACKUP EXPORT & SAFE RESTORE ---

  async exportFullBackup() {
    await this.init();
    const backup = {
      product: 'Contest Atlas',
      schemaVersion: 1,
      database: DB_NAME,
      exportedAt: new Date().toISOString(),
      stores: {}
    };

    const storeNames = Object.values(STORES);
    for (const storeName of storeNames) {
      backup.stores[storeName] = await this.getAll(storeName);
    }
    return backup;
  }

  async createSafetySnapshot() {
    const backup = await this.exportFullBackup();
    const snapshot = {
      id: 'snap_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString(),
      label: 'Pre-Restore Safety Snapshot',
      data: backup
    };
    await this.put(STORES.BACKUP_SNAPSHOTS, snapshot);
    return snapshot;
  }

  validateBackupStructure(backup) {
    if (!backup || typeof backup !== 'object') {
      throw new Error('Invalid backup file: content is not a valid JSON object.');
    }
    if (backup.product !== 'Contest Atlas') {
      throw new Error(`Incompatible product backup. Expected "Contest Atlas", found "${backup.product || 'Unknown'}".`);
    }
    if (backup.schemaVersion !== 1) {
      throw new Error(`Unsupported schema version: ${backup.schemaVersion}. Expected version 1.`);
    }
    if (!backup.stores || typeof backup.stores !== 'object') {
      throw new Error('Invalid backup file: missing required "stores" container.');
    }

    // Check presence of all 15 stores
    const allStoreNames = Object.values(STORES);
    for (const store of allStoreNames) {
      if (!Array.isArray(backup.stores[store])) {
        throw new Error(`Backup validation failed: store "${store}" is missing or not an array.`);
      }
    }

    // Referential integrity validation:
    // 1. Every piece_version must link to an existing piece in backup
    const pieceIds = new Set((backup.stores[STORES.PIECES] || []).map(p => p.id));
    for (const v of backup.stores[STORES.PIECE_VERSIONS] || []) {
      if (!v.pieceId || !pieceIds.has(v.pieceId)) {
        throw new Error(`Referential integrity violation: version "${v.name || v.id}" references non-existent piece ID "${v.pieceId}".`);
      }
    }

    // 2. Every submission must link to a piece and piece_version in backup
    const versionIds = new Set((backup.stores[STORES.PIECE_VERSIONS] || []).map(v => v.id));
    const snapIds = new Set((backup.stores[STORES.SUBMISSION_SNAPSHOTS] || []).map(s => s.id));
    for (const sub of backup.stores[STORES.SUBMISSIONS] || []) {
      if (!sub.pieceId || !pieceIds.has(sub.pieceId)) {
        throw new Error(`Referential integrity violation: submission "${sub.id}" references non-existent piece ID "${sub.pieceId}".`);
      }
      if (!sub.pieceVersionId || !versionIds.has(sub.pieceVersionId)) {
        throw new Error(`Referential integrity violation: submission "${sub.id}" references non-existent version ID "${sub.pieceVersionId}".`);
      }
      if (sub.submissionSnapshotId && !snapIds.has(sub.submissionSnapshotId)) {
        throw new Error(`Referential integrity violation: submission "${sub.id}" references missing snapshot ID "${sub.submissionSnapshotId}".`);
      }
    }

    return true;
  }

  async restoreFullBackup(backup) {
    this.validateBackupStructure(backup);

    // 1. Create a pre-restore safety snapshot
    const safetySnap = await this.createSafetySnapshot();

    // 2. Clear all stores and load fresh data
    const storeNames = Object.values(STORES);
    for (const storeName of storeNames) {
      // Don't overwrite the safety snapshots store with the backup's if we want to retain the safety snapshot
      if (storeName === STORES.BACKUP_SNAPSHOTS) continue;
      await this.clear(storeName);
      if (backup.stores[storeName] && Array.isArray(backup.stores[storeName])) {
        await this.putBulk(storeName, backup.stores[storeName]);
      }
    }

    return safetySnap;
  }

  async clearAllUserData() {
    const storeNames = Object.values(STORES);
    for (const storeName of storeNames) {
      await this.clear(storeName);
    }
  }

  async clearOnlyDemoData() {
    const isDemoRecord = (item) => {
      if (!item || !item.id) return false;
      return item.isDemo === true || String(item.id).startsWith('demo_');
    };

    const storeNames = Object.values(STORES);
    for (const storeName of storeNames) {
      if (storeName === STORES.SETTINGS || storeName === STORES.BACKUP_SNAPSHOTS) continue;
      const items = await this.getAll(storeName);
      for (const item of items) {
        if (isDemoRecord(item)) {
          await this.delete(storeName, item.id);
        }
      }
    }
  }
}

// Global database instance
window.contestAtlasDB = new ContestAtlasDB();
window.ATLAS_STORES = STORES;
