<template>
  <div class="flex py-4 w-full" ref="chartContainer">
    <div
      @click="handlePrevDate()"
      class="rounded-lg border border-white/80
        ml-4 mr-4 grid justify-center content-between text-white
              cursor-pointer bg-ctrl-secondary-lg hover:bg-ctrl-secondary-lg-hover"
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
      <div class="mb-4 text-center select-none">
        {{ spiderman.formatDate.parseMD(spiderman.dayjs(selectedDate).subtract(1,'day')) }}
      </div>
    </div>
    <div class="rounded-lg border border-white/40 bg-black/20 p-4 cursor-pointer" style="width: calc(100% - 15.5rem)">
      <div class="flex text-white gap-4 h-10">
        <div class="flex items-center gap-2">
          <div class="select-none w-16 text-right">{{ $t('TimeTitle') }}</div>
          <AppSwitch :value="selectedTimeType" :list="timeTypeList" @select="onSelectTimeType"></AppSwitch>
          <AppDatePicker
            v-model:modelSelected="selectedDate"
            :dark="true"
            :style="{ opacity: selectedTimeType === 'custom' ? 1 : 0, width: '9.5rem !important' }"
          />
        </div>
        <div class="flex items-center gap-2 mx-auto">
          <div class="select-none w-16 text-right">{{ $t('Camera') }}</div>
          <AppSwitch :value="selectedCameraType" :list="cameraTypeList" @select="onSelectCameraType"></AppSwitch>
          <div class="bg-ctrl-secondary w-5 h-5 p-0.5 rounded-md hover:bg-ctrl-secondary-hover" 
            @click="handleOpenCameraFilter"
            :style="{ opacity: selectedCameraType === 'select' ? 1 : 0 }">
            <AppSvgIcon name="icon-chevron-botton" class="text-white w-4 h-4"/>
          </div>
        </div>
        <div class="flex items-center gap-2 ml-auto">
          <div class="select-none w-16 text-right">{{ $t('Album') }}</div>
          <AppSwitch :value="selectedAlbumType" :list="albumTypeList" @select="onSelectAlbumType"></AppSwitch>
          <div class="bg-ctrl-secondary w-5 h-5 p-0.5 rounded-md hover:bg-ctrl-secondary-hover" 
            @click="handleOpenAlbumFilter"
            :style="{ opacity: selectedAlbumType === 'select' ? 1 : 0 }">
            <AppSvgIcon name="icon-chevron-botton" class="text-white w-4 h-4"/>
          </div>
        </div>
      </div>
      <AppDivider class="my-2" />

      <div class="w-full mx-auto" style="height: 8.25rem;">
        <canvas id="chart" />
      </div>
      <div class="flex justify-center text-primary text-xl">
        {{ spiderman.formatDate.parseMD(selectedDate) }}
      </div>
    </div>
    <div
      @click="handleNextDate()"
      class="rounded-lg border border-white/80
        mr-4 ml-4 grid justify-center content-between text-white
              cursor-pointer transition bg-ctrl-secondary-lg hover:bg-ctrl-secondary-lg-hover"
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
      <div class="mb-4 text-center select-none">
        {{ spiderman.formatDate.parseMD(spiderman.dayjs(selectedDate).add(1,'day')) }}
      </div>
    </div>
  </div>

  <ModalAlbumFilter :list="albumsList" :selected="selectedAlbum" @filter="handleAlbumFilter"></ModalAlbumFilter>
  <ModalCameraFilter :list="cameraList" :selected="selectedCamera" @filter="handleCameraFilter"></ModalCameraFilter>
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
import useAlbums from '@/stores/albums';
import useStore from '@/modules/target/stores/index';

import BadgeList from './BadgeList.vue';
import CameraList from './CameraList.vue';
import ModalAlbumFilter from './ModalAlbumFilter.vue';
import ModalCameraFilter from './ModalCameraFilter.vue';

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

const albumsStore = useAlbums();
const { albums, albumColorMap } = storeToRefs(albumsStore);

const store = useStore();
const { getLiveFaceHourlyCount, setSelectedCamera, setSelectedAlbum, setModal } = store;
const { selectedCamera, selectedAlbum } = storeToRefs(store);

const i18n = useI18n();

const chartContainer = ref(null);

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
  modelSelectedTimeType: {
    type: String,
    default: '',
  },
  modelSelectedCameraType: {
    type: String,
    default: '',
  },
  modelSelectedAlbumType: {
    type: String,
    default: '',
  }
});
const emit = defineEmits([
  'update:modelSelectedDate',
  'update:modelSelectedHour',
  'update:modelSelectedTimeType',
  'update:modelSelectedCameraType',
  'update:modelSelectedAlbumType',
  'updateData'
]);

