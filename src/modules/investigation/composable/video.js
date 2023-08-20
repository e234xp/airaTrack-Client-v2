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

  function setVideoResultIndex({ index, results }) {
    videoResultIndex.value = index;
    videoResult.value = results[index];
    videoDuration.value = (videoResult.value.endtime - videoResult.value.starttime) / 1000;
    videoUrl.value = getVideoUrl(videoResult.value);

    const startTime = spiderman.dayjs(spiderman.dayjs(videoResult.value.starttime)
      .format('YYYY/MM/DD HH:00:00'))
      .valueOf();
    setProgressBar({ startTime, results });
  }

  function getVideoUrl(result) {
    if (!result) return '';

    const {
      starttime: startTime, endtime: endTime,
      highest: { cid: cameraId },
    } = result;
    return `${spiderman.system.apiBaseUrl}/airaTracker/viewmedia?sessionId=${sessionId.value}&camera_id=${cameraId}&start_time=${startTime}&end_time=${endTime}`;
  }

  function prevVideo(results) {
    if (videoResultIndex.value === 0) {
      setVideoResultIndex({ index: results.length - 1, results });
      return;
    }
    setVideoResultIndex({ index: videoResultIndex.value - 1, results });
  }

  function nextVideo(results) {
    if (videoResultIndex.value === results.length - 1) {
      setVideoResultIndex({ index: 0, results });
      return;
    }
    setVideoResultIndex({ index: videoResultIndex.value + 1, results });
  }

  const videoProgressBarInfo = ref(null);
  const videoProgressBarTimeSlot = ref(null);
  const videoTimeSlotsPersentage = ref(null);
  function setProgressBar({ startTime, results }) {
    videoProgressBarInfo.value = generateProgressBarInfo(results);
    videoProgressBarTimeSlot.value = generateProgressBarTimeSlot(startTime);
    videoTimeSlotsPersentage.value = generateTimeSlotsPersentage({
      results,
      barTimeSlot: videoProgressBarTimeSlot.value,
    });
  }

  function generateProgressBarInfo(results) {
    const minStartTime = spiderman.dayjs(spiderman.dayjs(results[0].starttime)
      .format('YYYY/MM/DD HH:00:00'))
      .valueOf();

    const maxStartTime = spiderman.dayjs(spiderman.dayjs(results[results.length - 1].starttime)
      .format('YYYY/MM/DD HH:00:00'))
      .valueOf();

    return {
      minStartTime,
      maxStartTime,
    };
  }

  function generateProgressBarTimeSlot(startTime) {
    const endTime = spiderman.dayjs(spiderman.dayjs(startTime)
      .add(1, 'hour')
      .format('YYYY/MM/DD HH:00:00'))
      .valueOf();

    return { startTime, endTime };
  }

  function generateTimeSlotsPersentage({ results, barTimeSlot }) {
    const { startTime: barStartTime, endTime: barEndTime } = barTimeSlot;

    const filteredTimeSlots = results
      .map(({ starttime, endtime }, index) => ({
        index,
        starttime,
        endtime,
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
      const { index, starttime, endtime } = result;

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
    setProgressBar,
  };
};
