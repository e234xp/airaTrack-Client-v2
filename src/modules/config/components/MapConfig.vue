<template>
    <div class="w-full relative" style="height: calc(100% - 4rem)">
      <AppButton :type="'primary'" class="absolute px-4 -top-12 right-0" @click="openAddMapModal">
        {{ $t('AddMap') }}
      </AppButton>
      <AppDataTable :columns="column" :dataList="pageData" v-if="pageData.length !== 0">
        <template #id="props">
            <span class="text-white">{{ props.data.uuid }}</span>
        </template>
        <template #mapName="props">
            <span class="text-white">{{ props.data.name }}</span>
        </template>
        <template #action="props">
            <div class="flex gap-2">
            <AppButton :type="'secondary'" class="p-2" @click="onEdit(props.data)">
                <AppSvgIcon name="icon-edit" class="w-4 h-4"></AppSvgIcon>
            </AppButton>
            <AppButton :type="'secondary'" class="p-2" @click="onDelete(props.data.uuid)">
                <AppSvgIcon name="icon-trash" class="w-4 h-4"></AppSvgIcon>
            </AppButton>
            </div>
        </template>
        </AppDataTable>
    </div>
  
    <!-- <ModalLayout :is-open="modal === 'edit'" @close="setModal('')">
      <template #header>
        {{ $t('EditUser') }}
      </template>
  
      <template #description>
        {{ $t('EditUserDialog') }}
      </template>
  
  
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButton type="secondary" class="px-6" @click="setModal('')">
            {{ $t('Cancel') }}
          </AppButton>
  
          <AppButton type="primary" :isEnable="name !== ''" class="px-8" @click="onSaveEdit">
            {{ $t('Save') }}
          </AppButton>
        </div>
      </template>
    </ModalLayout> -->
  
    <ModalLayout :is-open="modal === 'delete'" @close="setModal('')">
      <template #header>
        {{ $t('DeleteUser') }}
      </template>
  
      <template #description>
        {{ $t('DeleteUserDialog') }}
      </template>
  
      <template #default>
        <div class="mb-2 text-xl">
          {{ $t('LoginUsername') }} : {{ selected.username }}
        </div>
        <div class="mb-2 text-xl">
          {{ $t('EmailAddress') }} : {{ selected.email }}
        </div>
      </template>
  
      <template #footer>
        <div class="flex justify-end gap-4">
          <AppButton type="secondary" class="px-6" @click="setModal('')">
            {{ $t('Cancel') }}
          </AppButton>
  
          <AppButton type="danger" :isEnable="name !== ''" class="px-6" @click="onSaveDelete">
            {{ $t('Delete') }}
          </AppButton>
        </div>
      </template>
    </ModalLayout>
  
   
    

    <AddMapModal ref="addMapModal" @fetch-maps="fetchMaps"/>
    <!-- 編輯地圖 Modal -->
  <EditMapModal 
    :isOpen="editModalOpen" 
    :selectedMap="selectedMap" 
    @update:isOpen="editModalOpen = $event"
    @save-edit="handleSaveEdit"
  />
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  
  import useStore from '@/modules/config/stores/index';
  import successStore from '@/components/AppSuccess/success';
  import AddMapModal from '@/modules/config/components/AddMapModal.vue'
  import EditMapModal from '@/modules/config/components/EditMapModal.vue'
  import AppDataTable from '@/components/AppDataTable.vue';
  
  const store = useStore();
  const { getUsers, getUserGroup, deleteUsers, postUsers, putUsers, postUserGroup } = store;
  
  const i18n = useI18n();
  


const column = ref([
  {
    width: '20%',
    key: 'id', // ✅ 新增 "id"
    text: i18n.t('ID') 
  },
  {
    width: '50%',
    key: 'mapName', // ✅ 新增 "mapName"
    text: i18n.t('MapName') 
  },
  {
    width: '30%',
    key: 'action', // ✅ 保持 "action"
    text: i18n.t('Actions')
  }
]);
  
  
  
  const modal = ref('');
  const pageData = ref([]);
  const addMapModal = ref(null);
  const editModalOpen = ref(false);
  const selectedMap = ref(null);

function openAddMapModal() {
  addMapModal.value.setModal('add-map');
}
  
function onEdit(map) {
  selectedMap.value = map; // 設定選中的地圖
  editModalOpen.value = true; // 打開 Modal
}

async function fetchMaps() {
  console.log(" 重新獲取地圖資料...");
  try {
    // **第一步：取得所有地圖（不含圖片）**
    const maps = await store.getAllMaps();
    console.log("地圖列表取得成功:", maps);
    const mapsArray = maps.data
    // **第二步：遍歷所有地圖，根據 `uuid` 取得圖片**
    const mapsWithImages = await Promise.all(
      mapsArray.map(async (map) => {
        try {
          const image = await store.getMapImage(map.uuid);
          const img = image.background
          console.log(image)
          console.log(img)
          return { ...map, img }; // 合併圖片
        } catch (error) {
          console.error(`取得地圖圖片失敗 (UUID: ${map.uuid})`, error);
          return { ...map, img: null }; // 取得圖片失敗時，設為 `null`
        }
      })
    );

    // **第三步：更新表格數據**
    pageData.value = mapsWithImages;
    console.log("地圖資料更新完成:", pageData.value);
  } catch (error) {
    console.error("取得地圖資料失敗:", error);
  }
}
  // function onEdit(id) {
  //   console.log(id)
  //   const idx = pageData.value.findIndex((item) => item.uuid === id);
  //   console.log(idx)
  //   if (idx >= 0) {
  //     selectedIdx.value = idx;
  //     selected.value = JSON.parse(JSON.stringify(pageData.value[idx]));
  //     setModal('edit');
  //   }
  // }
  
  function onDelete(id) {
    const temp = pageData.value.find((item) => item.id === id);
    if (temp) {
      selected.value = temp;
      setModal('delete');
    }
  }
  
  function onReset(id) {
    const idx = pageData.value.findIndex((item) => item.id === id);
    if (idx >= 0) {
      selected.value = JSON.parse(JSON.stringify(pageData.value[idx]));
      setModal('reset-pwd');
    }
  }
  
  async function onSaveEdit() {
    const result = await putUsers({
      id: selected.value.id,
      username: selected.value.username,
      password: selected.value.password,
      email: selected.value.email,
      groups: [selected.value.role]
    })
    if (result) {
      setModal('');
      successStore.show();
      const idx = pageData.value.findIndex((item) => item.id === selected.value.id);
      pageData.value[idx] = {
        ...selected.value,
        role: selected.value.groups[0]
      }
    }
  }
  
  async function onSaveDelete() { 
    const result = await deleteUsers({
      id: selected.value.id
    });
    if (result) {
      setModal('');
      successStore.show();
      const idx = pageData.value.findIndex((item) => item.id === selected.value.id);
      pageData.value.splice(idx, 1);
    }
  }
  
  async function onSaveAdd() {
    const result = await postUsers({
      username: newUser.username,
      password: newUser.password,
      email: newUser.email,
      groups: [newUser.role]
    });
    if (result) {
      setModal('');
      successStore.show();
      pageData.value.push({
        ...result,
        role: result.groups[0]
      });
      newUser.username = '';
      newUser.password = '';
      newUser.email = '';
      newUser.role = '';
    }
  }
  
  
  
  function setModal(val) {
    modal.value = val;
  }
  
  onMounted(fetchMaps);
  
  </script>