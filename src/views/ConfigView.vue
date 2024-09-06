<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar></NavigationBar>
      </template>
      <template #grow>
        <div class="max-w-[85rem] w-full h-full mx-auto pt-4">
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
import { useI18n } from 'vue-i18n';

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

const i18n = useI18n();

const title = computed({
  get: () => {
    switch (page.value) {
      case 'video':
        return i18n.t('VideoSourceTitle');
      case 'channel':
        return i18n.t('ChannelTitle');
      case 'user':
        return i18n.t('UserTitle');
      case 'license':
        return i18n.t('License');
      case 'system':
        return i18n.t('System');
      default:
        return '';
    }
  }
})

</script>