<template>
  <MobileProgressBarLayout>
    <FullLayout>
      <template #header>
      </template>

      <template #grow>
        <div class="grid content-start text-white text-xl mx-6 mt-5">
          {{ $t('MobileUploadStep1') }}
        </div>
        {{flag_aaa}}
        <input type="file" id="fileSelecter" accept="image/*" @change="fileOnChange" style="display: none;" />
        <AppButton type="secondary" class="mx-6 my-3 py-3" @click="clickOnPickUploadPhoto()">
          {{ $t("Select") }}
        </AppButton>
        <div class="grid justify-center content-center">
          <img class="mx-6 my-8" :src="spiderman.base64Image.getUnknowSrc(value_imageB64)"
            style='width: 300px; height: 300px;' />
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
          <span class="grid justify-center content-center text-green-600">{{ flag_faceUploadSuccess }}</span>
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
          value_imageB64.value = resizedImageDataUrl;
        } else value_imageB64.value = readerEvent.target.result;
        faceDetectionOnPhoto(img);
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

  // async function detectFaceAndGetHeadBox(img, cb) {
  //   try {
  //     flag_aaa.value += faceapi == undefined;
  //   }
  //   catch( ex) {
  //     flag_aaa.value += ex.message;
  //   }

  //   const detection = null;
  //   try {
  //     detection = await faceapi.detectSingleFace(
  //       img,
  //       new faceapi.TinyFaceDetectorOptions()
  //     );
  //   }
  //   catch( ex) {
  //     flag_aaa.value += ex.message;
  //   }

  //   return new Promise((resolve) => {
  //     let box = null;
  //     if (detection) {
  //       let rangeRatio = 2;
  //       let headWidthToHunt =
  //         (detection.box.width < detection.box.height
  //           ? detection.box.width
  //           : detection.box.height) * rangeRatio;
  //       let headX = detection.box.x - detection.box.height / 2;
  //       let headY = detection.box.y - detection.box.height / 1.2;
  //       if (headX < 0) headX = 0;
  //       if (headY < 0) headY = 0;
  //       while (
  //         headWidthToHunt + headX > img.width ||
  //         headWidthToHunt + headY > img.height
  //       ) {
  //         headWidthToHunt--;
  //       }

  //       box = {
  //         x: headX,
  //         y: headY,
  //         width: headWidthToHunt,
  //         height: headWidthToHunt,
  //       };
  //     }
  //     if (cb) cb(box);
  //     resolve(box);
  //   });
  // }

  async function clickOnPhotoUpload() {

    const result = await uploadPhoto(value_imageB64.value, form.value.albumId);

    flag_faceUploadSuccess.value = 'upload successfully!';

    console.log(result);
  }
</script>