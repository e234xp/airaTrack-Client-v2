<template>
  <ModalLayout :is-open="modal === 'delete'" @close="setModal('')">
    <template #header>
      {{ $t('DeletCaseTitle') }}
    </template>

    <template #description>
      {{ $t('DeletCaseDialog') }}
    </template>

    <template #default>
      <div class="flex gap-2" v-if="data.target">
        <img
          class="w-48 h-48 mr-2 object-cover"
          v-lazy="spiderman.base64Image.getSrc(data.target.faceImage)"
          alt=""
        >
        <div>
          <AppLabel :label="$t('CaseName')">
            {{ data.caseName }}
          </AppLabel>
          <AppLabel :label="$t('TimeTitle')">
            {{ parseTime(data.timestamp) }}
          </AppLabel>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="danger"
          class="px-6"
          @click="$emit('delete')"
        >
          {{ $t('Delete') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/case/stores/index';

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
})

function parseTime(time) {
  return `${spiderman.formatDate.parseYMD(time)} ${spiderman.dayjs(time).format('HH:mm:ss')}`;
}

defineEmits(['delete']);
</script>

<style scoped>

</style>
