import spiderman from '@/spiderman';

async function getLiveFaces({
  startTime, endTime, page, perPage = 24, cameraList = [], sessionId,
}) {
  const data = {
    liveupdate: false,
    unifaceupdate: false,
    start_time: startTime,
    end_time: endTime,
    camera_list: cameraList,
    duration: endTime - startTime,
    slice_length: perPage,
    slice_shift: (page - 1) * perPage,
    withImage: true,
  };

  const {
    result: { total_length: totalLength, data: { 0: { value } } },
  } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/liveface`,
    method: 'post',
    headers: { sessionId },
    data,
  });

  return {
    totalItems: totalLength,
    data: value,
  };
}

export default { getLiveFaces };
