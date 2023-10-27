<template>
  <div class="flex py-4">
    <div
      @click="handlePrevDate()"
      class="rounded-lg border border-panel-border bg-panel
        ml-6 mr-4 grid justify-center content-between text-white
              cursor-pointer hover:bg-primary-hover transition"
      style="width: 5.75rem"
    >
      <div class="invisible">
        dummy
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-left"
          class="w-6 h-6"
        />
      </div>
      <div
        class="mb-2 text"
      >
        {{ spiderman.dayjs(selectedDate).subtract(1,'day').format('DD, MMM') }}
      </div>
    </div>
    <div class="flex-grow rounded-lg bg-panel p-4 cursor-pointer">
      <div
        class="flex text-white gap-4"
      >
        <div class="flex items-center gap-2" style="width: 30%">
          <div>{{ $t('TimeTitle') }}</div>
          <AppSwitch :value="selectedTimeType" :list="timeTypeList" @select="onSelectTimeType"></AppSwitch>
          <AppDatePicker
            v-model:modelSelected="selectedDate"
            class="!w-2/3"
            :dark="true"
            v-if="selectedTimeType === 'custom'"
          />
        </div>
        <div class="flex items-center gap-2" style="width: 43%">
          <div>{{ $t('Camera') }}</div>
          <AppSwitch :value="selectedCameraType" :list="cameraTypeList" @select="onSelectCameraType"></AppSwitch>
          <BadgeList
            :list="cameraList"
            :selected="selectedCamera"
            @update:unSelectCamera="onUnSelect"
            v-if="selectedCameraType === 'select'"
          >
            <CameraList :list="cameraList" :selected="selectedCamera" 
              @update:unSelectCamera="onUnSelect" @update:selectCamera="onSelect"></CameraList>
          </BadgeList>
        </div>
      </div>
      <AppDivider class="my-2" />

      <canvas
        id="chart"
        height="30"
      />
      <div
        class="flex justify-center text-primary text-xl"
      >
        {{ spiderman.dayjs(selectedDate).format('DD, MMMM') }}
      </div>
    </div>
    <div
      @click="handleNextDate()"
      class="rounded-lg border border-panel-border bg-panel
        mr-6 ml-4 grid justify-center content-between text-white
              cursor-pointer hover:bg-primary-hover transition"
      style="width: 5.75rem"
    >
      <div class="invisible">
        dummy
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-right"
          class="w-6 h-6"
        />
      </div>
      <div
        class="mb-2"
      >
        {{ spiderman.dayjs(selectedDate).add(1,'day').format('DD, MMM') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted, computed, watch, onUnmounted, ref
} from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

import spiderman from '@/spiderman';
import errorStore from '@/components/AppError/error';

import useDevices from '@/stores/devices';
import useStore from '@/modules/target/stores/index';

import BadgeList from './BadgeList.vue';
import CameraList from './CameraList.vue';

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

const store = useStore();
const { getLiveFaceHourlyCount, setSelectedCamera } = store;
const { selectedCamera } = storeToRefs(store);

const i18n = useI18n();

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
  set: (value) => {
    if (spiderman.dayjs().isBefore(value, 'date')) {
      errorStore.show({ error: new Error('PleaseSelectBeforePresent') });
      return;
    }
    emit('update:modelSelectedDate', spiderman.dayjs(value).format('YYYY-MM-DD'))
  }
});
const selectedHour = computed({
  get: () => props.modelSelectedHour,
  set: (value) => emit('update:modelSelectedHour', value),
});

const selectedTimeType = ref('now');
const timeTypeList = ref([
  {
    value: 'now',
    text: i18n.t('Today')
  }, {
    value: 'custom',
    icon: 'icon-calendar'
  }
]);
function onSelectTimeType(val) {
  selectedTimeType.value = val;
  if (val === 'now') {
    emit('update:modelSelectedDate', spiderman.dayjs().format('YYYY-MM-DD'))
  }
}

const selectedCameraType = ref('all');
const cameraTypeList = ref([
  {
    value: 'all',
    text: i18n.t('All')
  }, {
    value: 'select',
    icon: 'icon-camera'
  }
]);
function onSelectCameraType(val) {
  selectedCameraType.value = val;
  if (val === 'all') {
    setSelectedCamera(livedevices.value.map(({ camera_id: cameraId }) => cameraId));
  }
}

