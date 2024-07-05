import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import useStore from './index';

function chineseToAscii(text) {
  let asciiText = '';
  for (let i = 0; i < text.length; i++) {
    asciiText += '&#' + text.charCodeAt(i) + ';';
  }
  return asciiText;
}

// =============================================
// POST
// =============================================
export async function addBookmark(timestamp, sid, cid, description) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/addBookmark`,
    method: 'post',
    headers: { 
      sessionId: userStore.sessionId,
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: {
      datatime: timestamp,
      camera_id: cid,
      caption: `${document.title.split(' ')[0]} Event`,
      description,
      duration: 10,
      server_id: sid
    },
  });
}

export async function getTaskListWithoutResult() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/gettasklistwithoutResult`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
  });
}

export async function getTask(taskId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/gettask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    params: {
      task_id: taskId
    },
  });
}

export async function startTask(taskId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/starttask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: { task_id: taskId },
  });
}

export async function removeTask(taskId) {
  const userStore = useUserStore();
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/removetask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: { task_id: taskId },
  });
}

export async function stopTask(taskId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/stoptask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: { task_id: taskId },
  });
}

export async function modifyTask(taskId, dataType) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/modifytask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: { 
      task_id: taskId,
      data_type: dataType
    },
  });
}

export async function addCase(data) {
  const userStore = useUserStore();
  const { selectedTask } = useStore();
  const temp = {
    caseName: data.name,
    description: data.description,
    byuser: userStore.user.username,
    timestamp: selectedTask.target.timestamp,
    savecasetimestamp: spiderman.dayjs().valueOf(),
    media_list_live: selectedTask.livechannels.map((item) => item.camera_id),
    media_list_arch: selectedTask.archchannels.map((item) => item.camera_id),
    search_end_time: selectedTask.search_end_time,
    search_start_time: selectedTask.search_start_time,
    target: {
      feature: selectedTask.feature,
      faceImage: selectedTask.target_face_image,
      camera_id: selectedTask.target.camera_id,
      cameraName: selectedTask.livechannels.find((item) => item.camera_id === selectedTask.target.camera_id)?.name || '',
      score: data.score,
      accompany: 0
    }
  };
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/cases`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: temp
  });
}

// =============================================
// PUT
// =============================================
export async function putCase(payload) {
  const userStore = useUserStore();
  const { caseId, data } = payload;
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/cases`,
    method: 'put',
    headers: { sessionId: userStore.sessionId },
    data: {
      caseId,
      facesData: data
    }
  });
}

// =============================================
// GET
// =============================================
export async function getTaskResultAll(taskId, score, idx = 0) {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/gettaskresultAll`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
    params: {
      task_id: taskId,
      score,
      idx,
      size: 50
    },
  });
  return result;
}

export async function getVideoUrl(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/media`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      format: 'mpegts',
      ...payload
    },
  });
}

export async function getSnapshotUrl(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/snapshot`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    },
  });
}

export async function getNonce(server) {
  return await spiderman.apiService({
    url: `${server}/api/getNonce`,
    method: 'get',
  });
}