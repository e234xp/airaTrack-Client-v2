import spiderman from '@/spiderman';

async function getLiveFaces({
  startTime, endTime, page, perPage = 24, cameraList = [], sessionId,
}) {
  const data = {
    start_time: startTime,
    end_time: endTime,
    camera_list: cameraList,
    duration: endTime - startTime,
    slice_length: perPage,
    slice_shift: (page - 1) * perPage,
  };

  const {
    result: { total_length: totalLength, data: { 0: { value } } },
  } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livefaceunion`,
    method: 'post',
    headers: { sessionId },
    data,
  });

  return {
    totalItems: totalLength,
    data: value,
  };
}

function getTotalPages({ totalItems, numberPerPage }) {
  return Math.ceil(totalItems / numberPerPage);
}

export default { getLiveFaces, getTotalPages };
