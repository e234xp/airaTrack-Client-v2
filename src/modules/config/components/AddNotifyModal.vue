<template>
    <ModalLayout :is-open="modal === 'add-notify'" @close="setModal('')" >
      <template #header>
        {{ $t('AddNotify') }}
      </template>
  
      <template #description>
        {{ stepDescription }}
      </template>
  
      <template #default>
        <div v-if="currentStep === 1">
            <!-- 事件名稱 -->
            <AppLabel :label="$t('EventName')">
                <input v-model="eventName" type="text" placeholder="請輸入事件名稱" class="mt-2 w-full p-2 border rounded" />
            </AppLabel>

            <!-- 事件類別 -->
            <AppLabel :label="$t('EventType')" class="mt-2">
                <select v-model="eventType" class="mt-2 w-full p-2 border rounded">
                    <option value="http">HTTP</option>
                    <option value="mail">Mail</option>
                    <option value="line">Line</option>
                    <option value="telegram">Telegram</option>
                </select>
            </AppLabel>

            <!-- 相簿 -->
            <AppLabel :label="$t('Album')" class="mt-2">
                <select v-model="albumType" class="mt-2 w-full p-2 border rounded">
                    <option value="staff">Staff</option>
                    <option value="watchlist">Watchlist</option>
                    <option value="vip">VIP</option>
                    <option value="suspect">Suspect</option>
                    <option value="album">Album</option>
                </select>
            </AppLabel>

            <!-- 備註 -->
            <AppLabel :label="$t('EventNote')" class="mt-2">
                <textarea v-model="eventNote" placeholder="請輸入備註" class="mt-2 w-full p-2 border rounded"></textarea>
            </AppLabel>
        </div>
        
        <div v-if="currentStep === 2" class="flex flex-col gap-4">
            <!-- HTTP 事件類型 -->
            <template v-if="eventType === 'http'">
                <v-container>
                    <!-- ✅ 第一區塊：基本連線設定 -->
                    <v-row>
                        <v-col cols="6">
                            <!-- 主機位址 -->
                            <AppLabel :label="$t('HostAddress')">
                                <input v-model="httpConfig.host" type="text" class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 啟用 SSL -->
                            <AppLabel :label="$t('EnableSSL')">
                                <v-switch v-model="httpConfig.ssl" inset color="info"></v-switch>
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 帳號 -->
                            <AppLabel :label="$t('Username')">
                                <input v-model="httpConfig.username" type="text" class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 密碼 -->
                            <AppLabel :label="$t('Password')">
                                <input v-model="httpConfig.password" type="password" class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 埠號 -->
                            <AppLabel :label="$t('Port')">
                                <input v-model="httpConfig.port" type="text"  class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- API Path -->
                            <AppLabel :label="$t('Path')">
                                <input v-model="httpConfig.path" type="text" class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="12">
                            <!-- 顯示url -->
                            <AppLabel :label="$t('ShowCompleteUrl')">
                                <input v-model="httpConfig.completeUrl" type="text" class="w-full p-2 border rounded" readonly />
                            </AppLabel>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <!-- ✅ 第二區塊：API 設定 -->
                    <v-row>
                        <v-col cols="12">
                            <!-- 方法 -->
                            <AppLabel :label="$t('Method')">
                                <select v-model="httpConfig.method" class="mt-2 w-full p-2 border rounded">
                                    <option value="GET">GET</option>
                                    <option value="POST">POST</option>
                                </select>
                            </AppLabel>
                        </v-col>
                        <v-col cols="3">
                            <!-- 欄位名稱 -->
                            <AppLabel :label="$t('FieldName')">
                                <input v-model="httpConfig.fieldName" type="text" class="w-full p-2 border rounded" />
                            </AppLabel>
                        </v-col>
                        <v-col cols="3">
                            <!-- 欄位值 -->
                            <AppLabel :label="$t('FieldData')">
                                <select v-model="httpConfig.fieldData" class="w-full p-2 border rounded">
                                    <option value="channel">channel</option>
                                    <option value="time">time</option>
                                    <option value="albumn">albumn</option>
                                </select>
                            </AppLabel>
                        </v-col>
                        <v-col cols="3" class="d-flex align-center justify-center">
                            <AppLabel :label="$t('Add')" class="text-center">
                            <v-btn color="primary" @click="addToUrlParams" 
                            :disabled="!httpConfig.fieldName || !httpConfig.fieldData">
                                <v-icon>mdi-plus</v-icon>
                                </v-btn>
                            </AppLabel>
                        </v-col>
                        <v-col cols="3" v-if="httpConfig.method === 'POST'" class="d-flex align-center justify-center">
                            <!-- JSON / XML 切換 -->
                            <AppLabel :label="selectedFormatLabel" class="text-center">
                            <v-btn-toggle v-model="httpConfig.dataFormat" dense color="primary">
                                <v-btn value="JSON">JSON</v-btn>
                                <v-btn value="XML">XML</v-btn>
                            </v-btn-toggle>
                            </AppLabel>
                        </v-col>
                        <v-col cols="12">
                            <!-- URL 參數 -->
                            <AppLabel :label="httpConfig.method === 'GET' ? $t('URLParameters') : $t('Body')">
                                <textarea v-model="httpConfig.urlParams" class="w-full p-2 border rounded" rows="3"></textarea>
                            </AppLabel>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <!-- ✅ 第三區塊：擴充欄位 -->
                    <v-row>
                        <v-col cols="12">
                            <!-- 擴充欄位 -->
                            <AppLabel :label="$t('ExtraFields')">
                                <textarea v-model="httpConfig.extraFields" class="w-full p-2 border rounded" rows="3"></textarea>
                            </AppLabel>
                        </v-col>
                    </v-row>
                </v-container>
            </template>
        </div>

  
        <div v-if="currentStep === 3">
                
            </div>

        <div v-if="currentStep === 4">
          
        </div>
      </template>
  
      <template #footer>
        <div class="flex justify-between w-full">
          <AppButton v-if="currentStep > 1" type="secondary" class="px-6" @click="prevStep">
            {{ $t('Previous') }}
          </AppButton>
  
          <AppButton v-if="currentStep < 4" type="primary" class="px-6" @click="nextStep">
            {{ $t('Next') }}
          </AppButton>
  
          <AppButton v-if="currentStep === 4" type="primary" class="px-6" @click="onSaveMap">
            {{ $t('Save') }}
          </AppButton>
        </div>
      </template>
    </ModalLayout>
  </template>
  
  <script setup>
  import { ref, computed ,watch} from 'vue';
  

  

  const modal = ref('');
  const currentStep = ref(1);