const selectedDate = computed({
  get: () => props.modelSelectedDate,
  set: (value) => {
    if (spiderman.dayjs().isBefore(value, 'date')) {
      errorStore.show({ error: new Error(i18n.t('PleaseSelectBeforePresent')) });
      return;
    }
    if (spiderman.dayjs(value).format('YYYY-MM-DD') !== spiderman.dayjs().format('YYYY-MM-DD')) selectedTimeType.value = 'custom';
    emit('update:modelSelectedDate', spiderman.dayjs(value).format('YYYY-MM-DD'));
    emit('updateData');
  }
});
const selectedHour = computed({
  get: () => props.modelSelectedHour,
  set: (value) => {
    if (value !== parseInt(spiderman.dayjs().format('HH'), 10)) selectedTimeType.value = 'custom';
    emit('update:modelSelectedHour', value);
    emit('updateData');
  }
});

//------------------------------------------
// time filter
//------------------------------------------
const selectedTimeType = computed({
  get: () => props.modelSelectedTimeType,
  set: (value) => {
    emit('update:modelSelectedTimeType', value);
    if (value === 'now') setCurrent();
  }
});
const timeTypeList = ref([
  {
    value: 'now',
    text: i18n.t('Now')
  }, {
    value: 'custom',
    icon: 'icon-calendar'
  }
]);
function onSelectTimeType(val) {
  selectedTimeType.value = val;
}

//------------------------------------------
// camera filter
//------------------------------------------
const selectedCameraType = computed({
  get: () => props.modelSelectedCameraType,
  set: (value) => {
    emit('update:modelSelectedCameraType', value);
  }
});
const cameraTypeList = ref([
  {
    value: 'all',
    text: i18n.t('All')
  }, {
    value: 'select',
    icon: 'icon-camera'
  }
]);

const cameraList = computed({
  get: () => {
    return livedevices.value.map(({ camera_id: cameraId, name }) => ({ id: cameraId, name }));
  }
})

function onSelectCameraType(val) {
  if (val === selectedCameraType.value) return;
  selectedCameraType.value = val;
  if (val === 'select' && selectedCamera.value.length === cameraList.value.length) setModal('camera-filter');
}

function handleOpenCameraFilter() {
  setModal('camera-filter');
}

function handleCameraFilter(list) {
  setSelectedCamera(list);
}

//------------------------------------------
// album filter
//------------------------------------------
const selectedAlbumType = computed({
  get: () => props.modelSelectedAlbumType,
  set: (value) => {
    emit('update:modelSelectedAlbumType', value);
  }
});
const albumTypeList = ref([
  {
    value: 'all',
    text: i18n.t('All')
  }, {
    value: 'select',
    icon: 'icon-note'
  }
]);

const albumsList = computed({
  get: () => {
    return [
      { id: '0', name: 'Unclassified' },
      ...albums.value.map(({ albumId, albumName }) => ({ id: albumId, name: albumName }))
    ];
  }
})

function onSelectAlbumType(val) {
  if (val === selectedAlbumType.value) return;
  selectedAlbumType.value = val;
  if (val === 'select' && selectedAlbum.value.length === albumsList.value.length) setModal('album-filter');
}

function handleOpenAlbumFilter() {
  setModal('album-filter');
}

function handleAlbumFilter(list) {
  setSelectedAlbum(list);
}

//------------------------------------------
// Pre/Next
//------------------------------------------
function handlePrevDate() {
  setDate(spiderman.dayjs(selectedDate.value).subtract(1, 'day'));
}

function handleNextDate() {
  const now = spiderman.dayjs();

  if (now.isSame(selectedDate.value, 'date')) {
    errorStore.show({ error: new Error(i18n.t('PleaseSelectBeforePresent')) });
    return;
  }

  setDate(spiderman.dayjs(selectedDate.value).add(1, 'day'));
}

function setDate(date) {
  selectedDate.value = spiderman.dayjs(date).format('YYYY-MM-DD');
}

function setCurrent() {
  emit('update:modelSelectedDate', spiderman.dayjs().format('YYYY-MM-DD'));
  emit('update:modelSelectedHour', parseInt(spiderman.dayjs().format('HH'), 10));
  emit('updateData');
}

function setHour(hour) {
  selectedHour.value = hour;
  selectedTimeType.value = 'custom';
}

watch(selectedDate, (date) => {
  renderByDate(date);
  const now = spiderman.dayjs();

  if (now.isAfter(selectedDate.value, 'date')) return;
  if (now.hour() >= selectedHour.value) return;
  setHour(now.hour());
  renderHourAnnotation(now.hour());
});

watch([selectedCamera, selectedAlbum, selectedCameraType, selectedAlbumType], () => renderByDate(selectedDate.value));

watch(selectedHour, () => renderHourAnnotation(selectedHour.value));

// 以下處理 chart
Chart.register(annotationPlugin);

const sumData = ref([]);

