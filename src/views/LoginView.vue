<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between">
      <div>
        <img
          src="@/assets/images/logo-track.png"
          alt=""
          class="h-6"
        >
      </div>
      <div class="grid content-end text-white text-xl">
        {{ $t('Version') }}: {{ spiderman.system.version }}
      </div>
    </div>
    <div class="w-112 bg-secondary shadow-md rounded mb-4 py-8 px-6">
      <div class="text-center mb-4 text-white font-bold text-3xl">
        {{ $t("LoginTitle") }}
      </div>
      <div class="text-center mb-4 text-white">
        {{ $t("LoginSubtitle") }}
      </div>

      <div class="mb-4">
        <AppInput
          svg-icon="icon-person"
          :placeholder="$t('LoginUsername')"
          v-model:modelInput="form.username"
          rule="required"
          @submit="handleLogin"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-4">
        <AppInput
          type="password"
          svg-icon="icon-lock"
          :placeholder="$t('LoginPassword')"
          v-model:modelInput="form.password"
          rule="required"
          @submit="handleLogin"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-6">
        <AppInput
          type="select"
          svg-icon="icon-language"
          :options="{
            English: 'en',
            繁體中文: 'zh',
          }"
          v-model:modelInput="language"
          rule="required"
          :has-submitted="hasSubmitted"
        />
      </div>

      <AppButton
        class="mx-10 mb-4 py-2 px-20"
        @click="handleLogin"
      >
        {{ $t("Login") }}
      </AppButton>

      <div class="flex justify-center">
        <div class="grid content-center mr-1">
          <AppSvgIcon
            name="icon-question"
            class="text-white w-4 h-4"
          />
        </div>
        <AppButton
          type="transparent"
          class="underline"
        >
          {{ $t("ForgotPassword") }}
        </AppButton>
      </div>
    </div>

    <div class="mb-2 flex justify-center text-xl text-white">
      <div class="grid content-center mx-2">
        Powered by
      </div>
      <img
        src="@/assets/images/logo.png"
        alt=""
        class="h-6"
      >
    </div>
  </div>
</template>

<script setup>
import spiderman from '@/spiderman';

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import useSubmit from '@/composable/useSubmit';

import useUserStore from '@/stores/user';
import useLanguageStore from '@/stores/language';
import useDevices from '@/stores/devices';

const router = useRouter();

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);
const { loginUser, setUser, startMaintainUser } = userStore;

const languageStore = useLanguageStore();
const { language } = storeToRefs(languageStore);

const devicesStore = useDevices();
const {
  getDevices, setDevices, getLiveDevices, setLiveDevices,
} = devicesStore;

const { hasSubmitted, generateSubmit } = useSubmit();

// todo
const form = ref({
  username: 'Admin',
  password: '123456',
});

const handleLogin = generateSubmit(async () => {
  setUser(await loginUser(form.value));
  startMaintainUser();

  await setupResourses();
  router.push({ path: '/target' });
});

async function setupResourses() {
  setDevices(await getDevices(sessionId.value));
  setLiveDevices(await getLiveDevices(sessionId.value));
}
</script>