const eventName = ref('');
const eventType = ref('http'); // 預設值
const albumType = ref('staff'); // 預設值
const eventNote = ref('');
 
// HTTP 設定
const httpConfig = ref({
    host: '',
    ssl: false,
    username: '',
    password: '',
    port: '',
    path: '',
    completeUrl:'',
    urlParams: '',
    extraFields: '',
    dataFormat:'JSON',
});

// Mail 設定
const mailConfig = ref({
    recipient: '',
    subject: '',
    body: ''
});

// LINE 設定
const lineConfig = ref({
    token: '',
    message: ''
});

// Telegram 設定
const telegramConfig = ref({
    chatId: '',
    message: ''
});

// 監聽 eventType，當切換時清空對應的欄位
watch(eventType, (newType) => {
    if (newType === 'http') {
        httpConfig.value = { host: '', ssl: false, username: '', password: '', port: 7002, path: '/api/createEvent', urlParams: '', extraFields: '' };
    } else if (newType === 'mail') {
        mailConfig.value = { recipient: '', subject: '', body: '' };
    } else if (newType === 'line') {
        lineConfig.value = { token: '', message: '' };
    } else if (newType === 'telegram') {
        telegramConfig.value = { chatId: '', message: '' };
    }
});

 

  const stepDescription = computed(() => {
    switch (currentStep.value) {
      case 1: return '輸入事件資訊';
      case 2: return '輸入通知資訊';
      case 3: return '選擇排程';
      case 4: return '完成';
      default: return '';
    }
  });


  // **根據 JSON/XML 選擇變更 Label**
