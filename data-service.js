/* v0.3.1 sync-ready data layer.
   Today this uses localStorage. A future cloud adapter can replace these methods
   without changing the rest of the game flow. */
window.StudyVillageData = (() => {
  const prefix = 'studyvillage-player:';
  const emptyRecord = () => ({ totalScore: 0, attempts: 0, bestScore: 0, lastScore: 0, updatedAt: null });
  const key = name => `${prefix}${name}`;

  async function loadPlayer(name) {
    try {
      const raw = localStorage.getItem(key(name));
      if (!raw) return emptyRecord();
      return { ...emptyRecord(), ...JSON.parse(raw) };
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
    localStorage.setItem(key(name), JSON.stringify(payload));
    return payload;
  }

  async function listPlayers() {
    const players = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const k = localStorage.key(i);
      if (!k || !k.startsWith(prefix)) continue;
      try {
        players.push({ name: k.slice(prefix.length), ...JSON.parse(localStorage.getItem(k)) });
      } catch {}
    }
    return players;
  }

  return { loadPlayer, savePlayer, listPlayers, mode: 'local' };
})();