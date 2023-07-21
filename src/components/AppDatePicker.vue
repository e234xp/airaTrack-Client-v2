<template>
  <div class="grid grid-flow-col">
    <div class="grid content-center">
      <VueDatePicker
        :clearable="false"
        :enable-time-picker="false"
        v-model="selectedDate"
        model-type="yyyy-MM-dd"
        :format="'yyyy-MM-dd'"
        :preview-format="'yyyy-MM-dd'"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
  modelSelectedDate: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelSelectedDate']);

const selectedDate = computed({
  get: () => props.modelSelectedDate,
  set: (value) => emit('update:modelSelectedDate', value),
});
</script>
