<template>
  <MobileProgressBarLayout>
    <FullLayout>
      <template #header>
      </template>

      <template #grow>
        <div class="grid content-start text-white text-xl mx-6 mt-5">
          {{ $t('MobileUploadStep1') }}
        </div>
        <!-- {{flag_aaa}} -->
        <input type="file" id="fileSelecter" accept="image/*" @change="fileOnChange" style="display: none;" />
        <AppButton type="secondary" class="mx-6 my-3 py-3" @click="clickOnPickUploadPhoto()">
          {{ $t("Select") }}
        </AppButton>
        <div class="grid justify-center content-center">
          <img class="mx-6 my-8" :src="spiderman.base64Image.getUnknowSrc(value_imageB64)"
            style='width: 300px; height: 300px; object-fit: contain;' />
          <span class="grid justify-center content-center text-red-600">{{ flag_faceDetectedFail }}</span>
        </div>

        <AppLabel class="mx-6" :label="$t('Album')">
          <AppInput
            dark
            type="select"
            :options="options"
            v-model:modelInput="form.albumId"
          />
        </AppLabel>

        <div class="grid content-start text-white text-xl mx-6 mt-5">
          {{ $t('MobileUploadStep2') }}
          <!-- <span class="grid justify-center content-center text-green-600">{{ flag_faceUploadSuccess }}</span> -->
        </div>

        <AppButton type="secondary" class="mx-6 my-3 py-3" :isEnable=flag_faceDetected @click="clickOnPhotoUpload()">
          {{ $t("Upload") }}
        </AppButton>
      </template>
    </FullLayout>
  </MobileProgressBarLayout>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import spiderman from '@/spiderman';
  // import useDevices from '@/stores/devices';

  import useAlbums from '@/stores/albums';
  import useStore from '@/modules/uploadMobile/stores/index';
  import { useI18n } from 'vue-i18n';

  import successStore from '@/components/AppSuccess/success';
  import errorStore from '@/components/AppError/error';

  import * as faceapi from 'face-api.js';

  faceapi.nets.tinyFaceDetector.loadFromUri('/models');

  const store = useStore();
  const { uploadPhoto } = store;

  const albumsStore = useAlbums();
  const { albums } = storeToRefs(albumsStore);

  let value_imageB64 = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsSAAALEgHS3X78AAAADUlEQVR4nGP4//8/AwAI/AL+p5qgoAAAAABJRU5ErkJggg==');
  let flag_faceDetected = ref(false);
  let flag_faceDetectedFail = ref('');
  let flag_faceUploadSuccess= ref('');

  let flag_aaa = ref('');

  const options = ref(null);
  const form = ref({
    albumId: ''
  });

  const i18n = useI18n();

  onMounted(async () => {
    options.value = albums.value.reduce((obj, album) => {
      const tmp = obj;

      tmp[album.albumName] = album.albumId;
      return tmp;
    }, {});

    form.value.albumId = albums.value[0].albumId;
  });



  function clickOnPickUploadPhoto() {
    const input = document.getElementById('fileSelecter');
    input.click();

    // self.selectPhotoFromFile(function (img) {
    //   if (img) {
    //     self.detectFaceAndGetHeadBox(img, function (box) {
    //       flag_aaa.value += JSON.stringify(box);

    //       console.log("detectFaceAndGetHeadBox", box);
    //       if (box) {
    //         flag_faceDetected.value = true;
    //         flag_faceDetectedFail.value = '';
    //       }
    //       else {
    //         flag_faceDetected.value = false;
    //         flag_faceDetectedFail.value = 'Cannot find face in the photo';
    //       }
    //     });
    //   }
    // });
  }

  function selectPhotoFromFile(cb) {
    flag_aaa.value += "2";

    // const input = document.createElement("input");
    // input.type = "file";
    // input.accept = "image/*";

    const input = document.getElementById("fileSelecter");

    flag_aaa.value += "3";

    input.onclick = function (e) {
      flag_aaa.value += "4";
      flag_aaa.value += ("||" + e.target.value.length + "||");

      if (e.target.value.length == 0) {
        if (cb) cb(null);
      }
    };


    flag_aaa.value += "5";

    // input.onchange = function (e) {
    //   flag_aaa.value += "6";

    //   const file = e.target.files[0];
    //   flag_aaa.value += "61";
    //   const reader = new FileReader();
    //   flag_aaa.value += "62";
    //   reader.readAsDataURL(file, "UTF-8");
    //   flag_aaa.value += "63";
    //   reader.onload = async (readerEvent) => {
    //     flag_aaa.value += "64";
    //     flag_aaa.value += "7";
    //     value_imageB64.value = readerEvent.target.result;
    //     flag_aaa.value += "71";
    //     const img = document.createElement("img");
    //     flag_aaa.value += "72";
    //     img.src = readerEvent.target.result;
    //     flag_aaa.value += "73";
    //     flag_aaa.value += "8";

    //     if (cb) cb(img);
    //   };
    // };
    flag_aaa.value += "9";

    input.click();
  }

  function fileOnChange(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file, "UTF-8");
    const maxWidth = 500;
    const maxHeight = 500;
    reader.onload = async (readerEvent) => {
      // value_imageB64.value = readerEvent.target.result;
      // const img = document.createElement("img");
      const img = new Image();
      img.src = readerEvent.target.result;
      img.onload = () => {
        EXIF.getData(img, async function() {
          try {
            const isPortrait = img.height > img.width;
         
            // alert(JSON.stringify(EXIF.getAllTags(this)));
          const orientation = EXIF.getTag(this, 'Orientation');
          const make = EXIF.getTag(this, 'Make');
          const model = EXIF.getTag(this, 'Model');
          // alert(orientation);
          // alert(make);
          // alert(model);
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
          value_imageB64.value = imgUrl;
          faceDetectionOnPhoto(img);
          return;
          
          if (isPortrait) {
              // 橫放
              canvas.width = img.width;
              canvas.height = img.height;
          } else {
              // 直放
              canvas.width = img.height;
              canvas.height = img.width;
          }
          if (orientation && orientation !== 1 && false) {
            // canvas.width = img.height;
            // canvas.height = img.width;
            if (orientation === 6) {
              ctx.rotate(Math.PI / 2);
              ctx.drawImage(img, 0, -canvas.width);
            } else if (orientation === 8) {
              ctx.rotate(-Math.PI / 2);
              ctx.drawImage(img, -canvas.height, 0);
            } else if (orientation === 3) {
              ctx.rotate(Math.PI);
              ctx.drawImage(img, -canvas.width, -canvas.height);
            } else {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            }
          } else {
            // canvas.width = img.width;
            // canvas.height = img.height;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          }
        
          const resizedCanvas = document.createElement('canvas');
          const resizedCtx = resizedCanvas.getContext('2d');
          let width = canvas.width;
          let height = canvas.height;
          if (file.size > maxWidth * maxHeight) {
            //     var targetWidth = 300; // 你想要的寬度
            //     var targetHeight = (canvas.height / canvas.width) * targetWidth;
            //     resizedCanvas.width = targetWidth;
            //     resizedCanvas.height = targetHeight;
            //     resizedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, targetWidth, targetHeight);
            if (width / maxWidth > height / maxHeight) {
              width = maxWidth;
              height = (img.height * maxWidth) / img.width;
            } else {
              height = maxHeight;
              width = (img.width * maxHeight) / img.height;
            }
            
            // 创建一个新 Canvas 元素来绘制调整大小后的图片
            // const canvas = document.createElement('canvas');
            // canvas.width = width;
            // canvas.height = height;
            // const ctx = canvas.getContext('2d');
            

            // 将 Canvas 上的图像转换为 Base64 数据URL
            

            // 在预览中显示调整大小后的图片
          }

          resizedCanvas.width = width;
          resizedCanvas.height = height;
          resizedCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);
          const resizedImageDataUrl = resizedCanvas.toDataURL('image/jpeg');
          value_imageB64.value = resizedImageDataUrl;
          faceDetectionOnPhoto(img);
          } catch (error) {
            alert(error);
          }
          
          
        });
      }
    };
  }

  function faceDetectionOnPhoto(img) {
    if (img) {
      flag_faceDetected.value = true;

      // detectFaceAndGetHeadBox(img, function (box) {
      //   flag_aaa.value += JSON.stringify(box);

      //   console.log("detectFaceAndGetHeadBox", box);
      //   if (box) {
      //     flag_faceDetected.value = true;
      //     flag_faceDetectedFail.value = '';
      //   }
      //   else {
      //     flag_faceDetected.value = false;
      //     flag_faceDetectedFail.value = 'Cannot find face in the photo';
      //   }
      // });
    }
  }

  async function clickOnPhotoUpload() {

    const result = await uploadPhoto(value_imageB64.value, form.value.albumId);

    if (result) {
      successStore.show('UploadSuccess');
    }
    // flag_faceUploadSuccess.value = 'upload successfully!';
  }
</script>