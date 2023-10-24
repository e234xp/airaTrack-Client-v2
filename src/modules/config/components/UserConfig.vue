<template>
  <div class="w-full relative" style="height: calc(100% - 4rem)">
    <AppButton :type="'primary'" class="absolute px-4 -top-12 right-0" @click="onAdd">
      {{ $t('AddUser') }}
    </AppButton>
    <AppDataTable :columns="column" :dataList="pageData">
      <template #action="props">
        <div class="flex gap-2">
          <AppButton :type="'secondary'" class="p-2" @click="onEdit(props.data.id)">
            <AppSvgIcon name="icon-edit" class="w-4 h-4"></AppSvgIcon>
          </AppButton>
          <AppButton :type="'secondary'" class="p-2" @click="onDelete(props.data.id)">
            <AppSvgIcon name="icon-trash" class="w-4 h-4"></AppSvgIcon>
          </AppButton>
        </div>
      </template>
    </AppDataTable>
  </div>

  <ModalLayout :is-open="modal === 'edit'" @close="setModal('')">
    <template #header>
      {{ $t('EditUser') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginUsername')">
        <AppInput v-model:modelInput="selected.username" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('EmailAddress')">
        <AppInput v-model:modelInput="selected.email" class="mb-8" dark />
      </AppLabel>
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
  </ModalLayout>

  <ModalLayout :is-open="modal === 'delete'" @close="setModal('')">
    <template #header>
      Delete User
    </template>

    <template #default>
      <div class="mb-2 text-xl">
        Username : {{ selected.username }}
      </div>
      <div class="mb-2 text-xl">
        Email : {{ selected.email }}
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton type="secondary" class="px-6" @click="setModal('')">
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton type="primary" :isEnable="name !== ''" class="px-6" @click="onSaveDelete">
          {{ $t('Delete') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>

  <ModalLayout :is-open="modal === 'add'" @close="setModal('')">
    <template #header>
      {{ $t('AddUser') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginUsername')">
        <AppInput v-model:modelInput="newUser.username" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('EmailAddress')">
        <AppInput v-model:modelInput="newUser.email" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('LoginPassword')">
        <AppInput v-model:modelInput="newUser.password" class="mb-4" dark />
      </AppLabel>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton type="secondary" class="px-6" @click="setModal('')">
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton type="primary" :isEnable="name !== ''" class="px-8" @click="onSaveAdd">
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import AppDataTable from '@/components/AppDataTable.vue';

import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { getUsers, deleteUsers, postUsers, putUsers } = store;

const column = ref([
  {
    width: '30%',
    key: 'username',
    text: 'Username'
  },
  {
    width: '40%',
    key: 'email',
    text: 'Email'
  },
  {
    width: '30%',
    key: 'action',
    text: 'Actions'
  }
])

const modal = ref('');
const selected = ref(null);

const newUser = reactive({
  username: '',
  email: '',
  password: ''
})

const pageData = ref([])

function onAdd() {
  setModal('add');
}

function onEdit(id) {
  const temp = pageData.value.find((item) => item.id === id);
  if (temp) {
    selected.value = temp;
    setModal('edit');
  }
}

function onDelete(id) {
  const temp = pageData.value.find((item) => item.id === id);
  if (temp) {
    selected.value = temp;
    setModal('delete');
  }
}

async function onSaveEdit() {
  const result = await putUsers({
    ...selected.value
  })
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
    email: newUser.email
  });
  if (result) {
    setModal('');
    successStore.show();
    pageData.value.push(result);
  }
}

function setModal(val) {
  modal.value = val;
}

onMounted(async () => {
  pageData.value = await getUsers();
})

</script>