let chart;
let renderInterval;
onMounted(() => {
  const ctx = document.getElementById('chart');
  const unSelectAlbum = ['#9C5655', '#A08557', '#62925F', '#6766AC', '#9664A5'];

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(Array(24).keys()),
      datasets: Array.from(Array(6).keys()).map((idx) => ({
        label: idx == 0 ? '# of Faces' : `# of ${albumsList.value[idx].name}`,
        data: [],
        backgroundColor: (context) => {
          if (context.dataIndex === selectedHour.value) {
            if (idx === 0) {
              const { ctx, chartArea: { bottom, top } } = context.chart;
              const gradientBg = ctx.createLinearGradient(0, context.parsed.y, 0, bottom);
              gradientBg.addColorStop(0, '#43A0D1');
              gradientBg.addColorStop(1, '#9CDDFF');
              return gradientBg;
            }
            return albumColorMap.value.get(idx - 1);
          }
          return idx === 0 ? '#027CBC' : unSelectAlbum[idx - 1];
        }
      }))
    },
    options: {
      maintainAspectRatio: false,
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
          stacked: true
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
              size(context) {
                const width = context.chart.width;
                const height = context.chart.height;
                if (height < 140) return 16;
                if (height < 170) return 25;
                if (height < 200) return 30;
                if (width > 5000) return 70;
                if (width > 2500) return 33;
                return 16;
              },
              family: 'Helvetica',
            },
          },
          grid: {
            display: false,
          },
          stacked: true
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
              to: 0
            },
            y: {
              to: 0
            }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (context) {
              return `${context[0].label}:00`;
            },
            footer: function(context) {
              return ((context[0].raw / sumData.value[context[0].dataIndex]) * 100).toFixed(0)
              + `% / Total: ${sumData.value[context[0].dataIndex]}`;
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
          errorStore.show({ error: new Error(i18n.t('PleaseSelectBeforePresent')) });
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
      if (spiderman.dayjs(selectedDate.value).format('YYYYMMDD') !== spiderman.dayjs().format('YYYYMMDD')) return;
      if (selectedTimeType.value === 'now' 
        && spiderman.dayjs().format('YYYY-MM-DD H') !== `${selectedDate.value} ${selectedHour.value}`) {
        setCurrent();
        renderByDate(spiderman.dayjs().format('YYYY-MM-DD'));
      } else {
        renderByDate(selectedDate.value);  
      }
    },
    10 * 1000,
  );
});

onUnmounted(() => {
  clearInterval(renderInterval);
});

async function appendMockData(data) {
  const base = {
    '0': 10,
    '1': 2,
    '2': 1,
    '3': 3,
    '4': 1,
    '5': 0,
  };
  const hour = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  hour.forEach((hour) => {
    const temp = JSON.parse(JSON.stringify(base));
    const adj = (hour > 12 ? 24 - hour : hour) + (Math.random() * (hour / 3));
    temp['0'] = Math.floor(base['0'] * adj);
    temp['1'] = Math.floor(base['1'] * adj);
    temp['2'] = Math.floor(base['2'] * adj);
    temp['3'] = Math.floor(base['3'] * adj);
    temp['4'] = Math.floor(base['4'] * adj);
    temp['5'] = Math.floor(base['5'] * adj);
    data[hour] = temp;
  })
}

async function renderByDate(date) {
  const today = spiderman.dayjs().format('YYYY-MM-DD');
  const start = spiderman.dayjs(`${date} 00:00:00`).unix();
  const end = today === date ? spiderman.dayjs().unix() : spiderman.dayjs(`${date} 23:59:59`).unix();
  const cList = selectedCameraType.value === 'all' ? livedevices.value.map(({ camera_id: cameraId }) => cameraId) : selectedCamera.value;
  const tempData = await getLiveFaceHourlyCount(start, end, cList);
  // appendMockData(tempData);
  const template = [0, 1, 2, 3, 4, 5];
  const dataOfDate = template.map((idx) => {
    const aId = albumsList.value[idx].id;
    if (selectedAlbumType.value === 'all' || selectedAlbum.value.indexOf(aId) >= 0) return tempData.map((list) => list[idx]);
    return new Array(24).fill(0);
  })
  sumData.value = new Array(24).fill(1).map((_, idx) => {
    return dataOfDate.reduce((temp, cur) => temp += cur[idx], 0);
  })
  const maxOfData = Math.max(...sumData.value);

  // 設定 data
  template.forEach((idx) => {
    chart.data.datasets[idx].data = dataOfDate[idx];
  })

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

  // updateBarColor();

  chart.update();
}

function renderHourAnnotation(hour) {
  chart.options.plugins.annotation.annotations.box.xMin = hour - 0.45;
  chart.options.plugins.annotation.annotations.box.xMax = hour + 0.45;

  // chart.options.plugins.annotation.annotations.box1.xMin = hour - 0.45;
  // chart.options.plugins.annotation.annotations.box1.xMax = hour + 0.45;

  // updateBarColor(hour);

  chart.update();
}

function updateBarColor(hour = selectedHour.value) {
  const temp = new Array(24).fill('rgba(67, 160, 209, 0.5)');
  temp[hour] = 'rgba(67, 160, 209, 1)';
  chart.data.datasets[0].backgroundColor = temp;
}

</script>
