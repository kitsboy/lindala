/**
 * Thin Satohash API client for lindala.
 * Public proof plane only — no secrets. Identify traffic via X-Satohash-Client.
 *
 * API:  https://api.satohash.io
 * Site: https://satohash.io
 *
 * Usage:
 *   import { stampHash, getApiHealth, sha256Hex, verifyUrl, stampGuideUrl } from './lib/satohash.js'
 *   const health = await getApiHealth()
 *   // if (!health.ok) → offline; optional stampGuideUrl fallback
 *   const hash = await sha256Hex(payload)
 *   const proof = await stampHash(hash, { filename: 'lindala-seal.json' })
 *   if (!proof.ok) window.open(stampGuideUrl(hash), '_blank')
 */

const DEFAULT_API = 'https://api.satohash.io'
const DEFAULT_SITE = 'https://satohash.io'
export const SATOHASH_CLIENT_ID = 'lindala'

const HEX64 = /^[a-f0-9]{64}$/i

function stripSlash(url) {
  return String(url || '').replace(/\/+$/, '')
}

function env(name) {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[name]) {
      return import.meta.env[name]
    }
  } catch {
    /* no Vite */
  }
  try {
    if (typeof process !== 'undefined' && process.env && process.env[name]) {
      return process.env[name]
    }
  } catch {
    /* no Node */
  }
  return ''
}

/** API base (stamp + health). Override with VITE_SATOHASH_API_URL / SATOHASH_API_URL. */
export function getSatohashApiUrl() {
  return stripSlash(
    env('VITE_SATOHASH_API_URL') || env('SATOHASH_API_URL') || DEFAULT_API,
  )
}

/** Frontend base (verify + stamp guide). Override with VITE_SATOHASH_URL / SATOHASH_URL. */
export function getSatohashUrl() {
  return stripSlash(env('VITE_SATOHASH_URL') || env('SATOHASH_URL') || DEFAULT_SITE)
}

export const SATOHASH_API = DEFAULT_API
export const SATOHASH_SITE = DEFAULT_SITE

/** SHA-256 hex digest (Web Crypto). Never uploads the raw payload. */
export async function sha256Hex(input) {
  let bytes
  if (typeof input === 'string') {
    bytes = new TextEncoder().encode(input)
  } else if (typeof Blob !== 'undefined' && input instanceof Blob) {
    bytes = new Uint8Array(await input.arrayBuffer())
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input)
  } else if (ArrayBuffer.isView(input)) {
    bytes = new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  } else {
    throw new TypeError('sha256Hex: expected string, ArrayBuffer, TypedArray, or Blob')
  }
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** Public verify page for a stamp id or hash. */
export function verifyUrl(hashOrId) {
  if (!hashOrId) return `${getSatohashUrl()}/verify`
  return `${getSatohashUrl()}/verify/${encodeURIComponent(String(hashOrId))}`
}

/** Browser stamp guide with optional prefilled hash (offline / paywall fallback). */
export function stampGuideUrl(hash) {
  const base = `${getSatohashUrl()}/stamp`
  if (!hash) return base
  return `${base}?hash=${encodeURIComponent(String(hash))}`
}

function clientHeaders(extra = {}) {
  const headers = {
    Accept: 'application/json',
    'X-Satohash-Client': SATOHASH_CLIENT_ID,
    ...extra,
  }
  // Optional family free-tier key — never commit; private env only.
  const apiKey = env('VITE_SATOHASH_KEY') || env('SATOHASH_KEY') || ''
  if (apiKey) headers['X-Satohash-Key'] = apiKey
  return headers
}

/**
 * GET /health — API liveness. Never throws; ok:false when offline.
 * @param {{ deep?: boolean, signal?: AbortSignal }} [opts]
 */
export async function getApiHealth(opts = {}) {
  try {
    const qs = opts.deep ? '?deep=true' : ''
    const res = await fetch(`${getSatohashApiUrl()}/health${qs}`, {
      method: 'GET',
      headers: clientHeaders(),
      signal: opts.signal,
      cache: 'no-store',
    })
    let data
    try {
      data = await res.json()
    } catch {
      data = undefined
    }
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data,
        error: `Satohash health HTTP ${res.status}`,
      }
    }
    return { ok: true, status: res.status, data }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Satohash API unreachable',
    }
  }
}

/**
 * POST /api/stamp — timestamp a 64-char SHA-256 hex via OpenTimestamps.
 * Graceful offline: returns ok:false (does not throw) when API is down.
 * @param {string} hash
 * @param {{ filename?: string, apiKey?: string, signal?: AbortSignal }} [opts]
 */
export async function stampHash(hash, opts = {}) {
  const normalized = String(hash || '')
    .trim()
    .toLowerCase()
    .replace(/^0x/, '')
  if (!HEX64.test(normalized)) {
    return { ok: false, error: 'Hash must be 64 hex characters (SHA-256)', httpStatus: 400 }
  }

  try {
    const headers = clientHeaders({ 'Content-Type': 'application/json' })
    if (opts.apiKey) headers['X-Satohash-Key'] = opts.apiKey

    const res = await fetch(`${getSatohashApiUrl()}/api/stamp`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        hash: normalized,
        filename: opts.filename || `${SATOHASH_CLIENT_ID}-document`,
      }),
      signal: opts.signal,
    })

    let body = {}
    try {
      body = await res.json()
    } catch {
      /* non-JSON */
    }

    if (!res.ok) {
      const msg =
        body.message ||
        body.error ||
        `Satohash stamp failed (HTTP ${res.status})`
      return { ok: false, error: msg, httpStatus: res.status, data: body }
    }

    return {
      ok: true,
      id: typeof body.id === 'string' ? body.id : undefined,
      status: typeof body.status === 'string' ? body.status : 'pending',
      hash: typeof body.hash === 'string' ? body.hash : normalized,
      httpStatus: res.status,
      data: body,
    }
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : 'Satohash API unreachable — use stampGuideUrl fallback',
    }
  }
}

export default {
  SATOHASH_CLIENT_ID,
  SATOHASH_API,
  SATOHASH_SITE,
  getSatohashApiUrl,
  getSatohashUrl,
  sha256Hex,
  stampHash,
  getApiHealth,
  verifyUrl,
  stampGuideUrl,
}
