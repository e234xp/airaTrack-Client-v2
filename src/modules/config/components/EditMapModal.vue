<template>
    <ModalLayout :is-open="isOpen" @close="closeModal">
      <template #header>
        {{ $t('EditMap') }}
      </template>
  
      <template #description>
        {{ $t('EditMapDialog') }}
      </template>
  
      <template #default>
        <AppLabel :label="$t('MapName')">
          <input v-model="editedMap.name" type="text" class="w-full p-2 border rounded" />
        </AppLabel>
  
        <AppLabel :label="$t('UUID')" class="mt-2">
          <input v-model="editedMap.uuid" type="text" class="w-full p-2 border rounded" disabled />
        </AppLabel>
  
        <AppLabel :label="$t('Image')" class="mt-2">
          <img :src="computedImg" class="w-full h-40 object-contain border" v-if="computedImg"/>
          <p v-else class="text-red-500">No Image Available</p>
        </AppLabel>
      </template>
  
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButton type="secondary" class="px-6" @click="closeModal">
            {{ $t('Cancel') }}
          </AppButton>
  
          <AppButton type="primary" class="px-8" @click="saveEdit">
            {{ $t('Save') }}
          </AppButton>
        </div>
      </template>
    </ModalLayout>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, watch, computed } from "vue";
  
  const props = defineProps({
    isOpen: Boolean, // 控制 modal 顯示
    selectedMap: Object, // 要編輯的地圖
  });
  
  const emit = defineEmits(["update:isOpen", "save-edit"]);
  
  const editedMap = ref({});
  
  // **監聽 props.selectedMap 變更，更新編輯中的地圖**
  watch(
    () => props.selectedMap,
    (newVal) => {
      if (newVal) {
        editedMap.value = { ...newVal };
      }
    },
    { deep: true, immediate: true }
  );
  // **確保 Base64 圖片格式正確**
const computedImg = computed(() => {
  if (!props.selectedMap?.img) return null;

  // 確保 base64 字串是完整 Data URL
  return props.selectedMap.img.startsWith("data:image")
    ? props.selectedMap.img
    : `data:image/png;base64,${props.selectedMap.img}`;
});
  // **關閉 Modal**
  function closeModal() {
    emit("update:isOpen", false);
  }
  
  // **儲存變更並通知父組件**
  async function saveEdit() {
    emit("save-edit", editedMap.value);
    closeModal();
  }
  </script>
  