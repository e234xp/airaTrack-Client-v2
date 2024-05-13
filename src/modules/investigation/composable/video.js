import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

export default () => {
  const userStore = useUserStore();
  const { sessionId } = storeToRefs(userStore);

  const videoResultIndex = ref(null);
  const videoResult = ref(null);
  const videoDuration = ref(null);
  const videoUrl = ref(null);

  let taskResults = null;

  const videoProgressBarInfo = ref(null);
  const videoProgressBarTimeSlot = ref(null);
  const videoTimeSlotsPersentage = ref(null);

  function setVideoResultIndex({ index, results, range = 1 * 60 * 60 * 1000 }) {
    videoResultIndex.value = index;
    videoResult.value = results[index];
    videoDuration.value = videoResult.value
      ? (videoResult.value.endtime - videoResult.value.starttime) / 1000
      : 0;
    videoUrl.value = getVideoUrl(videoResult.value);
    taskResults = results;

    setProgressBarInfo({ results, range });
    const page = Math.ceil(
      (videoResult.value.starttime
        - videoProgressBarInfo.value.minStartTime) / videoProgressBarInfo.value.range,
    );
    turnPage(page);

    const element = document.getElementById(`result-${index}`);
    if (!element) return;

    // element.scrollIntoView({
    //   behavior: 'smooth',
    //   block: 'start',
    // });
  }

  function getVideoUrl(result) {
    if (!result) return '';

    const {
      starttime: startTime, endtime: endTime,
      highest: { cid: cameraId },
    } = result;
    return `${spiderman.system.apiBaseUrl}/airaTracker/viewmedia?sessionId=${sessionId.value}&camera_id=${cameraId}&start_time=${startTime}&end_time=${endTime}&mediaType=webm`;
  }

  function getSnapshotUrl(result) {
    if (!result) return '';

    const {
      time,
      cameraId,
    } = result;
    return `${spiderman.system.apiBaseUrl}/airaTracker/viewsnapshot?sessionId=${sessionId.value}&camera_id=${cameraId}&time=${time}`;
  }

  function prevVideo() {
    if (videoResultIndex.value === 0) {
      setVideoResultIndex({ index: taskResults.length - 1, results: taskResults });
      return;
    }
    setVideoResultIndex({ index: videoResultIndex.value - 1, results: taskResults });
  }

  function nextVideo() {
    if (videoResultIndex.value === taskResults.length - 1) {
      setVideoResultIndex({ index: 0, results: taskResults });
      return;
    }
    setVideoResultIndex({ index: videoResultIndex.value + 1, results: taskResults });
  }

  function setProgressBarInfo({ results, range }) {
    videoProgressBarInfo.value = generateProgressBarInfo({ results, range });
  }

  function generateProgressBarInfo({ results, range }) {
    const minStartTime = range * Math.floor(results[0].starttime / range);

    const maxStartTime = range * Math.floor(results[results.length - 1].starttime / range);

    const totalPage = Math.ceil((maxStartTime - minStartTime) / range) + 1;

    return {
      minStartTime,
      maxStartTime,
      totalPage,
      range,
    };
  }

  function turnPage(page) {
    videoProgressBarTimeSlot.value = generateProgressBarTimeSlot({
      page,
      range: videoProgressBarInfo.value.range,
    });
    videoTimeSlotsPersentage.value = generateTimeSlotsPersentage({
      results: taskResults,
      barTimeSlot: videoProgressBarTimeSlot.value,
    });
  }

  function generateProgressBarTimeSlot({ page, range }) {
    const startTime = spiderman.dayjs(spiderman.dayjs(videoProgressBarInfo.value.minStartTime)
      .add((page - 1) * range, 'millisecond')
      .format('YYYY/MM/DD HH:mm:ss'))
      .valueOf();

    const endTime = spiderman.dayjs(spiderman.dayjs(startTime)
      .add(range, 'millisecond')
      .format('YYYY/MM/DD HH:mm:ss'))
      .valueOf();

    const currentPage = page;

    return { startTime, endTime, currentPage };
  }

  function generateTimeSlotsPersentage({ results, barTimeSlot }) {
    const { startTime: barStartTime, endTime: barEndTime } = barTimeSlot;

    const filteredTimeSlots = results
      .map(({ starttime, endtime, resultFrom }, index) => ({
        index,
        starttime,
        endtime,
        resultFrom,
      }))
      .filter((result) => {
        const { starttime: startTime, endtime: endTime } = result;

        // 只要區間有碰到 startTime, endTime 就要算進去
        if (endTime >= barStartTime && endTime <= barEndTime) {
          return true;
        }
        if (startTime >= barStartTime && startTime <= barEndTime) {
          return true;
        }

        return false;
      });

    const timeSlotsPersentage = filteredTimeSlots.map((result) => {
      const {
        index, starttime, endtime, resultFrom,
      } = result;

      const start = starttime > barStartTime
        ? Math.floor(
          ((starttime - barStartTime) / (barEndTime - barStartTime)) * 100,
        )
        : 0;
      const width = (() => {
        const tmpWidth = Math.ceil(
          ((endtime - starttime) / (barEndTime - barStartTime)) * 100,
        );

        // 如果會超過 100，要去做處理
        return start + tmpWidth > 100 ? 100 - start : tmpWidth;
      })();

      return {
        index,
        start,
        width,
        resultFrom,
      };
    });

    return timeSlotsPersentage;
  }

  return {
    videoResultIndex,
    videoResult,
    videoDuration,
    videoUrl,
    setVideoResultIndex,
    prevVideo,
    nextVideo,

    videoProgressBarInfo,
    videoProgressBarTimeSlot,
    videoTimeSlotsPersentage,
    setProgressBarInfo,
    turnPage,

    getSnapshotUrl,
    getVideoUrl
  };
};
