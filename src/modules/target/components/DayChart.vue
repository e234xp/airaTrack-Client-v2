<template>
  <div class="flex py-6">
    <div
      @click="handlePrevDate()"
      class="w-28 rounded-lg border-2 border-gray-500 bg-secondary
        mx-3 grid justify-center content-between text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div class="invisible">
        dummy
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-left"
          class="w-8 h-8"
        />
      </div>
      <div
        class="my-2 text-xl"
      >
        {{ spiderman.dayjs(selectedDate).subtract(1,'day').format('DD, MMM') }}
      </div>
    </div>
    <div class="flex-grow cursor-pointer">
      <canvas
        id="chart"
        height="37"
      />
    </div>
    <div
      @click="
        handleNextDate()
      "
      class="w-28 rounded-lg border-2 border-gray-500 bg-secondary
        mx-3 grid justify-center content-between text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div class="invisible">
        dummy
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-right"
          class="w-8 h-8"
        />
      </div>
      <div
        class="my-2 text-xl"
      >
        {{ spiderman.dayjs(selectedDate).add(1,'day').format('DD, MMM') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted, computed, watch, onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import errorStore from '@/stores/error';

import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

// selectedDate 與外部做連接
const props = defineProps({
  modelSelectedDate: {
    type: String,
    default: '',
  },
  modelSelectedHour: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits([
  'update:modelSelectedDate',
  'update:modelSelectedHour',
]);

const selectedDate = computed({
  get: () => props.modelSelectedDate,
  set: (value) => emit('update:modelSelectedDate', spiderman.dayjs(value).format('YYYY-MM-DD')),
});
const selectedHour = computed({
  get: () => props.modelSelectedHour,
  set: (value) => emit('update:modelSelectedHour', value),
});

function setDate(date) {
  selectedDate.value = spiderman.dayjs(date).format('YYYY-MM-DD');
}
function setHour(hour) {
  selectedHour.value = hour;
}

function handlePrevDate() {
  setDate(spiderman.dayjs(selectedDate.value).subtract(1, 'day'));
}
function handleNextDate() {
  const now = spiderman.dayjs();

  if (now.isSame(selectedDate.value, 'date')) {
    errorStore.show({ error: new Error('PleaseSelectBeforePresent') });
    return;
  }

  setDate(spiderman.dayjs(selectedDate.value).add(1, 'day'));
}

// 以下處理 chart
Chart.register(annotationPlugin);

let chart;
let renderInterval;
onMounted(() => {
  const ctx = document.getElementById('chart');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(Array(24).keys()),
      datasets: [
        {
          label: '# of Faces',
          data: [],
          backgroundColor: 'rgba(134,150,158,255)',
        },
      ],
    },
    options: {
      scales: {
        y: {
          display: false,
          beginAtZero: true,
          min: 0,
        },
        x: {
          ticks: {
            color: '#eee',
            font: {
              size: 16,
              family: 'Sans-serif',
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        annotation: {
          annotations: {
            box: {
              type: 'box',
              xMin: selectedHour.value - 0.45,
              xMax: selectedHour.value + 0.45,
              yMin: -1,
              yMax: 24,
              backgroundColor: 'rgba(255, 99, 132, 0)',
              borderWidth: 8,
              borderColor: 'rgba(60,178,254,255)',
            },

          },
        },
      },
      onClick: (event) => {
        const res = chart.getElementsAtEventForMode(event, 'index', { intersect: false }, true);

        if (res.length === 0) {
          return;
        }

        const { index } = res[0];
        const hour = chart.data.labels[index];

        // 判斷是否是按下未來的時間
        const isFuture = (() => {
          const now = spiderman.dayjs();
          const tmpIsFuture = now.isSame(selectedDate.value, 'date') && now.hour() < hour;

          return tmpIsFuture;
        })();
        if (isFuture) {
          errorStore.show({ error: new Error('PleaseSelectBeforePresent') });
          return;
        }

        setHour(hour);
        renderHourAnnotation(hour);
      },
    },
  });

  renderByDate(selectedDate.value);
  renderInterval = setInterval(
    () => {
      renderByDate(selectedDate.value);
    },
    10 * 1000,
  );
});

watch(selectedDate, (date) => {
  renderByDate(date);
  const now = spiderman.dayjs();

  if (now.isAfter(selectedDate.value, 'date')) return;
  if (now.hour() >= selectedHour.value) return;
  setHour(now.hour());
  renderHourAnnotation(now.hour());
});

onUnmounted(() => {
  clearInterval(renderInterval);
});

async function renderByDate(date) {
  const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);
  // todo 改為真實串接
  const { data: dataOfDate } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livefacehourlycount`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data: {
      report_date: date,
      camera_list: cameraList,
    },
  });

  const maxOfData = Math.max(...dataOfDate);

  // 設定 data
  chart.data.datasets[0].data = dataOfDate;

  // 設定 最大高度
  chart.options.scales.y.max = Math.floor(maxOfData * 1.1);

  // 設定 box 最大高度, 讓 box 回到 index = 0
  chart.options.plugins.annotation.annotations.box.yMax = chart.options.scales.y.max - 1;

  chart.update();
}

function renderHourAnnotation(hour) {
  chart.options.plugins.annotation.annotations.box.xMin = hour - 0.45;
  chart.options.plugins.annotation.annotations.box.xMax = hour + 0.45;

  chart.update();
}

</script>
