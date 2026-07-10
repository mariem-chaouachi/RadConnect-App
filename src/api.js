import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// On your phone (Expo Go): needs your computer's Wi-Fi IP, since it's a separate device.
// In a browser on your computer (`npx expo start` then press `w`): localhost is correct,
// since the app and the backend are running on the same machine.
const BASE_URL = Platform.OS === "web" ? "http://localhost:4000" : "http://192.168.1.40:4000";

const TOKEN_KEY = "radconnect_token";

// expo-secure-store only works on iOS/Android (it uses Keychain/Keystore, which don't
// exist in a browser). On web, fall back to localStorage — less secure, but fine for
// local development testing.
export async function saveToken(token) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

async function request(path, { method = "GET", body } = {}) {
  const token = await getToken();

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("Could not reach the server. Check that your backend is running.");
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status}).`);
  }

  return data;
}

export const api = {
  signup: (payload) => request("/auth/signup", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),
  me: () => request("/me"),
  listUsers: () => request("/auth/users"),

  listCases: () => request("/cases"),
  getCase: (id) => request(`/cases/${id}`),
  createCase: (payload) => request("/cases", { method: "POST", body: payload }),

  sendMessage: (caseId, payload) => request(`/cases/${caseId}/messages`, { method: "POST", body: payload }),
  answerQuestion: (caseId, questionId, payload) =>
    request(`/cases/${caseId}/questions/${questionId}`, { method: "PATCH", body: payload }),
  setStatus: (caseId, status) => request(`/cases/${caseId}/status`, { method: "PATCH", body: { status } }),
  assignSelf: (caseId) => request(`/cases/${caseId}/assign`, { method: "PATCH" }),
  requestImage: (caseId) => request(`/cases/${caseId}/request-image`, { method: "POST" }),
  addImage: (caseId, label) => request(`/cases/${caseId}/images`, { method: "POST", body: { label } }),
};