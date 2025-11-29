export const startSpotifyLogin = async () => {
  const generateRandomString = (length) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
  };

//   async function generateCodeChallenge(verifier) {
//     const encoder = new TextEncoder();
//     const data = encoder.encode(verifier);
//     const digest = await crypto.subtle.digest("SHA-256", data);
//     return btoa(String.fromCharCode(...new Uint8Array(digest)))
//       .replace(/[+/=]/g, "")
//       .replace(/=/g, "");
//   }

  const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest("SHA-256", data);
  };

  const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");
  };

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier)
  const codeChallenge = await base64encode(hashed);

  localStorage.setItem("code-verifier", codeVerifier);

  const clientId = import.meta.env.VITE_CLIENT_ID;
  const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
  const scope = "playlist-read-private playlist-read-collaborative";

  const params = {
    response_type: "code",
    client_id: clientId,
    scope: scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: "http://127.0.0.1:5173/callback",
    state: generateRandomString(16),
  };

  const authURL = new URL("https://accounts.spotify.com/authorize");
  authURL.search = new URLSearchParams(params).toString();
  window.location.href = authURL.toString();
};

export const getAccessToken = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get("code");
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const codeVerifier = localStorage.getItem("code-verifier");

  if (!code) return null;

  const url = "https://accounts.spotify.com/api/token";
  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://127.0.0.1:5173/callback",
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  if(response.access_token) {
    localStorage.removeItem('codeVerifier')
    window.history.replaceState({}, document.title, "/");
  }

  console.log(response);
  return {
    accessToken:response.access_token,
    refreshToken:response.refresh_token
  }
};
