<template>
  <div class="h-full grid justify-center content-center">
    <div class="mb-2 flex justify-between">
      <div>
        <img
          :src="airaTrackSrc"
          alt=""
          class="w-48"
        >
      </div>
      <div class="grid content-end text-white text-xl">
        {{ $t('Version') }}: {{ version }}
      </div>
    </div>
    <div class="w-112 bg-secondary border-2 border-gray-500 shadow-md rounded mb-4 py-8 px-6">
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
          :validator="{
            rule: 'required',
            field: 'username',
          }"
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
          :validator="{
            rule: 'required',
            field: 'password',
          }"
          @submit="handleLogin"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-4">
        <AppInput
          type="select"
          svg-icon="icon-language"
          :options="{
            English: 'en',
            繁體中文: 'zh',
          }"
          v-model:modelInput="language"
          :validator="{
            rule: 'required',
            field: 'language',
          }"
          :has-submitted="hasSubmitted"
        />
      </div>

      <div class="mb-4 flex justify-center">
        <button
          class="bg-primary hover:bg-primary-hover transition text-white font-bold py-2 px-20
           rounded"
          type="button"
          @click="handleLogin"
        >
          {{ $t("Login") }}
        </button>
      </div>
      <div
        class="flex justify-center align-baseline font-bold text-sm hover:text-blue-800"
        href="#"
      >
        <div class="grid content-center mr-1">
          <SvgIcon
            name="icon-question"
            class="text-white w-4 h-4"
          />
        </div>
        <button
          class="underline text-white"
        >
          {{ $t("ForgotPassword") }}
        </button>
      </div>
    </div>

    <div class="mb-2 flex justify-center text-xl text-white">
      <div class="grid content-center mx-2">
        Powered by
      </div>
      <img
        src="@/assets/images/logo.png"
        alt=""
        class="w-16"
      >
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';

import airaTrack from '@/assets/base64-images/airaTrack';
import useSubmit from '@/composable/useSubmit';
import useI18n from '@/composable/useI18n';
import useSystemStore from '@/stores/system';

const spiderman = inject('$spiderman');
const router = useRouter();
const { language } = useI18n();
const { version, apiBaseUrl } = useSystemStore();
const { hasSubmitted, generateSubmit } = useSubmit();

const airaTrackSrc = spiderman.base64Image.getSrc(airaTrack);

const form = ref({
  username: '',
  password: '',
});

const handleLogin = generateSubmit(async () => {
  // todo 拿掉
  if (form.value.username === '') { router.push({ path: '/' }); }

  const res = await spiderman.apiService({
    method: 'post',
    url: `${apiBaseUrl}/airaTracker/login`,
    data: form.value,
  });

  console.log(res);
});

</script>
