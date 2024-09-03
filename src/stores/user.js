import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import router from '@/router';
import sha512 from 'js-sha512';
import aesjs from 'aes-js';

// function hexToUint8Array(hexString) {
//   return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
// }

// async function decryptToken(encryptedSession, sessionId, sessionKey) {
//   // 重新創建 key 和 iv
//   const encoder = new TextEncoder();
//   const keyMaterial = await crypto.subtle.digest('SHA-512', encoder.encode(sessionId));
//   const ivMaterial = await crypto.subtle.digest('SHA-512', encoder.encode(sessionKey));
  
//   const key = hexToUint8Array(Array.from(new Uint8Array(keyMaterial)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 64));
//   const iv = hexToUint8Array(Array.from(new Uint8Array(ivMaterial)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32));

//   // 導入金鑰
//   const cryptoKey = await crypto.subtle.importKey(
//     'raw',
//     key,
//     { name: 'AES-CBC' },
//     false,
//     ['decrypt']
//   );

//   // 解碼 base64 的加密資料
//   const encryptedData = atob(encryptedSession.user);
//   const encryptedBytes = hexToUint8Array(encryptedData);

//   // 解密
//   const decryptedBytes = await crypto.subtle.decrypt(
//     { name: 'AES-CBC', iv: iv },
//     cryptoKey,
//     encryptedBytes
//   );

//   // 將解密後的資料轉換回物件
//   const decryptedText = new TextDecoder().decode(decryptedBytes);
//   return JSON.parse(decryptedText);
// }

function hexToBytes(hex) {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2)
      bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

function decryptToken(encryptedSession, sessionId, sessionKey) {
  // 使用 SHA-512 生成 key 和 iv
  const keyHex = sha512(sessionId).substring(0, 64);
  const ivHex = sha512(sessionKey).substring(0, 32);

  const key = hexToBytes(keyHex);
  const iv = hexToBytes(ivHex);

  // 解碼 base64 的加密資料
  const encryptedBytes = atob(encryptedSession.user);
  const encryptedData = hexToBytes(encryptedBytes);

  // 使用 AES-CBC 解密
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
  const decryptedBytes = aesCbc.decrypt(encryptedData);

  // 移除 PKCS7 填充
  const paddingLength = decryptedBytes[decryptedBytes.length - 1];
  const unpaddedBytes = decryptedBytes.slice(0, -paddingLength);

  // 將解密後的資料轉換回物件
  const decryptedText = aesjs.utils.utf8.fromBytes(unpaddedBytes);
  return JSON.parse(decryptedText);
}

export default defineStore('user', () => {
  const dataForm = ref(null);
  const user = ref(null);
  const sessionId = ref('');
  
  const timeshift = ref(0);
  
  async function loginUser(form) {
    const {
      sessionId: tmpSessionId, user: tmpUser, timezone
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: form,
    });

    const encryptedSession = { user: tmpUser };
    const sessionId = tmpSessionId;
    const sessionKey = 't/6a54idkrru4aej31zp4u.3vu04ej/n';

    const user = await decryptToken(encryptedSession, sessionId, sessionKey)

    const severTimezone = +(timezone.split(":")[0]);
    const timezoneOffset = new Date().getTimezoneOffset();
    const offsetHours = -(Math.floor(timezoneOffset / 60));
    timeshift.value = offsetHours - severTimezone;
    dataForm.value = form;

    return { sessionId: tmpSessionId, user };
  }

  async function reloginUser() {
    const {
      sessionId, user
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: dataForm.value,
    });

    setUser({ sessionId, user });
    router.push({ path: '/target' })
  }

  async function logout() {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/logout`,
      method: 'post',
      headers: {
        sessionId: sessionId.value,
      }
    });
  }

  function setUser(data) {    
    ({ user: user.value, sessionId: sessionId.value } = data);
  }

  function startMaintainUser() {
    setInterval(async () => {
      await spiderman.apiService({
        url: `${spiderman.system.apiBaseUrl}/airaTracker/expiretime/extend`,
        method: 'get',
        headers: {
          sessionId: sessionId.value,
        },
      });

      console.log('Maintain SessionId');
    }, 60 * 1000);
  }

  const admin = ref(false);
  function setRole(list) {
    admin.value = (list.find((item) => item.id === user.value.groups[0])?.code || '') === '001';
  }

  const path = ref('');
  function setPath(val) {
    path.value = val;
  }

  const isAdding = ref(false);
  function startAddtoCase() {
    isAdding.value = true;
  }
  function finishAddtoCase() {
    isAdding.value = false;
  }

  async function resetLicensePassword(payload) {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/password/license`,
      method: 'post',
      data: payload,
    });
  }

  async function changePassword(payload) {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/password/change`,
      method: 'post',
      data: payload,
    });
  }

  return {
    sessionId,
    user,
    logout,
    loginUser,
    reloginUser,
    setUser,
    startMaintainUser,

    path,
    setPath,

    isAdding,
    startAddtoCase,
    finishAddtoCase,

    admin,
    setRole,

    resetLicensePassword,
    changePassword,

    timeshift
  };
});
