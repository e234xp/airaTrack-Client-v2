<template>
    <div class="w-full relative" style="height: calc(100% - 4rem)">
      <AppButton :type="'primary'" class="absolute px-4 -top-12 right-0" @click="openAddNotifyModal" >
        {{ $t('AddNotify') }}
      </AppButton>
      <AppDataTable :columns="column" :dataList="pageData" v-if="pageData.length !== 0">
        <template #open="props">
        <div class="flex justify-center">
          <AppToggle :value="props.data.enable" @change="onChangeLive(props.data)" ></AppToggle>
        </div>
      </template>
        <template #notifyName="props">
            <span class="text-white">{{ props.data.name }}</span>
        </template>
        <template #notifyType="props">
            <span class="text-white">{{ props.data.action_type }}</span>
        </template>
        <template #remark="props">
            <span class="text-white">{{ props.data.remarks }}</span>
        </template>
        <template #action="props">
            <div class="flex gap-2">
            <AppButton :type="'secondary'" class="p-2" @click="onEdit(props.data)">
                <AppSvgIcon name="icon-edit" class="w-4 h-4"></AppSvgIcon>
            </AppButton>
            <AppButton :type="'secondary'" class="p-2" @click="onDelete(props.data.uuid)" >
                <AppSvgIcon name="icon-trash" class="w-4 h-4"></AppSvgIcon>
            </AppButton>
            </div>
        </template>
        </AppDataTable>
    </div>
  
   
    <ModalLayout :is-open="modal === 'delete'" @close="setModal('')">
      <template #header>
        {{ $t('DeleteNotify') }}
      </template>
  
      <template #description>
        {{ $t('DeleteNotifyDialog') }}
      </template>
  
      <template #default>
        <div class="mb-2 text-xl">
          {{ $t('NotifyName') }} : {{ selected.name }}
        </div>
        <div class="mb-2 text-xl">
          {{ $t('NotifyId') }} : {{ selected.uuid}}
        </div>
      </template>
  
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButton type="secondary" class="px-6" @click="setModal('')">
            {{ $t('Cancel') }}
          </AppButton>
  
          <AppButton type="danger" class="px-6" @click="onSaveDelete">
            {{ $t('Delete') }}
          </AppButton>
        </div>
      </template>
    </ModalLayout>
  
   
    
    <EditNotifyModal ref="editNotifyModal" @refreshNotifyList="fetchNotifyList"/>
    <AddNotifyModal ref="addNotifyModal" @refreshNotifyList="fetchNotifyList"/>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  import useStore from '@/modules/config/stores/index';
  import successStore from '@/components/AppSuccess/success';
  import AddNotifyModal from '@/modules/config/components/AddNotifyModal.vue'
  import EditNotifyModal from '@/modules/config/components/EditNotifyModal.vue'
  import AppDataTable from '@/components/AppDataTable.vue';
  
  const store = useStore();
  const i18n = useI18n();
  
const column = ref([
  {
    width: '10%',
    key: 'open', 
    text: i18n.t('SwitchOpen') 
  },
  {
    width: '20%',
    key: 'notifyName', 
    text: i18n.t('NotifyName') 
  },
  {
    width: '20%',
    key: 'notifyType', 
    text: i18n.t('NotifyType') 
  },
  {
    width: '30%',
    key: 'remark', 
    text: i18n.t('Remark') 
  },
  {
    width: '20%',
    key: 'action', 
    text: i18n.t('Actions')
  }
]);
  const addNotifyModal = ref(null);
  const editNotifyModal = ref(null);
  const modal = ref('');
  const selectedIdx = ref(-1);
  const selected = ref(null);
  const pageData = ref([]);
 
  
  function openAddNotifyModal() {
  addNotifyModal.value.setModal('add-notify');
}

  function onEdit(data){
    editNotifyModal.value.setModal('edit-notify',data)
  }
  
  function onDelete(id) {
    const temp = pageData.value.find((item) => item.uuid === id);
    if (temp) {
      selected.value = temp;
      setModal('delete');
    }
  }
  
  async function onChangeLive(data){
    console.log("原始資料:", data);
    const originalEnable = data.enable;
    const updatedData = { ...data, enable: !data.enable };

    console.log("更新的資料:", updatedData);

    try {
        const result = await store.editNotify(updatedData);
        console.log(result)
        if (result) {
            successStore.show();
        } else {
            throw new Error("API 回應失敗");
        }
    } catch (error) {
        console.error("更新失敗:", error)
        data.enable = originalEnable;
        data = { ...data };
    }
};
  

  
  async function onSaveDelete() { 
    const result = await store.deleteNotify({
      uuid: selected.value.uuid
    });
    console.log("result",result)
    if (result) {
      setModal('');
      successStore.show();
      const idx = pageData.value.findIndex((item) => item.uuid === selected.value.uuid);
      pageData.value.splice(idx, 1);
    }
  }
  
 
  
  
  
  function setModal(val) {
    modal.value = val;
  }
  
  onMounted(async () => {
    const result = await store.getAllNotify();
    pageData.value = result.data
    console.log(pageData.value)
    
  })

  async function fetchNotifyList(){
    console.log("refresh")
    const result = await store.getAllNotify();
    pageData.value = result.data
    console.log(pageData.value)
  }
  
  </script>

