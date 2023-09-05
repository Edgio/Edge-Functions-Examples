import createFetchForOrigin from '../../utils/fetch';
import {
  getCookiesFromRequest,
  setCookieToResponse,
} from '../../utils/cookies';
import { setEnvFromContext } from '../../utils/polyfills/process.env';

// Constants
const COOKIE_NAME_ID = '__waiting_room_id';
const COOKIE_NAME_TIME = '__waiting_room_last_update_time';
const TOTAL_ACTIVE_USERS = 3;
const SESSION_DURATION_SECONDS = 30;

// Setup fetch
const fetch = createFetchForOrigin('upstash');

/**
 * Main handler for the HTTP request.
 */
export async function handleHttpRequest(request, context) {
  setEnvFromContext(context);

  const cookies = getCookiesFromRequest(request);
  const userId = cookies[COOKIE_NAME_ID]?.value ?? makeid(8);
  const size = await getRecordCount();

  console.log('current capacity:' + size);

  let resp;

  // Check capacity
  if (size < TOTAL_ACTIVE_USERS) {
    resp = await getDefaultResponse(request, userId);
  } else {
    const user = await getRecord(userId);
    resp =
      user === '1'
        ? await getDefaultResponse(request, userId)
        : await getWaitingRoomResponse();
  }

  context.respondWith(resp);
}

/**
 * Generate a random ID
 */
function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Handle the default response.
 */
async function getDefaultResponse(request, userId) {
  const newResponse = new Response(default_html);
  newResponse.headers.set('content-type', 'text/html;charset=UTF-8');

  const cookies = getCookiesFromRequest(request);
  const now = Date.now();
  const lastUpdate = cookies[COOKIE_NAME_TIME]?.value;
  let lastUpdateTime = 0;

  if (lastUpdate) {
    lastUpdateTime = parseInt(lastUpdate);
  }

  const diff = now - lastUpdateTime;
  const updateInterval = (SESSION_DURATION_SECONDS * 1000) / 2;
  if (diff > updateInterval) {
    await setExpiryRecord(userId, '1', SESSION_DURATION_SECONDS);
    setCookieToResponse(newResponse, [COOKIE_NAME_TIME, now.toString()]);
  }

  setCookieToResponse(newResponse, [COOKIE_NAME_ID, userId]);
  return newResponse;
}

/**
 * Send request to Upstash
 */
async function sendUpstashRequest(cmd) {
  cmd = Array.isArray(cmd) ? cmd.join('/') : cmd;
  return fetch(`${process.env.UPSTASH_REDIS_REST_URL}/${cmd}`, {
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
    },
  });
}

/**
 * Get the current number of records.
 */
async function getRecordCount() {
  const resp = await sendUpstashRequest('DBSIZE');
  return (await resp.json()).result;
}

/**
 * Fetch a record from Upstash by key.
 */
async function getRecord(key) {
  return sendUpstashRequest(['GET', key]);
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
async function getWaitingRoomResponse() {
  const newResponse = new Response(waiting_room_html);
  newResponse.headers.set('content-type', 'text/html;charset=UTF-8');
  return newResponse;
}

// HTML Templates
const waiting_room_html = `
  <title>Waiting Room</title>
  <meta http-equiv='refresh' content='10' />
  
  <style>*{box-sizing:border-box;margin:0;padding:0}body{line-height:1.4;font-size:1rem;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;padding:2rem;display:grid;place-items:center;min-height:100vh}.container{width:100%;max-width:800px}p{margin-top:.5rem}</style>
  
  <div class='container'>
    <h1>
      <div>You are now in line.</div>
      <div>Thanks for your patience.</div>
    </h1>
    <p>We are experiencing a high volume of traffic. Please sit tight and we will let you in soon. </p>
    <p><b>This page will automatically refresh, please do not close your browser.</b></p>
  </div>
  `;

const default_html = `
  <title>Waiting Room Demo</title>
  
  <style>*{box-sizing:border-box;margin:0;padding:0}body{line-height:1.4;font-size:1rem;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;padding:2rem;display:grid;place-items:center;min-height:100vh}.container{width:100%;max-width:800px}p{margin-top:.5rem}</style>
  
  <div class="container">
    <h1>
      <div>Waiting Room Demo</div>
    </h1>
      <p>
                Visit this site from a different browser, you will be forwarded to the waiting room when the capacity is full.
      </p>
    <p>  Check <a href='//github.com/upstash/redis-examples/tree/master/nextjs-waiting-room' style={{"color": "blue"}}>this project </a> to set up a waiting room for your website.</p>
  </div>
  `;
