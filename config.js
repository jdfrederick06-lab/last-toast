/* =====================================================================
   KANE OIL — SITE SETTINGS
   This is the only technical file you need to touch.
   ===================================================================== */
window.CONFIG = {

  // Paste your Firebase web config between the braces to sync every phone.
  // Leave as null to run in LOCAL mode (syncs tabs on one device only — for rehearsing).
  // Example:
  // FIREBASE: { apiKey:"AIza...", authDomain:"...", databaseURL:"https://xxx-default-rtdb.firebaseio.com", projectId:"...", appId:"..." },
  FIREBASE: {
    apiKey: "AIzaSyBqo8qBNRdBLYUevqfyjVU46S139Vy0mZo",
    authDomain: "last-toast.firebaseapp.com",
    databaseURL: "https://last-toast-default-rtdb.firebaseio.com",
    projectId: "last-toast",
    storageBucket: "last-toast.firebasestorage.app",
    messagingSenderId: "682371508780",
    appId: "1:682371508780:web:3071cb80d2679edb84bf89"
  },

  // Change this to start a completely separate game (fresh RSVPs, fresh state).
  GAME_ID: 'last-toast',

  // Your public site address, used for invite links and QR codes.
  // Leave blank to detect it automatically.
  SITE_URL: 'https://jdfrederick06-lab.github.io/last-toast/',

  // Public lock for RSVP contact details and photos (only the host code can open them). Don't change it.
  RSVP_KEY: {"kty":"RSA","e":"AQAB","n":"wgr9yYrzTFvs2VGzkKkTvdjaMluDIYi-2soO9tZEnbpjDBgiFaw0glnU3DdN7DQePL5VhIDc-kUvrgc5JEgCL5qimzfXar5MpFr3yaHAl3vQxvVPaLnXSgAysqfh_CASvSlf41OHuA6GQl1dP7qNfhA4Cn5s3R5FPtfu3-rjC0WSUF-tQtFYM2Abg1N6g83jq7KeAj0B5UO3n3I7mRhznGtfaxl1wUs7HwqxC4nAm5Wdp0gcQLDRTDSJ9_2nejq4PNebTCBfrrttfdTuZ8ey-OxMB-Z1u3H6LLGBDEpi3uVJXJ96REhTxufv8JqiKfaDoIn5a7XmZwoK_ypJVGwDgQ","alg":"RSA-OAEP-256","ext":true},

  HEARTBEAT_MS: 5000,      // how often phones ping "I'm here"
  ONLINE_WINDOW_MS: 15000  // a phone counts as online if it pinged within this window
};
