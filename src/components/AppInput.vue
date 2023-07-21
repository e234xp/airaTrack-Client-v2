<template>
  <input
    v-model="input"
    :type="type"
    :placeholder="placeholder"
    class="shadow appearance-none border-2 rounded w-full py-2 px-3
    text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    :class="{
      'border-red-500': isShowError
    }"
    @blur="handleBlur"
    @keydown.enter="$emit('submit')"
  >

  <div
    v-if="isShowError"
    class="ml-1 mt-1 text-red-500 text-s italic"
  >
    {{ errorMessage }}
  </div>
</template>

<script setup>
import {
  computed, defineProps, defineEmits, ref,
} from 'vue';

const props = defineProps({
  modelInput: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
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
});

const emit = defineEmits(['update:modelInput', 'submit']);
const input = computed({
  get: () => props.modelInput,
  set: (value) => emit('update:modelInput', value),
});

const hasTouched = ref(false);

const handleBlur = () => {
  hasTouched.value = true;
};

const validators = {
  required: {
    isPassed: () => !input.value,
    generateMessage: () => `The ${props.placeholder ? props.placeholder : 'field'} is required`,
  },
};

const { isPassed, generateMessage } = validators[props.rule];
const isShowError = computed(() => {
  if (!props.rule) return false;

  return isPassed() && (hasTouched.value || props.hasSubmitted);
});
const errorMessage = computed(() => generateMessage());
</script>
