<template>
  <VueDatePicker
    class="dp"
    :clearable="false"
    v-model="selected"
    :enable-time-picker="enableTimePicker"
    :format="format"
    :model-type="format"
    :preview-format="format"
  />
</template>

<script setup>
import { computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
  modelSelected: {
    type: String,
    default: '',
  },
  mode: {
    type: String,
    default: 'date',
  },
});
const emit = defineEmits(['update:modelSelected']);

const selected = computed({
  get: () => props.modelSelected,
  set: (value) => emit('update:modelSelected', value),
});

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
</script>

<style>
.dp .dp__input {
  @apply h-12;
}
</style>
