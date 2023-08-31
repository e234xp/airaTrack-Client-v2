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

function getCurrentKey() {
  const tenMinutesMs = 10 * 60 * 1000;
  return Math.floor(spiderman.dayjs().valueOf() / tenMinutesMs) * tenMinutesMs;
}

function getPerformAnimationFn(type) {
  const facesMergedNumberRecord = new Map();

  return (faces) => {
    const mappedFaces = faces
      .map(({
        data: {
          id,
          face_be_merged: faceBeMerged,
        },
      }) => ({ id, length: faceBeMerged.length }));

    const triggerFaces = (() => {
      const tmp = [];

      mappedFaces.forEach(({ id, length }) => {
        const lastLength = facesMergedNumberRecord.get(id);
        if (!lastLength) return;
        if (lastLength === length) return;

        tmp.push(id);
      });

      facesMergedNumberRecord.clear();

      mappedFaces.forEach(({ id, length }) => {
        facesMergedNumberRecord.set(id, length);
      });
      return tmp;
    })();

    triggerAnimation(triggerFaces);
  };

  function triggerAnimation(triggerFaces) {
    triggerFaces.forEach((id) => {
      const element = document.getElementById(`${type}-${id}`);
      if (!element) return;

      element.classList.remove('animate-color-transition');
      // eslint-disable-next-line no-void
      void element.offsetWidth;

      element.classList.add('animate-color-transition');
    });
  }
}

export default {
  getLiveFaces, getTotalPages, getCurrentKey, getPerformAnimationFn,
};
