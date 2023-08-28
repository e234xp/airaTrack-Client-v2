<template>
  <MobileProgressBarLayout>
    <FullLayout>
      <template #header>
      </template>

      <template #grow>
        <div class="grid content-start text-white text-xl mx-6 mt-5">
          Step1: Select a photo in your phone
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

        <div class="grid content-start text-white text-xl mx-6 mt-5">
          Step2: Upload to airaTrack
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
  import {
    onUnmounted, ref, watch,
  } from 'vue';
  import { storeToRefs } from 'pinia';
  import spiderman from '@/spiderman';

  import useUserStore from '@/stores/user';
  // import useDevices from '@/stores/devices';

  import useStore from '@/modules/target/stores/index';

  import * as faceapi from "face-api.js";
  faceapi.nets.tinyFaceDetector.loadFromUri("/models");

  const userStore = useUserStore();
  const { sessionId } = storeToRefs(userStore);

  let value_imageB64 = ref('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAACXBIWXMAAAsSAAALEgHS3X78AAAADUlEQVR4nGP4//8/AwAI/AL+p5qgoAAAAABJRU5ErkJggg==');
  let flag_faceDetected = ref(false);
  let flag_faceDetectedFail = ref('');
  let flag_faceUploadSuccess= ref('');

  let flag_aaa = ref('');


  function clickOnPickUploadPhoto() {
    const self = this;
    const input = document.getElementById("fileSelecter");
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
    const self = this;
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
    reader.onload = async (readerEvent) => {
      value_imageB64.value = readerEvent.target.result;
      const img = document.createElement("img");
      img.src = readerEvent.target.result;

      faceDetectionOnPhoto(img);
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


    const data = {
      face_image: value_imageB64.value
    };
    const result = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/uploadPhoto`,
      method: 'post',
      headers: { sessionId: sessionId.value },
      data,
    });

    flag_faceUploadSuccess.value = 'upload successfully!';

    console.log(result);
  }
</script>