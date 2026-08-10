/* v0.4.1 data service. Default storage is the classroom Node + SQLite server. */
window.StudyVillageData = (() => {
  const prefix = 'studyvillage-player:';
  const emptyRecord = () => ({ totalScore: 0, attempts: 0, bestScore: 0, lastScore: 0, updatedAt: null });
  const key = name => `${prefix}${name}`;

  async function serverReady() {
    return window.StudyVillageAuth?.checkServer ? window.StudyVillageAuth.checkServer() : false;
  }

  async function loadPlayer(name) {
    if (await serverReady()) {
      try {
        const r = await fetch('/api/player/me', {
          cache:'no-store',
          headers: window.StudyVillageAuth.authHeaders()
        });
        if (r.ok) {
          const data = await r.json();
          return { ...emptyRecord(), ...(data.player || {}) };
        }
      } catch {}
    }
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? { ...emptyRecord(), ...JSON.parse(raw) } : emptyRecord();
    } catch { return emptyRecord(); }
  }

  async function savePlayer(name, record) {
    const payload = {
      totalScore: Number(record.totalScore) || 0,
      attempts: Number(record.attempts) || 0,
      bestScore: Number(record.bestScore) || 0,
      lastScore: Number(record.lastScore) || 0
    };
    if (await serverReady()) {
      try {
        const r = await fetch('/api/player/me/record', {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
            ...window.StudyVillageAuth.authHeaders()
          },
          body:JSON.stringify(payload)
        });
        if (r.ok) {
          const data = await r.json();
          return { ...emptyRecord(), ...(data.player || {}) };
        }
      } catch {}
    }
    const localPayload = { ...payload, updatedAt:new Date().toISOString() };
    localStorage.setItem(key(name), JSON.stringify(localPayload));
    return localPayload;
  }

  async function listPlayers() {
    if (await serverReady()) {
      try {
        const r = await fetch('/api/ranking', { cache:'no-store' });
        if (r.ok) return (await r.json()).players || [];
      } catch {}
    }
    const players=[];
    for(let i=0;i<localStorage.length;i+=1){const k=localStorage.key(i);if(!k||!k.startsWith(prefix))continue;try{players.push({name:k.slice(prefix.length),...JSON.parse(localStorage.getItem(k))})}catch{}}
    return players;
  }

  return { loadPlayer, savePlayer, listPlayers, mode: async() => await serverReady() ? 'classroom-server' : 'local' };
})();
