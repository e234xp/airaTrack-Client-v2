<template>
  <ModalLayout
    :is-open="modal === 'camera-filter'"
    @close="handleClose"
  >
    <template #header>
      {{ $t('CameraFilter') }}
    </template>

    <template #description>
      {{ $t('CameraFilterDialog') }}
    </template>

    <template #default>
      <div class="flex items-center mb-4 gap-2">
        <AppInput v-model:modelInput="searchText" class="w-full" :rule="''" :dark="true" />
        <AppSvgIcon name="icon-search" class="text-white w-6 h-6 mr-2" />
      </div>
      <div class="bg-third p-4 flex flex-col gap-2 rounded-lg h-60 overflow-y-auto">
        <div class="flex items-center gap-2" v-for="item in filterList">
          <AppCheckBox :placeholder="item.name" :modelInput="isChecked(item.id)" @onChange="onCheck(item.id)">
            <div class="truncate">{{ item.name }}</div>
          </AppCheckBox>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          @click="handleFilter"
        >
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/target/stores/index';

const props = defineProps({
  selected: {
    type: Array,
    default: []
  },
  list: {
    type: Array,
    default: []
  }
});

const emit = defineEmits(['filter']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const temp = ref([]);
const searchText = ref('');

const filterList = computed({
  get: () => searchText.value === '' ? props.list : props.list.filter((item) => item.name.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0)
})

function isChecked(id) {
  return temp.value.indexOf(id) >= 0;
}

function onCheck(id) {
  const idx = temp.value.indexOf(id);
  if (idx < 0) {
    temp.value.push(id);
  } else {
    temp.value.splice(idx, 1);
  }
}

function handleClose() {
  temp.value = props.selected.map((item) => item);
  setModal('');
}

function handleFilter() {
  emit('filter', temp.value.map((id) => id));
  setModal('');
}

onMounted(() => {
  temp.value = props.selected.map((item) => item);
})
</script>
