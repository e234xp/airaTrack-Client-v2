<template>
  <ModalLayout :is-open="modal === 'case'" @close="onCancel">
    <template #header>
      {{ $t('AddToCase') }}
    </template>

    <template #description>
      {{ $t('AddToCaseDialog') }}
    </template>

    <template #default>
      <div class="mb-4 flex justify-end">
        <AppSwitch :value="caseType" :list="caseTypeList" @select="onSelectCaseType"></AppSwitch>
      </div>
      <template v-if="caseType === 'new'">
        <RegionExportItem />

        <AppLabel :label="$t('CaseName')">
          <AppInput
            dark
            v-model:modelInput="name"
            :placeholder="$t('CaseName')"
            class="mb-4 text-base"
          />
        </AppLabel>

        <AppLabel :label="$t('CaseDescription')">
          <AppInput
            dark
            v-model:modelInput="description"
            :rule="''"
            :placeholder="$t('Description')"
            class="mb-6 text-base"
          />
        </AppLabel>
      </template>
      <template v-else>
        <div class="flex flex-col gap-2 overflow-y-auto pr-2" style="height: 21.6rem;">
          <div class="flex gap-4 items-center rounded-md border-2 border-transparent p-2 hover:border-primary cursor-pointer" @click="onSelect(item)" v-for="item in list">
            <img :src="spiderman.base64Image.getSrc(item.target.faceImage)" class="w-24 h-24 object-cover cursor-pointer">
            <div>
              <div>{{ item.timestamp }}</div>
              <div>{{ item.caseName }}</div>
              <div class="text-default">{{ item.description }}</div>
            </div>
            <AppSvgIcon
              name="icon-check"
              :color="'#6CBBFF'"
              class="w-8 h-8 ml-auto"
              v-if="selectedCaseId === item.caseId"
            />
          </div>
        </div>
      </template>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppSvgIcon
          name="icon-loading"
          color="#6CBBFF"
          class="animate-spin w-8 h-8"
          v-if="isAdding"
        />
        <AppButton
          type="secondary"
          class="px-6"
          @click="onCancel"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          :isEnable="checkValid()"
          class="px-6"
          @click="onSave"
        >
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useI18n } from 'vue-i18n';
import useStore from '@/modules/investigation/stores/index';
import useUserStore from '@/stores/user';
import RegionExportItem from './RegionExportItem.vue';

import spiderman from '@/spiderman';
import { AppSwitch } from '../../../components/app';

const emit = defineEmits(['add', 'append']);

const props = defineProps({
  list: {
    type: Array,
    default: []
  }
});

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const userStore = useUserStore();
const { isAdding } = storeToRefs(userStore);

const i18n = useI18n();

const name = ref('');
const description = ref('');

const selectedCaseId = ref('');
const caseType = ref('new');
const caseTypeList = ref([
  {
    value: 'new',
    text: i18n.t('New')
  }, {
    value: 'previous',
    text: i18n.t('Exist')
  }
])

watch(() => modal.value, (val) => {
  if (val === 'case') {
    name.value = `Case-${spiderman.formatDate.dateStamp()}`;
    description.value = '';
    caseType.value = 'new';
  }
})

function checkValid() {
  if (caseType.value === 'new') {
    return name.value !== '' && !isAdding.value;
  } else {
    return selectedCaseId.value !== '' && !isAdding.value;
  }
}


function onSelect(item) {
  selectedCaseId.value = item.caseId;
}

function onSelectCaseType(type) {
  caseType.value = type;
}

function onSave() {
  if (caseType.value === 'new') emit('add', { name: name.value, description: description.value });
  else emit('append', { caseId: selectedCaseId.value });
}

function onCancel() {
  name.value = '';
  description.value = '';
  setModal('');
}
</script>