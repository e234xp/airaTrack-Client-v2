<template>
  <ModalLayout :is-open="modal === 'upload'" @close="onClose">
    <template #header>
      {{ $t('UploadFile') }}
    </template>

    <template #description>
      {{ $t('UploadDialog') }}
    </template>

    <template #default>
      <div class="flex justify-center cursor-pointer w-full h-80 mb-4" @click="onUploadImage">
        <AppSvgIcon
          name="icon-image"
          class="text-gray-600"
          v-if="image === ''"
        />
        <input type="file" ref="file" accept="image/*" @change="fileOnChange" style="display: none;" />
        <img :src="image">
      </div>
      <AppLabel :label="$t('Album')">
        <AppInput
          dark
          type="select"
          :options="options"
          class="mb-6"
          v-model:modelInput="form.albumId"
        />
      </AppLabel>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="onClose"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          :isEnable="image !== ''"
          @click="handleUpload"
        >
          {{ $t('Upload') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import spiderman from '@/spiderman';
import useStore from '@/modules/target/stores/index';
import successStore from '@/components/AppSuccess/success';
import errorStore from '@/components/AppError/error';

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal, uploadPhoto } = store;

const props = defineProps({
  list: {
    type: Array,
    default: []
  },
})

const i18n = useI18n();

const emit = defineEmits(['add']);

const image = ref('');
const file = ref(null);
const options = ref(null);
const form = ref({
  albumId: ''
});

function onClose() {
  image.value = '';
  setModal('');
}

function onUploadImage() {
  file.value.click();
}

async function handleUpload() {
  const { fileNames } = await uploadPhoto(image.value, form.value.albumId);
  if (fileNames.length !== 0) {
    emit('add', { id: form.value.albumId, file: fileNames[0] });
    successStore.show();
    onClose();
  }
}

function fileOnChange(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file, 'UTF-8');
  const maxWidth = 500;
  const maxHeight = 500;
  reader.onload = async (readerEvent) => {
    const img = new Image();
    img.src = readerEvent.target.result;
    img.onload = async () => {
      const box = await spiderman.faceApi.detectFaceAndGetHeadBox(img);
      if (!box) {
        errorStore.show({ error: { message: i18n.t('NoFace') }});
        return;
      }
      const minRes = box.width < 500 || box.height < 500;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (minRes) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
      } else {
        canvas.width = 500;
        canvas.height = 500;
        ctx.drawImage(img, box.x, box.y, box.width, box.height, 0, 0, 500, 500);
      }
      
      const imgUrl = canvas.toDataURL('image/jpeg');
      image.value = imgUrl;
      return;
      if (file.size > maxWidth * maxHeight) {
        let width = img.width;
        let height = img.height;
        if (width / maxWidth > height / maxHeight) {
            width = maxWidth;
            height = (img.height * maxWidth) / img.width;
        } else {
            height = maxHeight;
            width = (img.width * maxHeight) / img.height;
        }
        
        // 创建一个新 Canvas 元素来绘制调整大小后的图片
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // 将 Canvas 上的图像转换为 Base64 数据URL
        const resizedImageDataUrl = canvas.toDataURL('image/jpeg');

        // 在预览中显示调整大小后的图片
        image.value = resizedImageDataUrl;
      } else image.value = readerEvent.target.result;
    }
  };
}

onMounted(() => {
  options.value = props.list.reduce((obj, album) => {
    const tmp = obj;

    tmp[album.albumName] = album.albumId;
    return tmp;
  }, {});

  form.value.albumId = props.list[0].albumId;
})
</script>