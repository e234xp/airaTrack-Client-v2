<template>
  <ProgressBarLayout>
    <div class="w-full h-full flex justify-center">
      <div class="w-1/6 my-4 gap-4 border rounded border-dashed border-white/80">
        <div style="width: calc(50% - 1rem);" class="float-left m-2" @drop="drop(idx)" @dragover.prevent @dragenter.prevent v-for="(item, idx) in alternate">
          <div class="relative" style="padding-top: 100%">
            <img :src="spiderman.base64Image.getSrc(item.image)" class="absolute top-0 left-0 w-full h-full" >
            <div class="selected-button hover:bg-primary/80 hover:text-black/80" draggable="true" @dragstart="drag(idx)" v-if="selectedImage.indexOf(idx) >= 0">{{ selectedImage.indexOf(idx) + 1 }}</div>  
          </div>
        </div>
      </div>
      <div class="w-3/5 py-6 px-16">
        <div class="flex gap-4 h-1/2">
          <div class="flex relative w-full justify-center bg-black">
            <div class="relative" v-if="alternate[selectedImage[0]]">
              <img :src="spiderman.base64Image.getSrc(alternate[selectedImage[0]].image)" class="w-auto h-full">
              <!-- <div class="absolute bg-black/20 border-2 border-primary" :style="imgStyle[0]" v-if="imgStyle[0]"></div> -->
            </div>
          </div>
          <div class="flex relative w-full justify-center bg-black">
            <div class="relative" v-if="alternate[selectedImage[1]]">
              <img :src="spiderman.base64Image.getSrc(alternate[selectedImage[1]].image)" class="w-auto h-full">
              <!-- <div class="absolute bg-black/20 border-2 border-primary" :style="imgStyle[1]" v-if="imgStyle[1]"></div> -->
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-8">
          <AppButton :type="'primary'" class="px-16" @click="onCompare">
            Compare
          </AppButton>
        </div>
        <div class="text-8xl text-center mt-8 text-primary">{{ parseScore(resultScore) }}</div>
      </div>
    </div>
  </ProgressBarLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import useDebug from '@/stores/debug';

const debugStore = useDebug();
const { alternate } = storeToRefs(debugStore);
const { getImageCompare, compareFeature }  = debugStore;

const selectedImage = ref([0, 1]);
const tempIdx = ref(-1);
const resultScore = ref(-1);
const imgStyle = ref([]);

function parseScore(val) {
  return val < 0 ? '--' : (val).toFixed(2);
}

function drag(idx) {
  tempIdx.value = selectedImage.value.indexOf(idx);
}

function drop(idx) {
  if (selectedImage.value.indexOf(idx) >= 0) return;
  imgStyle.value[tempIdx.value] = undefined;
  resultScore.value = -1;
  selectedImage.value[tempIdx.value] = idx;
}

async function onCompare() {
  const score = compareFeature(selectedImage.value.map((idx) => alternate.value[idx].feature));
  resultScore.value = score;
}

// async function onCompare() {
//   const { face_1, face_2, score } = await getImageCompare(selectedImage.value.map((idx) => alternate.value[idx]));
//   resultScore.value = score;
//   const faceResult = [face_1, face_2];
//   selectedImage.value.map((idx) => alternate.value[idx]).forEach((img, idx) => {
//     if (Object.keys(faceResult[idx]).length !== 0) {
//       const b64 = spiderman.base64Image.getSrc(img);
//       const image = new Image();
//       image.onload = () => {
//         imgStyle.value[idx] = {
//           top: `${((faceResult[idx].y / image.height) * 100)}%`,
//           left: `${((faceResult[idx].x / image.width) * 100)}%`,
//           width: `${((faceResult[idx].width / image.width) * 100)}%`,
//           height: `${((faceResult[idx].height / image.height) * 100)}%`
//         }
//       }
//       image.src = b64;
//     }
//   })
// }

</script>

<style>
.selected-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  width: 60%;
  height: 60%;
  cursor: pointer;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  font-size: 3rem;
  justify-content: center;
  align-items: center;
}
</style>