const cameraList = computed({
  get: () => {
    return livedevices.value.map(({ camera_id: cameraId, name }) => ({ id: cameraId, name }));
  }
})

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

function onUnSelect(id) {
  const temp = selectedCamera.value.map((id) => id);
  const idx = temp.indexOf(id);
  if (idx >= 0) temp.splice(idx, 1);
  setSelectedCamera(temp);
}

function onSelect(id) {
  const temp = selectedCamera.value.map((id) => id);
  const idx = temp.indexOf(id);
  if (idx < 0) temp.push(id);
  setSelectedCamera(temp);
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
          backgroundColor: 'rgba(67, 160, 209, 0.4)'
        },
      ],
    },
    options: {
      layout: {
        padding: {
          bottom: 2
        }
      },
      scales: {
        y: {
          min: 0,
          ticks: { display: false },
          grid: {
            color(context) {
              if (context.tick.value === 0) {
                return '#839195';
              }
              return 'rgba(0, 0, 0, 0)';
            },
          },
        },
        x: {
          ticks: {
            color(context) {
              if (context.tick.value === selectedHour.value) {
                return '#3cb2fe';
              }
              return '#839195';
            },
            font: {
              size: 16,
              family: 'Helvetica',
            },
          },
          grid: {
            display: false,
          },
        },
      },
      transitions: {
        show: {
          animations: {
            x: {
              from: 0
            },
            y: {
              from: 0
            }
          }
        },
        hide: {
          animations: {
            x: {
              from: 0
            },
            y: {
              from: 0
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              return `${context[0].label}:00`;
            }
          }
        },
        legend: {
          display: false,
        },
        annotation: {
          clip: false,
          annotations: {
            box: {
              type: 'box',
              xMin: selectedHour.value - 0.45,
              xMax: selectedHour.value + 0.45,
              yMin: 0,
              yMax: 25,
              backgroundColor: 'rgba(255, 99, 132, 0)',
              borderWidth: 4,
              borderColor: 'white',
              borderRadius: 4,
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

watch(selectedCamera, () => renderByDate(selectedDate.value));

onUnmounted(() => {
  clearInterval(renderInterval);
});

async function renderByDate(date) {
  // const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);
  const today = spiderman.dayjs().format('YYYY-MM-DD');
  const start = spiderman.dayjs(`${date} 00:00:00`).unix();
  const end = today === date ? spiderman.dayjs().unix() : spiderman.dayjs(`${date} 23:59:59`).unix();
  const dataOfDate = await getLiveFaceHourlyCount(start, end, selectedCamera.value);
  const maxOfData = Math.max(...dataOfDate);

  // 設定 data
  chart.data.datasets[0].data = dataOfDate;

  // 設定 最大高度
  const maxY = (() => {
    if (maxOfData < 20) return 20;
    const tmp = Math.floor(maxOfData * 1.1);

    return tmp;
  })();
  chart.options.scales.y.max = maxY;

  // 設定 box 最大高度, 讓 box 回到 index = 0
  const maxAnnotationY = (() => chart.options.scales.y.max - 0.5)();
  chart.options.plugins.annotation.annotations.box.yMax = maxAnnotationY;
  // chart.options.plugins.annotation.annotations.box1.yMax = maxAnnotationY;

  updateBarColor();

  chart.update();
}

function renderHourAnnotation(hour) {
  chart.options.plugins.annotation.annotations.box.xMin = hour - 0.45;
  chart.options.plugins.annotation.annotations.box.xMax = hour + 0.45;

  // chart.options.plugins.annotation.annotations.box1.xMin = hour - 0.45;
  // chart.options.plugins.annotation.annotations.box1.xMax = hour + 0.45;

  updateBarColor(hour);

  chart.update();
}

function updateBarColor(hour = selectedHour.value) {
  const temp = new Array(24).fill('rgba(67, 160, 209, 0.5)');
  temp[hour] = 'rgba(67, 160, 209, 1)';
  chart.data.datasets[0].backgroundColor = temp;
}

</script>
