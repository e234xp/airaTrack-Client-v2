import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';

import useUserStore from '@/stores/user';
import errorStore from '@/components/AppError/error';

function featureToFArray(feature) {
  const blob = atob(feature);
  const fLen = blob.length / Float32Array.BYTES_PER_ELEMENT;
  const dView = new DataView(new ArrayBuffer(Float32Array.BYTES_PER_ELEMENT));
  let p = 0;

  let fb1024 = new Float32Array(fLen);

  for (var j = 0; j < fLen; j++) {
      p = j * 4;
      dView.setUint8(0, blob.charCodeAt(p));
      dView.setUint8(1, blob.charCodeAt(p + 1));
      dView.setUint8(2, blob.charCodeAt(p + 2));
      dView.setUint8(3, blob.charCodeAt(p + 3));
      fb1024[j] = dView.getFloat32(0, true);
  }

  return fb1024;
}

const cvt_table = [
  -0.090277, -0.063323, -0.045445, -0.031580, -0.020042, -0.010042, -0.001141, 0.006930, 0.014348, 0.021240,
  0.027696, 0.033784, 0.039558, 0.045059, 0.050322, 0.055372, 0.060235, 0.064929, 0.069471, 0.073874,
  0.078151, 0.082313, 0.086368, 0.090324, 0.094189, 0.097970, 0.101671, 0.105299, 0.108858, 0.112353,
  0.115787, 0.119162, 0.122485, 0.125756, 0.128978, 0.132155, 0.135288, 0.138379, 0.141430, 0.144443,
  0.147422, 0.150365, 0.153276, 0.156154, 0.159002, 0.161823, 0.164615, 0.167380, 0.170117, 0.172832,
  0.175521, 0.178187, 0.180830, 0.183452, 0.186051, 0.188633, 0.191196, 0.193739, 0.196267, 0.198773,
  0.206189, 0.213458, 0.220590, 0.227596, 0.234485, 0.241261, 0.247937, 0.254496, 0.260966, 0.267341,
  0.279800, 0.291923, 0.303744, 0.315257, 0.326477, 0.337377, 0.347929, 0.358336, 0.368483, 0.378116,
  0.387653, 0.396991, 0.406150, 0.415052, 0.423489, 0.432122, 0.440663, 0.448470, 0.456475, 0.463655,
  0.475686, 0.484126, 0.492125, 0.503352, 0.551597, 0.560454, 0.58, 0.60, 0.62, 0.64,
  1.0//1065353216
];

export default defineStore('debug', () => {
  const alternate = ref([]);
  const testMode = ref(false);

  function setTestMode(val) {
    testMode.value = val;
  }

  function setAlternate(val) {
    if (alternate.value.length >= 10) {
      alternate.value.pop();
      alternate.value.splice(0, 0, val);
    } else alternate.value.splice(0, 0, val);
  }

  async function getImageCompare(list) {
    const userStore = useUserStore();
    const { result } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/imagecompare`,
      method: 'post',
      headers: { sessionId: userStore.sessionId },
      data: {
        face_image_1: list[0],
        face_image_2: list[1]
      }
    })

    return result;
  }

  function compareFeature(list) {
    const fb1024Result = list.map((feature) => {
      return featureToFArray(feature);
    })

    let score = 0.0;
    const float1 = fb1024Result[0];
    const float2 = fb1024Result[1];
    if (float1.length != float2.length) {
      errorStore.show({error: { message: 'feature length not equal' }});
      return score;
    }

    let v9 = 0.0;
    for (let k = 0; k < float1.length; k++) {
        v9 = v9 + (float1[k] * float1[k]);
    }

    let v11 = 0.0;
    for (let k = 0; k < float2.length; k++) {
        v11 = v11 + (float2[k] * float2[k]);
    }

    let v14 = 0, v15 = 1;
    if (v11 != 0.0) v15 = 0;
    if (v9 == 0.0) v14 = 1;

    let v17 = 0.0, v18 = 0.0;
    if (!v15) {
      if (!v14) {
        var a1 = float1;
        var a3 = float2;

        for (let k = 1; k < a1.length; k++) {
            v18 = (a1[k] * a3[k]);
            v17 = v17 + v18;
        }

        score = v17 / Math.sqrt(v9 * v11);

        var v2, v3, v4;
        var v1 = score;

        if (score < 1.0) {
          v2 = 100;

          while (v2 > 0) {
            v4 = v2 - 1;
            v3 = cvt_table[v4];

            if (v1 >= v3) {
              score = ((score - v3) / (cvt_table[v2] - v3)) * 0.01 + 0.01 * v4;
              if (score < 0) score = 0.01;
              break;
            }
            v2 = v4;
          }
        }
      } else score = 0.0;
    } else if (v14) score = 1.0;
    return score;
  }

  return {
    testMode,
    setTestMode,

    alternate,
    setAlternate,
    getImageCompare,
    compareFeature
  };
})