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
const SESSION_DURATION_SECONDS = 60;

// Setup fetch function for Upstash
const fetch = createFetchForOrigin('upstash');

/**
 * Main handler for the edge request.
 */
export async function handleHttpRequest(request, context) {
  // Set context environment variables to process.env
  setEnvFromContext(context);

  const cookies = getCookiesFromRequest(request);

  // Get user ID from cookie or generate a new one
  const userId = cookies[COOKIE_NAME_ID]?.value ?? generateId();

  // Get the current number of records
  const size = await getRecordCount();

  console.log('Current number of active sessions: ', size);

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
function generateId(len = 10) {
  return Array.from({ length: len }, () =>
    ((Math.random() * 36) | 0).toString(36),
  ).join('');
}

/**
 * Handle the default response.
 */
async function getDefaultResponse(request, userId) {
  const response = new Response(default_html);
  response.headers.set('content-type', 'text/html;charset=UTF-8');

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
    setCookieToResponse(response, [COOKIE_NAME_TIME, now.toString()]);
  }

  setCookieToResponse(response, [COOKIE_NAME_ID, userId]);
  return response;
}

/**
 * Send a REST request to Upstash.
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
  const response = new Response(waiting_room_html);
  response.headers.set('content-type', 'text/html;charset=UTF-8');
  return response;
}

// HTML Templates
const waiting_room_html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv='refresh' content='5'>
    <title>Waiting Room</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            line-height: 1.4;
            font-size: 1rem;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            padding: 2rem;
            display: grid;
            place-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 800px;
            text-align: center;
            background-color: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        p {
            margin-top: .5rem;
        }

        .loader {
            border: 6px solid #f3f3f3;
            border-top: 6px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        h1 {
            margin-top: 20px;
            margin-bottom: 20px;
        }

    </style>
</head>

<body>
    <div class='container'>
        <div class="loader"></div>
        <h1>Almost There!</h1>
        <p>Our site is currently at full capacity. Thanks for your patience.</p>
        <p>You'll be redirected shortly. Please do not close your browser.</p>
    </div>
</body>

</html>
`;

const default_html = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Waiting Room Demo</title>
    <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            line-height: 1.4;
            font-size: 1rem;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            padding: 2rem;
            display: grid;
            place-items: center;
            min-height: 100vh;
            background-color: #f3f4f6;
            color: #333;
        }

        .container {
            width: 100%;
            max-width: 800px;
            text-align: center;
            background-color: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }

        p {
            margin-top: .5rem;
        }

        a {
            color: #3498db;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        h1 {
            margin-bottom: 20px;
        }

    </style>
</head>

<body>
    <div class='container'>
        <h1>Welcome to the Waiting Room Demo</h1>
        <p>
            This demo showcases an effective way to manage website traffic during high-volume periods. When the site is at full capacity, visitors are temporarily placed in a waiting room, ensuring a smooth user experience.
        </p>
        <p>Open <a href="/example/waiting-room">this link</a> in multiple new session browser windows to experience the waiting room.</p>
        <p><a href="https://github.com/Edgio/Edge-Functions-Examples" target="_blank">View the demo code on GitHub</a></p>
    </div>
</body>

</html>

  `;
