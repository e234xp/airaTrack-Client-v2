<template>
  <div class="w-full relative" style="height: calc(100% - 4rem)">
    <AppButton :type="'primary'" class="absolute px-4 -top-12 right-0" @click="onAdd">
      {{ $t('AddUser') }}
    </AppButton>
    <AppDataTable :columns="column" :dataList="pageData" v-if="pageData.length !== 0">
      <template #role="props">
        <span class="text-red-400" v-if="props.data.role === adminGroup.id">{{ $t('Administrator') }}</span>
        <span class="text-green-300" v-else>{{ $t('Operator') }}</span>
      </template>
      <template #action="props">
        <div class="flex gap-2">
          <AppButton :type="'secondary'" class="p-2" @click="onEdit(props.data.id)">
            <AppSvgIcon name="icon-edit" class="w-4 h-4"></AppSvgIcon>
          </AppButton>
          <AppButton :type="'secondary'" class="p-2" @click="onReset(props.data.id)">
            <AppSvgIcon name="icon-reset-password" class="w-4 h-4"></AppSvgIcon>
          </AppButton>
          <AppButton :type="'secondary'" class="p-2" :isEnable="props.data.role !== adminGroup.id || adminList.length > 1" @click="onDelete(props.data.id)">
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

    <template #description>
      {{ $t('EditUserDialog') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginUsername')">
        <div class="mb-4" v-if="adminList.length === 1 && pageData[selectedIdx].role === adminGroup.id">{{ selected.username }}</div>
        <AppInput v-model:modelInput="selected.username" class="mb-4" dark v-else/>
      </AppLabel>

      <AppLabel :label="$t('EmailAddress')">
        <AppInput v-model:modelInput="selected.email" :rule="'email'" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('Role')">
        <div class="mb-4" v-if="adminList.length === 1 && pageData[selectedIdx].role === adminGroup.id">{{ adminGroup.name }}</div>
        <AppInput type="select" class="mb-8" :options="groupOption" v-model:modelInput="selected.role" dark v-else/>
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

  <ModalLayout :is-open="modal === 'add'" @close="setModal('')">
    <template #header>
      {{ $t('AddUser') }}
    </template>

    <template #description>
      {{ $t('NewUserDialog') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginUsername')">
        <AppInput v-model:modelInput="newUser.username" @valid="(val) => newUserValid.username = val" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('EmailAddress')">
        <AppInput v-model:modelInput="newUser.email" :rule="'email'" @valid="(val) => newUserValid.email = val" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('LoginPassword')">
        <AppInput v-model:modelInput="newUser.password" @valid="(val) => newUserValid.password = val" class="mb-4"  dark />
      </AppLabel>

      <AppLabel :label="$t('Role')">
        <AppInput type="select" :options="groupOption" v-model:modelInput="newUser.role" dark />
      </AppLabel>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton type="secondary" class="px-6" @click="setModal('')">
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton type="primary" :isEnable="newUserValid.check" class="px-8" @click="onSaveAdd">
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>

  <ModalLayout :is-open="modal === 'reset-pwd'" @close="setModal('')">
    <template #header>
      {{ $t('ResetPassword') }}
    </template>

    <template #description>
      {{ $t('ResetPasswordDialog') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginPassword')">
        <AppInput v-model:modelInput="resetUser.password" class="mb-4"  dark />
      </AppLabel>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton type="secondary" class="px-6" @click="setModal('')">
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton type="primary" :isEnable="resetUser.password !== ''" class="px-8" @click="onSavePassword">
          {{ $t('Reset') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';

import AppDataTable from '@/components/AppDataTable.vue';

const store = useStore();
const { getUsers, getUserGroup, deleteUsers, postUsers, putUsers, postUserGroup } = store;

const i18n = useI18n();

const column = ref([
  {
    width: '20%',
    key: 'username',
    text: i18n.t('LoginUsername')
  },
  {
    width: '35%',
    key: 'email',
    text: i18n.t('EmailAddress')
  },
  {
    width: '15%',
    key: 'role',
    text: i18n.t('Role')
  },
  {
    width: '30%',
    key: 'action',
    text: i18n.t('Actions')
  }
]);

const adminKey = ref('Administrator');
const optKey = ref('Operator');

const modal = ref('');
const selectedIdx = ref(-1);
const selected = ref(null);

const newUser = reactive({
  username: '',
  email: '',
  password: '',
  role: ''
})

const resetUser = reactive({
  password: ''
})

const pageData = ref([]);
const groupData = ref([]);

const newUserValid = reactive({
  username: false,
  email: false,
  password: false,
  check: computed(() => {
    return newUserValid.username && newUserValid.email && newUserValid.password;
  })
})

const adminList = computed(() => {
  const adminId = groupData.value.find((item) => item.name === adminKey.value)?.id || '';
  return adminId === '' ? [] : pageData.value.filter((item) => item.groups[0] === adminId);
})

const groupOption = computed(() => {
  if (!adminGroup.value || !optGroup.value) return {};
  return {
    [adminGroup.value.name]: adminGroup.value.id,
    [optGroup.value.name]: optGroup.value.id,
  }
})

const adminGroup = computed(() => {
  return groupData.value.find((item) => item.code === '001');
})

const optGroup = computed(() => {
  return groupData.value.find((item) => item.code === '002');
})

function onAdd() {
  newUser.role = optGroup.value.id;
  setModal('add');
}

function onEdit(id) {
  const idx = pageData.value.findIndex((item) => item.id === id);
  if (idx >= 0) {
    selectedIdx.value = idx;
    selected.value = JSON.parse(JSON.stringify(pageData.value[idx]));
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

async function onSavePassword() {
  const result = await putUsers({
    id: selected.value.id,
    username: selected.value.username,
    password: resetUser.password,
    email: selected.value.email,
    groups: [selected.value.role]
  })
  if (result) {
    setModal('');
    successStore.show();
  }
}

function setModal(val) {
  modal.value = val;
}

onMounted(async () => {
  groupData.value = await getUserGroup();
  pageData.value = await getUsers();
  pageData.value = pageData.value.map((item) => {
    return {
      ...item,
      role: item.groups[0]
    }
  })
  console.log(pageData.value);
  
  if (groupData.value.findIndex((item) => item.code === '002') === -1) {
    const opet = {
      code: '002',
      name: 'Operator'
    };
    const result = await postUserGroup(opet);
    groupData.value.push(result);
  }
})

</script>