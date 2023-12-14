import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import useAlbums from '@/stores/albums';

const sizeMap = [
  { range: [1.3, 2.3], row: 2, col: 12 },
  { range: [2.3, 3.5], row: 2, col: 18 },
  { range: [3.5, 10], row: 2, col: 24 },
  { range: [0.43, 0.57], row: 4, col: 6 },
  { range: [0.29, 0.43], row: 5, col: 6 },
  { range: [0.1, 0.29], row: 6, col: 6 },
  { range: [0, 999], row: 2, col: 12 },
]
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
  const albumsStore = useAlbums();
  const { albums } = storeToRefs(albumsStore);

  return (faces) => {
    const mappedFaces = faces
      .filter((item) => item.data.id !== '')
      .map(({
        data: {
          id,
          face_be_merged: faceBeMerged,
          highest
        },
        highest: {
          albumId
        }
      }) => ({ id, length: faceBeMerged.length, aIdx: albums.value.findIndex((item) => item.albumId === albumId) }));

    const triggerFaces = (() => {
      const tmp = [];

      mappedFaces.forEach(({ id, length, aIdx }) => {
        const lastLength = facesMergedNumberRecord.get(id);
        if (!lastLength) return;
        if (lastLength === length) return;

        tmp.push({id, aIdx});
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
    triggerFaces.forEach(({id, aIdx}) => {
      const element = document.getElementById(`${type}-${id}`);
      if (!element) return;

      element.classList.remove('animate-pulse-transition');
      element.classList.remove(`album-${aIdx < 0 ? 'none' : aIdx}`);
      // eslint-disable-next-line no-void
      void element.offsetWidth;

      element.classList.add('animate-pulse-transition');
      element.classList.add(`album-${aIdx < 0 ? 'none' : aIdx + 1}`);
    });
  }
}

export default {
  getLiveFaces, getTotalPages, getCurrentKey, getPerformAnimationFn, sizeMap
};
