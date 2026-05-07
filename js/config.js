/**
 * config.js — API key management
 * Key lives in localStorage only — NEVER in source code or GitHub.
 */
const Config = (() => {
  const KEY = 'tlevel_quiz_api_key';
  const get = () => localStorage.getItem(KEY) || '';
  const set = v => { if (v.trim()) localStorage.setItem(KEY, v.trim()); };
  const clear = () => localStorage.removeItem(KEY);
  const has = () => { const k = get(); return k.startsWith('sk-ant-') && k.length > 20; };
  return { get, set, clear, has };
})();
export default Config;
