<template>
  <div class="h-full flex justify-center items-center">
    <div class="sm:w-full md:w-144 bg-panel shadow-cus rounded p-8">
      <component :is="{
        video: VideoSourceConfig,
        channel: ChannelConfig,
        user: UserConfig,
        license: LicenseConfig,
        system: SystemConfig
      }[page]" />
    </div>
  </div>
</template>

<script setup>
import useStore from '@/modules/initial/stores/index';

const store = useStore();
const { page } = storeToRefs(store);

</script>

<style scoped>

</style>
