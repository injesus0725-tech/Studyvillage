/* v0.3.2 sync-ready data layer with Firebase routing and local fallback. */
window.StudyVillageData = (() => {
  const prefix = 'studyvillage-player:';
  const emptyRecord = () => ({ totalScore: 0, attempts: 0, bestScore: 0, lastScore: 0, updatedAt: null });
  const key = name => `${prefix}${name}`;

  async function loadPlayer(name) {
    if (window.StudyVillageFirebase?.isReady()) {
      try {
        const remote = await window.StudyVillageFirebase.loadRecord();
        return { ...emptyRecord(), ...(remote || {}) };
      } catch {}
    }
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? { ...emptyRecord(), ...JSON.parse(raw) } : emptyRecord();
    } catch {
      return emptyRecord();
    }
  }

  async function savePlayer(name, record) {
    const payload = {
      totalScore: Number(record.totalScore) || 0,
      attempts: Number(record.attempts) || 0,
      bestScore: Number(record.bestScore) || 0,
      lastScore: Number(record.lastScore) || 0,
      updatedAt: new Date().toISOString()
    };
    if (window.StudyVillageFirebase?.isReady()) {
      try { return await window.StudyVillageFirebase.saveRecord(name, payload); } catch {}
    }
    localStorage.setItem(key(name), JSON.stringify(payload));
    return payload;
  }

  async function listPlayers() {
    const players = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      try { players.push({ name: k.slice(prefix.length), ...JSON.parse(localStorage.getItem(k)) }); } catch {}
    }
    return players;
  }

  return { loadPlayer, savePlayer, listPlayers, mode: () => window.StudyVillageFirebase?.isReady() ? 'firebase' : 'local' };
})();
