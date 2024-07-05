<template>
  <!-- <ModalLayout
    :is-open="isOpen"
  >
    <template #header>
      {{ header }}
    </template>

    <template #default>
      <div class="mb-10 text-2xl">
        {{ body }}
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end text-2xl">
        <AppButton
          v-for="button in buttons"
          :key="button"
          :type="button.type"
          class="ml-6 px-6 py-2"
          @click="$emit(button.emit)"
        >
          {{ button.text }}
        </AppButton>
      </div>
    </template>
  </ModalLayout> -->
  <div class="fixed inset-0 backdrop-filter backdrop-blur-lg" style="z-index: 99;" v-if="isOpen">
    <div class="fixed inset-0 flex items-center justify-center text-white">
      <div class="relative w-160 border border-modal bg-modal rounded-lg shadow-cus p-10">
        <div class="flex items-center gap-4 mb-4">
          <AppSvgIcon
            name="icon-warning"
            color="#f97316"
            class="w-8 h-8"
          />
          <div>{{ body }}</div>
        </div>
        <div class="flex justify-end gap-2">
          <AppButton
            v-for="button in buttons"
            :type="button.type"
            class="px-6"
            @click="button.action"
          >
            {{ button.text }}
          </AppButton>
          <!-- <AppButton
            type="secondary"
            class="px-6"
            @click="cancel"
          >
            No
          </AppButton>

          <AppButton
            type="primary"
            class="px-6"
            @click="confirm"
          >
            Yes
          </AppButton> -->
        </div>        
      </div>
    </div>
  </div>
</template>

<script setup>
import ModalLayout from '@/layouts/ModalLayout.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  header: {
    type: String,
    default: '',
  },
  body: {
    type: String,
    default: 'restart',
  },
  buttons: {
    type: Array,
    default() {
      return [];
    },
  },
  cancel: {
    type: Function,
    default: () => {},
  },
  confirm: {
    type: Function,
    default: () => {},
  },
});

defineEmits(['close']);
</script>
