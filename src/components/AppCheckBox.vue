<template>
  <div class="flex justify-between">
    <div
      class="text-white text-3xl"
    >
      <input
        type="checkbox"
        class="w-4 h-4 mr-2 focus:ring-2 focus:ring-primary-500"
        v-model="input"
        :value="value"
        @input="onInput"
        :disabled="disabled"
      >
      {{ placeholder }}
    </div>

    <div
      v-if="isShowError"
      class="mt-1 text-red-500 text-s"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import {
  computed, defineProps, defineEmits, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelInput: {
    type: Array,
    default() {
      return [];
    },
  },
  value: {
    type: [Object, String],
    default() {
      return null;
    },
  },
  placeholder: {
    type: String,
    default: '',
  },
  rule: {
    type: String,
    default: 'required',
  },
  hasSubmitted: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  onInput: {
    type: Function,
    default() {
      return null;
    },
  },
});

const emit = defineEmits(['update:modelInput', 'submit']);
const input = computed({
  get: () => props.modelInput,
  set: (value) => emit('update:modelInput', value),
});

const hasTouched = ref(false);

const i18n = useI18n();
const validators = {
  required: {
    isPassed: () => !input.value,
    generateMessage: () => {
      const placeholder = props.placeholder ? props.placeholder : i18n.t('field');
      return i18n.t('requiredMessage', { placeholder });
    },
  },
};

const { isPassed, generateMessage } = validators[props.rule];
const isShowError = computed(() => {
  if (!props.rule) return false;

  return isPassed() && (hasTouched.value || props.hasSubmitted);
});
const errorMessage = computed(() => generateMessage());

</script>
