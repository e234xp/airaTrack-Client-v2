<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar></NavigationBar>
      </template>
      <template #grow>
        <div class="max-w-screen-xl w-full h-full mx-auto pt-4">
          <div class="text-2xl text-white pl-6">{{ title }}</div>
          <component :is="{
            video: VideoSourceConfig,
            channel: ChannelConfig,
            user: UserConfig,
            license: LicenseConfig,
            system: SystemConfig
          }[page]" />
        </div>
      </template>
    </FullLayout>
  </ProgressBarLayout>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import VideoSourceConfig from '@/modules/config/components/VideoSourceConfig.vue';
import ChannelConfig from '@/modules/config/components/ChannelConfig.vue';
import UserConfig from '@/modules/config/components/UserConfig.vue';
import LicenseConfig from '@/modules/config/components/LicenseConfig.vue';
import SystemConfig from '@/modules/config/components/SystemConfig.vue';
import NavigationBar from '@/modules/config/components/NavigationBar.vue';

import useStore from '@/modules/config/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();

const title = computed({
  get: () => {
    switch (page.value) {
      case 'video':
        return 'Video source settings';
      case 'channel':
        return 'Channels';
      case 'user':
        return 'Users';
      case 'license':
        return 'License';
      case 'system':
        return 'System';
      default:
        return '';
    }
  }
})

</script>