<template>
  <div class="flex py-4" ref="chartContainer">
    <div
      @click="handlePrevDate()"
      class="rounded-lg border border-white/40 bg-black/20
        ml-4 mr-4 grid justify-center content-between text-white
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
        class="mb-4 text-center select-none"
      >
        {{ spiderman.formatDate.parse(spiderman.dayjs(selectedDate).subtract(1,'day'), { month: 'numeric', day: 'numeric' }) }}
      </div>
    </div>
    <div class="flex-grow rounded-lg border border-white/40 bg-black/20 p-4 cursor-pointer">
      <div class="flex justify-between text-white gap-4 h-10">
        <div class="flex items-center gap-2" style="width: 30%">
          <div class="select-none">{{ $t('TimeTitle') }}</div>
          <AppSwitch :value="selectedTimeType" :list="timeTypeList" @select="onSelectTimeType"></AppSwitch>
          <AppDatePicker
            v-model:modelSelected="selectedDate"
            class="!w-2/3"
            :dark="true"
            v-if="selectedTimeType === 'custom'"
          />
        </div>
        <div class="flex items-center gap-2" style="width: 30%">
          <div class="select-none">{{ $t('Camera') }}</div>
          <AppSwitch :value="selectedCameraType" :list="cameraTypeList" @select="onSelectCameraType"></AppSwitch>
          <BadgeList
            :list="cameraList"
            :limit="0"
            :selected="selectedCamera"
            @update:unSelectCamera="onUnSelect"
            v-if="selectedCameraType === 'select'"
          >
            <CameraList :list="cameraList" :selected="selectedCamera" 
              @update:unSelectCamera="onUnSelect" @update:selectCamera="onSelect"></CameraList>
          </BadgeList>
        </div>
        <div class="flex items-center gap-2" style="width: 30%">
          <div class="select-none">{{ $t('Album') }}</div>
          <AppSwitch :value="selectedAlbumType" :list="albumTypeList" @select="onSelectAlbumType"></AppSwitch>
          <BadgeList
            :list="albumsList"
            :limit="0"
            :selected="selectedAlbum"
            @update:unSelectCamera="onUnSelectAlbum"
            v-if="selectedAlbumType === 'select'"
          >
            <CameraList :list="albumsList" :selected="selectedAlbum" :limit="false"
              @update:unSelectCamera="onUnSelectAlbum" @update:selectCamera="onSelectAlbum"></CameraList>
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
        {{ spiderman.formatDate.parseStr(selectedDate, { month: 'numeric', day: 'numeric' }) }}
      </div>
    </div>
    <div
      @click="handleNextDate()"
      class="rounded-lg border border-white/40 bg-black/20
        mr-4 ml-4 grid justify-center content-between text-white
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
        class="mb-4 text-center select-none"
      >
        {{ spiderman.formatDate.parse(spiderman.dayjs(selectedDate).add(1,'day'), { month: 'numeric', day: 'numeric' }) }}
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
import useAlbums from '@/stores/albums';
import useStore from '@/modules/target/stores/index';

import BadgeList from './BadgeList.vue';
import CameraList from './CameraList.vue';

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

const albumsStore = useAlbums();
const { albums, albumColorMap } = storeToRefs(albumsStore);

const store = useStore();
const { getLiveFaceHourlyCount, setSelectedCamera, setSelectedAlbum } = store;
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
});
const emit = defineEmits([
  'update:modelSelectedDate',
  'update:modelSelectedHour',
  'update:modelSelectedTimeType',
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

const cameraList = computed({
  get: () => {
    return livedevices.value.map(({ camera_id: cameraId, name }) => ({ id: cameraId, name }));
  }
})

function onSelectCameraType(val) {
  selectedCameraType.value = val;
  if (val === 'all') {
    setSelectedCamera(livedevices.value.map(({ camera_id: cameraId }) => cameraId));
  }
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

//------------------------------------------
// album filter
//------------------------------------------
const selectedAlbumType = ref('all');
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
    return albums.value.map(({ albumId, albumName }) => ({ id: albumId, name: albumName }));
  }
})

function onSelectAlbumType(val) {
  selectedAlbumType.value = val;
  if (val === 'all') {
    setSelectedAlbum(albums.value.map(({ albumId }) => albumId));
  }
}

function onUnSelectAlbum(id) {
  const temp = selectedAlbum.value.map((id) => id);
  const idx = temp.indexOf(id);
  if (idx >= 0) temp.splice(idx, 1);
  setSelectedAlbum(temp);
}

function onSelectAlbum(id) {
  const temp = selectedAlbum.value.map((id) => id);
  const idx = temp.indexOf(id);
  if (idx < 0) temp.push(id);
  setSelectedAlbum(temp);
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

// function sizeAdjust() {

// }

watch(selectedDate, (date) => {
  renderByDate(date);
  const now = spiderman.dayjs();

  if (now.isAfter(selectedDate.value, 'date')) return;
  if (now.hour() >= selectedHour.value) return;
  setHour(now.hour());
  renderHourAnnotation(now.hour());
});

watch([selectedCamera, selectedAlbum], () => renderByDate(selectedDate.value));

watch(selectedHour, () => renderHourAnnotation(selectedHour.value));

const containerObserver = new ResizeObserver(() => {
  console.log('containerObserver')
  chart.update();
})

// 以下處理 chart
Chart.register(annotationPlugin);

let chart;
let renderInterval;
onMounted(() => {
  containerObserver.observe(chartContainer.value);

  const ctx = document.getElementById('chart');
  const unSelectAlbum = ['#9C5655', '#A08557', '#62925F', '#6766AC', '#9664A5'];

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(Array(24).keys()),
      datasets: Array.from(Array(6).keys()).map((idx) => ({
        label: idx == 0 ? '# of Faces' : `# of ${albumsList.value[idx - 1].name}`,
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
              size: 16,
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
  containerObserver.unobserve(chartContainer.value);
  clearInterval(renderInterval);
});

async function renderByDate(date) {
  // const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);
  const today = spiderman.dayjs().format('YYYY-MM-DD');
  const start = spiderman.dayjs(`${date} 00:00:00`).unix();
  const end = today === date ? spiderman.dayjs().unix() : spiderman.dayjs(`${date} 23:59:59`).unix();
  const tempData = await getLiveFaceHourlyCount(start, end, selectedCamera.value);
  const template = [0, 1, 2, 3, 4, 5];
  const dataOfDate = template.map((idx) => {
    if (idx === 0) return tempData.map((list) => list[idx]);
    if (selectedAlbum.value.indexOf(albumsList.value[idx - 1].id) >= 0) return tempData.map((list) => list[idx]);
    return new Array(24).fill(0);
  })
  const sumData = new Array(24).fill(1).map((_, idx) => {
    return dataOfDate.reduce((temp, cur) => temp += cur[idx], 0);
  })
  const maxOfData = Math.max(...sumData);

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
