<template>
  <div class="grid grid-flow-col">
    <div class="mr-2 grid content-center">
      <div
        @click="toToday"
        class="aira-button aira-button--secondary py-2 px-3"
      >
        {{ $t('Today') }}
      </div>
    </div>

    <div class="grid content-center">
      <VueDatePicker
        v-model="selectedDate"
        :enable-time-picker="false"
        model-type="yyyy-MM-dd"
        :format="'yyyy-MM-dd'"
        :preview-format="'yyyy-MM-dd'"
      />
    </div>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const spiderman = inject('$spiderman');

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

function toToday() {
  selectedDate.value = spiderman.dayjs().format('YYYY-MM-DD');
}
</script>
