import createFetchForOrigin from '../../utils/fetch';
import {
  getCookiesFromRequest,
  setCookieToResponse,
} from '../../utils/cookies';
import { setEnvFromContext } from '../../utils/polyfills/process.env';

import landingTemplate from './waiting-room-landing.html';
import capacityTemplate from './waiting-room-capacity.html';

// Constants
const COOKIE_NAME_ID = '__waiting_room_id';
const COOKIE_NAME_TIME = '__waiting_room_last_update_time';
const TOTAL_ACTIVE_USERS = 3;
const SESSION_DURATION_SECONDS = 30;

// Setup fetch function for Upstash
const fetch = createFetchForOrigin('upstash');

/**
 * Main handler for the edge request.
 */
export async function handleHttpRequest(request, context) {
  let resp;

  // Set context environment variables to process.env
  setEnvFromContext(context);

  const cookies = getCookiesFromRequest(request);

  // Get user ID from cookie or generate a new one
  const userId = cookies[COOKIE_NAME_ID] ?? generateId();

  // Get the current number of active sessions and the active user
  const size = await getRecordCount();
  const isActiveUser = (await getRecord(userId)) === '1';

  console.log('Current number of active sessions: ', size);

  // Check capacity
  if (size < TOTAL_ACTIVE_USERS || isActiveUser) {
    resp = await getDefaultResponse(request, userId);
  } else {
    resp = await getWaitingRoomResponse(position);
  }

  context.respondWith(resp);
}

/**
 * Generate a random ID
 */
function generateId(len = 10) {
  return Array.from({ length: len }, () =>
    ((Math.random() * 36) | 0).toString(36),
  ).join('');
}

/**
 * Handle the default response.
 */
async function getDefaultResponse(request, userId) {
  const response = new Response(landingTemplate);
  response.headers.set('content-type', 'text/html;charset=UTF-8');

  const cookies = getCookiesFromRequest(request);
  const now = Date.now();
  const lastUpdate = cookies[COOKIE_NAME_TIME];
  let lastUpdateTime = 0;

  if (lastUpdate) {
    lastUpdateTime = parseInt(lastUpdate);
  }

  const diff = now - lastUpdateTime;
  const updateInterval = (SESSION_DURATION_SECONDS * 1000) / 2;
  if (diff > updateInterval) {
    await setExpiryRecord(userId, '1', SESSION_DURATION_SECONDS);
    setCookieToResponse(response, [[COOKIE_NAME_TIME, now.toString()]]);
  }

  setCookieToResponse(response, [[COOKIE_NAME_ID, userId]]);
  return response;
}

/**
 * Send a REST request to Upstash.
 */
async function sendUpstashRequest(cmd) {
  cmd = Array.isArray(cmd) ? cmd.join('/') : cmd;

  return (
    await fetch(`${process.env.UPSTASH_REDIS_REST_URL}`, {
      method: 'POST',
      body: JSON.stringify(cmd.split('/')),
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      },
    })
  ).json();
}

/**
 * Get the current number of records.
 */
async function getRecordCount() {
  const data = await sendUpstashRequest('DBSIZE');
  return data.result;
}

/**
 * Fetch a record from Upstash by key.
 */
async function getRecord(key) {
  const data = await sendUpstashRequest(['GET', key]);
  return data.result;
}

/**
 * Set a record with an expiry time in Upstash.
 */
async function setExpiryRecord(key, value, seconds) {
  return sendUpstashRequest(['SET', key, value, 'EX', seconds]);
}

/**
 * Response for the waiting room.
 */
async function getWaitingRoomResponse(position) {
  const response = new Response(capacityTemplate);
  response.headers.set('content-type', 'text/html;charset=UTF-8');
  return response;
}
