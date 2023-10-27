<template>
  <div class="w-full max-w-screen-xl mx-auto" ref="panel">
    <div class="flex justify-center h-18">
      <div class="flex items-center justify-center gap-4 py-4 px-2 w-2/5">
        <div class="text-white text-xl">{{ $t('Search') }}</div>
        <AppInput v-model:modelInput="searchText" class="w-1/2" :rule="''" :dark="true" />
      </div>
      <div class="flex items-center gap-4 py-4 px-2 w-3/5">
        <AppSwitch :value="selectedType" :list="typeList" @select="onSelect"></AppSwitch>
        <AppDatePicker v-model:modelSelected="selectedDate" :dark="true" :range="true" v-if="selectedType === 'c'">
        </AppDatePicker>
      </div>
    </div>
    <table class="w-full table text-white mt-1">
      <thead>
        <tr>
          <th width="10%" class="text-left">{{ $t('Target') }}</th>
          <th width="10%" class="text-left">{{ $t('TimeTitle') }}</th>
          <th width="20%" class="text-left">{{ $t('CaseName') }}</th>
          <th width="30%" class="text-left">{{ $t('Description') }}</th>
          <th width="20%" class="text-left">{{ $t('ByUser') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in pageData">
          <td>
            <img :src="spiderman.base64Image.getSrc(data.target.faceImage)" class="face-image object-cover">
          </td>
          <td>{{ data.timestamp }}</td>
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
      please remember to download case manually because video archive could be expired.
    </div>
  </div>
</template>
<script setup>
import { computed, ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import spiderman from '@/spiderman';
import { useRouter } from 'vue-router';
import useStore from '../stores';
import useInvestStore from '../../investigation/stores/index';

import AppMultiSwitch from './AppMultiSwitch.vue';

const router = useRouter();

const store = useStore();
const { getCase, deleteCase, getCaseDetail } = store;

const investStore = useInvestStore();
const { setCaseData } = investStore;

const searchText = ref('');
const selectedType = ref('');
const typeList = ref([
  {
    value: '',
    text: 'All'
  }, {
    value: 'd',
    text: 'Day'
  }, {
    value: 'w',
    text: 'Week'
  }, {
    value: 'M',
    text: 'Month'
  }, {
    value: 'c',
    text: 'Custom'
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
    const tempList = dataList.value.filter((item) => item.caseName.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0);
    let list = [];
    if (selectedType.value === '') list = tempList;
    else if (selectedType.value === 'c') {
      list = tempList.filter((item) => spiderman.dayjs(item.timestamp).isSame(selectedDate.value[0]) || spiderman.dayjs(item.timestamp).isSame(selectedDate.value[1]) || (spiderman.dayjs(item.timestamp).isAfter(selectedDate.value[0]) && spiderman.dayjs(item.timestamp).isBefore(selectedDate.value[1])));
    } else {
      list = tempList.filter((item) => spiderman.dayjs().diff(item.timestamp, selectedType.value) === 1);
    }
    return list;
  }
})

const pageData = computed({
  get: () => {
    return filterData.value.slice((pagination.current - 1) * pagination.perItems, pagination.current * pagination.perItems);
  }
})

function onSelect(val) {
  selectedType.value = val;
}

function onTurnPage(val) {
  pagination.current = val;
}

async function onDetail(id) {
  const { fileData: data } = await getCaseDetail(id);
  setCaseData(data);
  router.push({ path: '/investigation' });
}

async function onDelete(id) {
  const { message } = await deleteCase(id);
  if (message === 'ok') {
    const idx = dataList.value.findIndex((item) => item.caseId === id);
    if (idx >= 0) dataList.value.splice(idx, 1);
  }
}

function sizeAdjust() {
  const height = panel.value.clientHeight;
  pagination.perItems = Math.floor((height - DEFAULT_HEIGHT) / ROW_HEIGHT);
}

onMounted(async () => {
  const { data: tempData } = await getCase();
  dataList.value = tempData;
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