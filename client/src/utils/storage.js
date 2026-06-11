let memoryStorage = {};

const getCookie = (name) => {
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  } catch (e) {}
  return null;
};

const setCookie = (name, value, days = 7) => {
  try {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
  } catch (e) {}
};

const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  } catch (e) {}
};

export const setToken = (token) => {
  try {
    localStorage.setItem('token', token);
    return;
  } catch (e) {}
  try {
    sessionStorage.setItem('token', token);
    return;
  } catch (e) {}
  
  setCookie('token', token);
  memoryStorage['token'] = token;
};

export const getToken = () => {
  try {
    const local = localStorage.getItem('token');
    if (local) return local;
  } catch (e) {}
  try {
    const session = sessionStorage.getItem('token');
    if (session) return session;
  } catch (e) {}
  
  const cookie = getCookie('token');
  if (cookie) return cookie;
  
  return memoryStorage['token'];
};

export const removeToken = () => {
  try { localStorage.removeItem('token'); } catch (e) {}
  try { sessionStorage.removeItem('token'); } catch (e) {}
  deleteCookie('token');
  delete memoryStorage['token'];
};