const selectedFormatLabel = computed(() => {
  return httpConfig.value.dataFormat === "JSON" ? "JSON" : "XML";
});
  

// **監聽 `method` 變化，當切換 GET/POST 時清空 urlParams**
watch(() => httpConfig.value.method, () => {
  httpConfig.value.urlParams = "";
  httpConfig.value.completeUrl = "";
});

// **監聽 `dataFormat` 變化，當切換 JSON/XML 時清空 urlParams**
watch(() => httpConfig.value.dataFormat, () => {
  httpConfig.value.urlParams = "";
});

// **重設所有表單數據**
function resetForm() {
  mapName.value = '';
  mapImage.value = null;
  selectedLiveCameras.value = [];
  selectedArchiveCameras.value = [];
  currentStep.value = 1;
}


function setModal(val) {
  if (val === '') {
    modal.value = val;
  }
  modal.value = val;
}



  function nextStep() {
    if (currentStep.value < 4) currentStep.value++;
  }
  
  function prevStep() {
    if (currentStep.value > 1) currentStep.value--;
  }

  function addToUrlParams() {
  if (httpConfig.value.method === "GET") {
    // 確保有欄位名稱和欄位值
    if (!httpConfig.value.fieldName || !httpConfig.value.fieldData) return;

    // 格式化 GET 參數
    const newParam = `&${httpConfig.value.fieldName}=##${httpConfig.value.fieldData}##`;

    // 檢查是否已經存在
    if (!httpConfig.value.urlParams.includes(newParam)) {
      httpConfig.value.urlParams += newParam;
    }
    // 更新完整 URL
    updateCompleteUrl();
    // 清空輸入欄位
    httpConfig.value.fieldName = "";
    httpConfig.value.fieldData = "";
  } else if(httpConfig.value.method === "POST") {
    let newField = "";

    if (httpConfig.value.dataFormat === "JSON") {
      // 產生 JSON 格式
      newField = `"${httpConfig.value.fieldName}": "##${httpConfig.value.fieldData}##",`;
    } else if (httpConfig.value.dataFormat === "XML") {
      // 產生 XML 格式
      newField = `<${httpConfig.value.fieldName}>##${httpConfig.value.fieldData}##</${httpConfig.value.fieldName}>\n`;
    }

    // 避免重複新增相同參數
    if (!httpConfig.value.urlParams.includes(newField)) {
      httpConfig.value.urlParams += httpConfig.value.urlParams ? `\n${newField}` : newField;
    }

    // 清空輸入欄位
    httpConfig.value.fieldName = "";
    httpConfig.value.fieldData = "";
  }
}


// **動態更新完整 URL**
function updateCompleteUrl() {
  const basePath = httpConfig.value.path.startsWith("/") ? httpConfig.value.path : `/${httpConfig.value.path}`;
  httpConfig.value.completeUrl = `${basePath}${httpConfig.value.urlParams ? "?" + httpConfig.value.urlParams : ""}`;
}

// **監聽 URL 參數變化，自動更新完整 URL**
watch(() => httpConfig.value.path, updateCompleteUrl);





function onSaveMap() {

 

    console.log("🚀 Sending data to backend:", saveData);

    // 這裡你可以將 `saveData` 傳給 API
    // axios.post('/api/save-map', saveData).then(...).catch(...);

    resetForm(); // 儲存後清空表單
    setModal('');
}

    // 🔥 這一行很重要！讓父組件可以呼叫 setModal()
    defineExpose({ setModal });
  </script>
  
  
<style>

</style>

