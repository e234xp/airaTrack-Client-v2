<template>
  <VueDatePicker
    :dark="dark"
    input-class-name="!border-gray-500 !border !text-base !py-1.5 !leading-6"
    :clearable="false"
    v-model="selected"
    :enable-time-picker="enableTimePicker"
    :format="format"
    :model-type="format"
    :preview-format="format"
    :locale="language"
    :range="range"
    :min-date="computedMinDate"
    :max-date="computedMaxDate"
    ref="dp"
  >
    <template #action-buttons>
      <div class="w-full flex gap-2">
        <AppButton type="secondary" class="px-6" @click="handleCancel">
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton type="primary" class="px-8" @click="handleSelect">
          {{ $t('Select') }}
        </AppButton>
      </div>
    </template>

    <template #action-preview></template>
  </VueDatePicker>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import spiderman from '@/spiderman';

import useLanguageStore from '@/stores/language';

const props = defineProps({
  modelSelected: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'date',
  },
  dark: {
    type: Boolean,
    default: false,
  },
  range: {
    type: Boolean,
    default: false,
  },
  limit: {
    type: String,
    default: ''
  },
  minDate: {
    type: [Date, String],
    default: null, // 允許不設置
  },
  maxDate: {
    type: [Date, String],
    default: null, // 允許不設置
  }
});
const emit = defineEmits(['update:modelSelected']);

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const selected = computed({
  get: () => props.modelSelected,
  set: (value) => emit('update:modelSelected', value),
});

// const maxDate = computed({
//   get: () => new Date()
// })


// ✅ **確保 `minDate` 和 `maxDate` 是 Date 型別**
const computedMinDate = computed(() => props.minDate ? new Date(props.minDate) : new Date());
const computedMaxDate = computed(() => props.maxDate ? new Date(props.maxDate) : null);

const dp = ref();

const { enableTimePicker, format } = (() => {
  switch (props.mode) {
    case 'date': {
      return {
        enableTimePicker: false,
        format: 'yyyy-MM-dd',
      };
    }

    case 'date-time': {
      return {
        enableTimePicker: true,
        format: 'yyyy-MM-dd HH:mm',
      };
    }

    default: {
      return {
        enableTimePicker: false,
        format: 'yyyy-MM-dd',
      };
    }
  }
})();

function handleSelect() {
  dp.value.selectDate();
}

function handleCancel() {
  dp.value.closeMenu();
}
</script>
