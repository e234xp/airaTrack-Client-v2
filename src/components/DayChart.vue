<template>
  <div class="flex py-6">
    <div
      @click="
        setDate(spiderman.dayjs(selectedDate).subtract(1,'day'))
      "
      class="w-16 rounded border-2 bg-gray-800
        mx-3 grid justify-center content-center text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div
        class="my-2"
      >
        {{ spiderman.dayjs(selectedDate).subtract(1,'day').format('MM/DD') }}
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-left"
          class="w-5 h-5"
        />
      </div>
    </div>
    <div class="flex-grow cursor-pointer">
      <canvas
        id="chart"
        height="38"
      />
    </div>
    <div
      @click="
        setDate(spiderman.dayjs(selectedDate).add(1,'day'))
      "
      class="w-16 rounded border-2 bg-gray-800
        mx-3 grid justify-center content-center text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div
        class="my-2"
      >
        {{ spiderman.dayjs(selectedDate).add(1,'day').format('MM/DD') }}
      </div>
      <div class="my-2 flex justify-center">
        <AppSvgIcon
          name="icon-chevron-right"
          class="w-5 h-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, computed, watch,
} from 'vue';

import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

const spiderman = inject('$spiderman');

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

watch(selectedDate, (date) => {
  renderByDate(date);
});

// 以下處理 chart
Chart.register(annotationPlugin);

let chart;
onMounted(() => {
  const ctx = document.getElementById('chart');

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Array.from(Array(24).keys()),
      datasets: [
        {
          label: 'Number of Faces',
          data: [],
          backgroundColor: 'rgba(215, 233, 244, 1)',
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
              xMin: 0 - 0.45,
              xMax: 0 + 0.45,
              yMin: -1,
              yMax: 24,
              backgroundColor: 'rgba(255, 99, 132, 0)',
              borderWidth: 8,
              borderColor: 'rgba(49, 131, 177, 1)',
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
        setHour(hour);
        renderHourAnnotation(hour);
      },
    },
  });

  renderByDate(spiderman.dayjs().format('YYYY-MM-DD'));
  renderHourAnnotation(selectedHour.value);
});

function renderByDate(date) {
  // todo 改為真實串接
  const data = {
    [spiderman.dayjs().add(1, 'day').format('YYYY-MM-DD')]: [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
      10, 9, 11, 14, 13, 4, 8, 16, 18, 20, 17, 6, 9],
    [spiderman.dayjs().format('YYYY-MM-DD')]: [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
      10, 9, 11, 14, 13, 4, 8, 16, 18, 30, 17, 6, 9],
    [spiderman.dayjs().subtract(1, 'day').format('YYYY-MM-DD')]: [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
      10, 9, 11, 14, 13, 4, 8, 16, 18, 40, 17, 6, 9],
  };

  const dataOfDate = data[date];
  const maxOfData = Math.max(...dataOfDate);

  // 設定 data
  chart.data.datasets[0].data = dataOfDate;

  // 設定 最大高度
  chart.options.scales.y.max = maxOfData + 5;

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
