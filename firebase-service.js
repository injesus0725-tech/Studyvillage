/* v0.3.2 Firebase cloud adapter.
   This adapter activates only when firebase-config.js exists and enabled=true.
   Until then, StudyVillage continues to use the local fallback. */
window.StudyVillageFirebase = (() => {
  let auth = null;
  let db = null;
  let modules = null;
  let ready = false;

  const normalizeName = name => name.trim().toLowerCase().replace(/\s+/g, '-');
  const internalEmail = name => `${normalizeName(name)}@studyvillage.local`;

  async function init() {
    const config = window.StudyVillageFirebaseConfig;
    if (!config?.enabled) return { ok: false, mode: 'local', reason: 'disabled' };

    const appMod = await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js');
    const firestoreMod = await import('https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js');

    const app = appMod.initializeApp(config);
    auth = authMod.getAuth(app);
    db = firestoreMod.getFirestore(app);
    modules = { ...authMod, ...firestoreMod };
    ready = true;
    return { ok: true, mode: 'firebase' };
  }

  async function loginOrRegister(name, password) {
    if (!ready) return { ok: false, code: 'not-ready' };
    const email = internalEmail(name);
    try {
      const credential = await modules.signInWithEmailAndPassword(auth, email, password);
      return { ok: true, isNew: false, uid: credential.user.uid };
    } catch (error) {
      if (error.code !== 'auth/invalid-credential' && error.code !== 'auth/user-not-found') {
        return { ok: false, code: error.code || 'auth-error' };
      }
    }

    try {
      const credential = await modules.createUserWithEmailAndPassword(auth, email, password);
      return { ok: true, isNew: true, uid: credential.user.uid };
    } catch (error) {
      return { ok: false, code: error.code || 'auth-error' };
    }
  }

  async function loadRecord() {
    if (!ready || !auth.currentUser) return null;
    const ref = modules.doc(db, 'players', auth.currentUser.uid);
    const snap = await modules.getDoc(ref);
    return snap.exists() ? snap.data() : null;
  }

  async function saveRecord(name, record) {
    if (!ready || !auth.currentUser) throw new Error('not-authenticated');
    const ref = modules.doc(db, 'players', auth.currentUser.uid);
    const payload = {
      name,
      totalScore: Number(record.totalScore) || 0,
      attempts: Number(record.attempts) || 0,
      bestScore: Number(record.bestScore) || 0,
      lastScore: Number(record.lastScore) || 0,
      updatedAt: new Date().toISOString()
    };
    await modules.setDoc(ref, payload, { merge: true });
    return payload;
  }

  function isReady() { return ready; }
  function currentUid() { return auth?.currentUser?.uid || null; }

  return { init, loginOrRegister, loadRecord, saveRecord, isReady, currentUid, internalEmail };
})();
