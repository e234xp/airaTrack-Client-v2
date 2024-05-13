<template>
  <ModalLayout
    :is-open="modal==='archive'"
    @close="onCancel"
  >
    <template #header>
      {{ $t('VideoArchiveTitle') }}
    </template>

    <template #description>
      {{ $t('VideoArchiveDialog') }}
    </template>

    <template #default v-if="!isDownload && downloadList.length === 0">
      <RegionExportItem />

      <AppLabel :label="$t('Title')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.title"
          :placeholder="$t('Title')"
          class="mb-4 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('Subject')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.subject"
          :placeholder="$t('Subject')"
          class="mb-4 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('Remark')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.remark"
          :placeholder="$t('Remark')"
          class="mb-6 text-base"
          rule=""
        />
      </AppLabel>
      
    </template>

    <template #default v-else>
      <AppButton
        type="primary"
        class="ml-auto w-1/5"
        :isEnable="!isDownload && !success"
        @click="emit('retry')"
      >
        {{ $t('Retry') }}
      </AppButton>
      <div class="overflow-y-auto flex flex-col gap-4 mt-4" style="height: 24.5rem">
        <div class="flex items-center gap-4" :class="[item.success ? '' : 'opacity-40']" v-for="item in downloadList">
          <img class="w-20 h-20"  v-lazy="spiderman.base64Image.getSrc(item.highest.face_image)" />
          <div>
            <div>{{ `${spiderman.formatDate.parseYMD(item.starttime)} ${spiderman.dayjs(item.starttime).format('HH:mm:ss')} - ${spiderman.dayjs(item.endtime).format('HH:mm:ss')}` }}</div>
            <div>{{ findDevice(item.highest.cid).name }}</div>
          </div>
          <AppSvgIcon
            name="icon-check"
            :color="item.success ? '#6CBBFF' : '#555'"
            class="w-8 h-8"
            v-if="isDownload || item.success"
          />
          <AppSvgIcon
            name="icon-close"
            class="w-8 h-8 cursor-pointer"
            @click="emit('delete', item)"
            v-else
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppSvgIcon
          name="icon-loading"
          color="#6CBBFF"
          class="animate-spin w-8 h-8"
          v-if="isDownload"
        />
        <AppSvgIcon
          name="icon-warning"
          color="#f97316"
          class="w-8 h-8"
          v-if="!isDownload && !success"
        />
        <AppButton
          type="secondary"
          class="px-6"
          @click="onCancel"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          :isEnable="archiveForm.title !== '' && archiveForm.subject !== '' && !isDownload && success"
          @click="
            emit('add');
          "
        >
          {{ $t('IntercomUrl') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import spiderman from '@/spiderman';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';
import useDevices from '@/stores/devices';
import RegionExportItem from './RegionExportItem.vue';

import modalStore from '@/components/AppModal/modal';

import { useI18n } from 'vue-i18n';

const store = useStore();
const { modal, archiveForm, isDownload, downloadList } = storeToRefs(store);
const { setModal, finishDownload } = store;

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const i18n = useI18n();

const emit = defineEmits(['add', 'retry', 'delete']);

const success = computed(() => {
  return downloadList.value.every((item) => item.success);
});

function onCancel() {
  if (downloadList.value.length === 0) {
    setModal('');
    return;
  }
  modalStore.isOpen = true;
  modalStore.body = i18n.t('CancelHint');
  modalStore.buttons = [
    {
      type: 'secondary',
      text: i18n.t('No'),
      action: () => {
        modalStore.isOpen = false;
      }
    },
    {
      type: 'primary',
      text: i18n.t('Yes'),
      action: () => {
        modalStore.isOpen = false;
        finishDownload();
        setModal('');
      },
    },
  ];
}
</script>
