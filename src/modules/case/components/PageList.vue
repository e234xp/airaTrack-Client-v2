<template>
  <div class="w-full max-w-screen-xl mx-auto" ref="panel">
    <div class="flex justify-center h-18">
      <div class="flex items-center gap-4 py-4 w-1/4">
        <div class="text-white text-xl">{{ $t('Search') }}</div>
        <AppInput v-model:modelInput="searchText" class="w-3/5" :rule="''" :dark="true" />
      </div>
      <div class="flex items-center justify-center gap-4 py-4 w-3/4">
        <AppSwitch :value="selectedType" :list="typeList" @select="onSelect" style="width: 70%"></AppSwitch>
        <AppDatePicker v-model:modelSelected="selectedDate" :dark="true" :range="true" style="width: 30%" v-if="selectedType === 'c'">
        </AppDatePicker>
      </div>
    </div>
    <table class="w-full table text-white mt-1">
      <thead>
        <tr>
          <th width="10%" class="text-left">{{ $t('Target') }}</th>
          <th width="20%" class="text-left">{{ $t('TimeTitle') }}</th>
          <th width="20%" class="text-left">{{ $t('CaseName') }}</th>
          <th width="25%" class="text-left">{{ $t('Description') }}</th>
          <th width="15%" class="text-left">{{ $t('ByUser') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in pageData">
          <td>
            <img :src="spiderman.base64Image.getSrc(data.target.faceImage)" @click="onDetail(data.caseId)" class="face-image object-cover cursor-pointer">
          </td>
          <td>{{ parseTime(data.timestamp) }}</td>
          <td>{{ data.caseName }}</td>
          <td>{{ data.description }}</td>
          <td>{{ data.byuser }}</td>
          <td>
            <div class="flex gap-2">
              <AppButton :type="'secondary'" class="p-2" @click="onDetail(data.caseId)">
                <AppSvgIcon name="icon-edit" class="w-4 h-4"></AppSvgIcon>
              </AppButton>
              <AppButton :type="'secondary'" class="p-2" @click="onDelete(data.caseId)">
                <AppSvgIcon name="icon-trash" class="w-4 h-4"></AppSvgIcon>
              </AppButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <AppPagination :currentPage="pagination.current" :perPage="pagination.perItems" :totalItems="pagination.total"
      @onTurnPage="onTurnPage" class="mt-5 text-center">
    </AppPagination>
    <div class="text-white mt-2">
      {{ $t('CaseHint') }}
    </div>
  </div>

  <ModalDeleteCase :data="selectedCase" @delete="hanldeDelete"></ModalDeleteCase>
</template>
<script setup>
import { computed, ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import spiderman from '@/spiderman';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import useStore from '../stores';
import useInvestStore from '../../investigation/stores/index';
import ModalDeleteCase from './ModalDeleteCase.vue';

import successStore from '@/components/AppSuccess/success';

const router = useRouter();

const store = useStore();
const { getCase, deleteCase, getCaseDetail, setModal } = store;

const investStore = useInvestStore();
const { setCaseData } = investStore;

const i18n = useI18n();

const selectedCase = ref(null);

const searchText = ref('');
const selectedType = ref('');
const typeList = ref([
  {
    value: '',
    text: i18n.t('All')
  }, {
    value: 'd',
    text: i18n.t('InDay')
  }, {
    value: 'w',
    text: i18n.t('InWeek')
  }, {
    value: 'M',
    text: i18n.t('InMonth')
  }, {
    value: 'c',
    text: i18n.t('InCustom')
  }
]);
const dataList = ref([]);
const selectedDate = ref([
  spiderman.dayjs().add(-7, 'd').format('YYYY-MM-DD'),
  spiderman.dayjs().format('YYYY-MM-DD')
]);
const panel = ref(null);       // DOM ref
const pagination = reactive({
  current: 1,
  perItems: 0,
  total: computed(() => {
    return filterData.value.length;
  }),
  pages: computed(() => {
    const temp = Math.ceil(pagination.total / pagination.perItems);
    if (temp < pagination.current) pagination.current = temp;
    return temp;
  })
})

const ROW_HEIGHT = 130;
const DEFAULT_HEIGHT = 200;

const containerObserver = new ResizeObserver(() => {
  sizeAdjust();
})

const filterData = computed({
  get: () => {
    const tempList = dataList.value.filter((item) => item.caseName.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0 || item.description.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0);
    let list = [];
    if (selectedType.value === '') list = tempList;
    else if (selectedType.value === 'c') {
      list = tempList.filter((item) => spiderman.dayjs(item.timestamp).isSame(selectedDate.value[0]) || spiderman.dayjs(item.timestamp).isSame(selectedDate.value[1]) || (spiderman.dayjs(item.timestamp).isAfter(selectedDate.value[0]) && spiderman.dayjs(item.timestamp).isBefore(selectedDate.value[1])));
    } else {
      list = tempList.filter((item) => spiderman.dayjs().diff(item.timestamp, selectedType.value) <= 1);
    }
    return list;
  }
})

const pageData = computed({
  get: () => {
    return filterData.value.slice((pagination.current - 1) * pagination.perItems, pagination.current * pagination.perItems);
  }
})

function parseTime(time) {
  return `${spiderman.formatDate.parseYMD(time)} ${spiderman.dayjs(time).format('HH:mm:ss')}`;
}

function onSelect(val) {
  selectedType.value = val;
}

function onTurnPage(val) {
  pagination.current = val;
}

async function onDetail(id) {
  const { fileData: data } = await getCaseDetail(id);
  const list = JSON.parse(JSON.stringify(data.facesData));
  list.sort((a, b) => a.highest.timestamp - b.highest.timestamp);
  data.facesData = list;
  setCaseData(data);
  router.push({ path: '/investigation' });
}

function onDelete(id) {
  const item = dataList.value.find((item) => item.caseId === id);
  if (item) {
    selectedCase.value = item;
    setModal('delete');
  }
}

async function hanldeDelete() {
  const { message } = await deleteCase(selectedCase.value.caseId);
  if (message === 'ok') {
    const idx = dataList.value.findIndex((item) => item.caseId === selectedCase.value.caseId);
    if (idx >= 0) dataList.value.splice(idx, 1);
    setModal('');
    successStore.show();
  }
}

function sizeAdjust() {
  const height = panel.value.clientHeight;
  pagination.perItems = Math.floor((height - DEFAULT_HEIGHT) / ROW_HEIGHT);
}

onMounted(async () => {
  ({ data: dataList.value } = await getCase());
  containerObserver.observe(panel.value);
})

onBeforeUnmount(() => {
  containerObserver.unobserve(panel.value);
})

</script>
<style>
.face-image {
  width: 100px;
  height: 100px;
}
</style>