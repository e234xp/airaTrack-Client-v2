<template>
  <ProgressBarLayout>
    <div class="w-full flex flex-col">
      <div
        class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
      >
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl
          border-b-4 border-primary"
        >
          !{{ $t('Faces') }}
        </div>
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl"
        >
          !{{ $t('Album') }}
        </div>
      </div>

      <div
        class="border-b-2 border-gray-500
          grid grid-flow-col justify-between"
      >
        sss
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
    </div>

    <TargetSideBar />
  </ProgressBarLayout>
</template>

<script setup>
import DayChart from '@/components/DayChart.vue';
import TargetSideBar from '@/components/TargetSideBar.vue';
</script>
