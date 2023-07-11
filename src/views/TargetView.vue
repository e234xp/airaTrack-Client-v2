<template>
  <ProgressBarLayout>
    <div
      class="h-fit border-b-2 border-gray-500
      grid grid-flow-col justify-center
      text-2xl text-gray-300 font-bold"
    >
      <div
        class="px-8 py-4
        cursor-pointer hover:text-primary-hover transition
        border-b-4 border-primary text-white"
      >
        !{{ $t('Faces') }}
      </div>
      <div
        class="px-8 py-4
        cursor-pointer hover:text-primary-hover transition
        "
      >
        !{{ $t('Album') }}
      </div>
    </div>

    <DayChart />

    <div class="flex-grow overflow-y-auto">
      <div
        v-for="i in 100"
        :key="i"
      >
        photo
      </div>
    </div>
  </ProgressBarLayout>
</template>

<script setup>
import DayChart from '@/components/DayChart.vue';
</script>
