<template>
  <div class="grid grid-flow-col">
    <div class="grid content-center">
      <VueDatePicker
        v-model="selectedTime"
        model-type="yyyy-MM-dd HH:mm"
        :format="'yyyy-MM-dd HH:mm'"
        :preview-format="'yyyy-MM-dd HH:mm'"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const props = defineProps({
  modelSelectedTime: {
    type: String,
    default: '',
  },
});
const emit = defineEmits(['update:modelSelectedTime']);

const selectedTime = computed({
  get: () => props.modelSelectedTime,
  set: (value) => emit('update:modelSelectedTime', value),
});
</script>
