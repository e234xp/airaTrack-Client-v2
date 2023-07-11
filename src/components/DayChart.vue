<template>
  <div class="flex py-6">
    <div
      @click="
        selectDate(spiderman.dayjs(selectedDate).subtract(1,'day'))
      "
      class="w-16 rounded bg-primary
        mx-3 grid justify-center content-center text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div
        class="my-2"
      >
        {{ spiderman.dayjs(selectedDate).subtract(1,'day').format('MM/DD') }}
      </div>
      <div class="my-2 flex justify-center">
        <SvgIcon
          name="icon-chevron-left"
          class="w-5 h-5"
        />
      </div>
    </div>
    <div class="flex-grow">
      <canvas
        id="chart"
        height="40"
      />
    </div>
    <div
      @click="
        selectDate(spiderman.dayjs(selectedDate).add(1,'day'))
      "
      class="w-16 rounded bg-primary
        mx-3 grid justify-center content-center text-white
              cursor-pointer hover:bg-primary-hover transition"
    >
      <div
        class="my-2"
      >
        {{ spiderman.dayjs(selectedDate).add(1,'day').format('MM/DD') }}
      </div>
      <div class="my-2 flex justify-center">
        <SvgIcon
          name="icon-chevron-right"
          class="w-5 h-5"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, ref, watch,
} from 'vue';

import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';

const spiderman = inject('$spiderman');

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
function selectDate(date) {
  selectedDate.value = spiderman.dayjs(date).format('YYYY-MM-DD');
}
watch(selectedDate, async (date) => {
  renderByDate(date);
});

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

        console.log(`You clicked on ${chart.data.labels[index]}`);

        chart.options.plugins.annotation.annotations.box.xMin = index - 0.45;
        chart.options.plugins.annotation.annotations.box.xMax = index + 0.45;

        chart.update();
      },
    },
  });
  renderByDate(spiderman.dayjs().format('YYYY-MM-DD'));
});

function renderByDate(date) {
  const data = {
    '2023-07-10': [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
      10, 9, 11, 14, 13, 4, 8, 16, 18, 20, 17, 6, 9],
    '2023-07-11': [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
      10, 9, 11, 14, 13, 4, 8, 16, 18, 30, 17, 6, 9],
    '2023-07-12': [12, 19, 3, 5, 2, 3, 8, 6, 15, 12, 7,
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
  chart.options.plugins.annotation.annotations.box.xMin = 0 - 0.45;
  chart.options.plugins.annotation.annotations.box.xMax = 0 + 0.45;

  chart.update();
}

</script>
