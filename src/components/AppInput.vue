<template>
  <div>
    <div class="flex justify-between">
      <div
        v-if="svgIcon"
        class="border-l border-t border-b border-general bg-third w-12 rounded flex justify-center items-center"
      >
        <AppSvgIcon
          :name="svgIcon"
          class="text-general w-6 h-6"
        />
      </div>
      <div
        v-if="type === 'select'"
        class="relative w-full"
      >
        <select
          v-model="input"
          class="shadow appearance-none border-general border
          rounded w-full h-10 px-4 text-gray-700
          focus:border-primary focus:shadow-outline focus:outline-none"
          :class="{ 
            'border-red-500': isShowError,
            'bg-third': dark,
            'text-white': dark
          }"
        >
          <option
            v-if="placeholder"
            value=""
          >
            {{ placeholder }}
          </option>
          <option
            v-for="(value, key) in options"
            :key="key"
            :value="value"
            class="bg-primary"
          >
            {{ key }}
          </option>
        </select>
        <div
          class="pointer-events-none absolute inset-y-0 right-0
          flex items-center px-2 text-gray-700"
        >
          <AppSvgIcon
            name="icon-chevron-botton"
            class="text-gray-700 w-4 h-4"
            :class="{
              'text-white': dark
            }"
          />
        </div>
      </div>

      <input
        v-else
        class="shadow appearance-none rounded
        w-full h-10 px-4 text-gray-700 leading-tight border
        focus:border-primary focus:shadow-outline focus:outline-none"
        :class="{
          'border-red-500 focus:border-red-500': isShowError,
          'bg-third': dark,
          'text-white': dark,
          'border-general': dark
        }"
        :type="type"
        :placeholder="placeholder"
        v-model="input"
        @blur="handleBlur"
        @keydown.enter="$emit('submit')"
      >
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
  computed, ref,
} from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  type: {
    type: String,
    default: 'text',
  },
  modelInput: {
    type: String,
    default: '',
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
  svgIcon: {
    type: String,
    default: '',
  },
  options: {
    type: Object,
    default() {
      return {};
    },
  },
  dark: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelInput', 'submit', 'valid']);
const input = computed({
  get: () => props.modelInput,
  set: (value) => {
    emit('update:modelInput', value);
    emit('valid', !validators[props.rule].valid(value));
  }
});

const hasTouched = ref(false);

const handleBlur = () => {
  hasTouched.value = true;
};

const i18n = useI18n();
const validators = {
  required: {
    valid: (val) => !val,
    isPassed: () => validators.required.valid(input.value),
    generateMessage: () => {
      const placeholder = props.placeholder !== '' ? props.placeholder : i18n.t('field');
      return i18n.t('RequiredMessage', { placeholder });
    },
  },
  ip: {
    valid: (val) => !val || !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(val),
    isPassed: () => validators.ip.valid(input.value),
    generateMessage: () => {
      const placeholder = props.placeholder !== '' ? props.placeholder : i18n.t('field');
      return 'Invalid IP address';
    }
  }
};

const isShowError = computed(() => {
  if (!props.rule) return false;
  const { isPassed } = validators[props.rule];

  return isPassed() && (hasTouched.value || props.hasSubmitted);
});

const errorMessage = computed(() => {
  if (!props.rule) return '';

  const { generateMessage } = validators[props.rule];

  return generateMessage();
});

</script>
