/**
 * config.js — API key management
 *
 * The API key is NEVER hardcoded here. It is entered by the user at runtime
 * and stored only in their own browser's localStorage. This means:
 *
 *  ✓ The key is not in your source code
 *  ✓ The key is not in your GitHub repo
 *  ✓ Each user supplies their own key
 *  ✓ The key is isolated to their browser — not shared with anyone
 *
 * IMPORTANT — do NOT add your real API key to this file.
 * Add config.js to your .gitignore if you ever want to test with a hardcoded key locally.
 */

const Config = (() => {
  const STORAGE_KEY = 'tlevel_quiz_api_key';

  function getKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function setKey(key) {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_KEY, trimmed);
    }
  }

  function clearKey() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function hasKey() {
    const k = getKey();
    return k.startsWith('sk-ant-') && k.length > 20;
  }

  return { getKey, setKey, clearKey, hasKey };
})();

export default Config;
