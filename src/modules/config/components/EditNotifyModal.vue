<template>
<ModalLayout :is-open="modal === 'edit-notify'" @close="setModal('')">
    <template #header>
        {{ $t('EditNotify') }}
      </template>
  
      <template #description>
        {{ stepDescription }}
      </template>
  
      <template #default>
        <div v-if="currentStep === 1">
          <v-container>
            <v-row>
              <v-col cols="6">
                <!-- 事件名稱 -->
                <AppLabel :label="$t('EventName')" class="mt-2">
                    <AppInput v-model:modelInput="eventName" placeholder="請輸入事件名稱" class="mb-4" dark />
                    <p v-if="errors.eventName" class="text-red-500 text-sm mt-1">{{ errors.eventName }}</p>
                </AppLabel>
              </v-col>
              <v-col cols="6">
                  <!-- 事件類別 -->
                  <AppLabel :label="$t('EventType')" class="mt-2">
                    <AppInput
                    type="select"
                    class="mb-4"
                    :options="eventTypeOptions"
                    v-model:modelInput="eventType"
                    dark
                    :disabled="true"
                  />
                  <p v-if="errors.eventType" class="text-red-500 text-sm mt-1">{{ errors.eventType }}</p>
                  </AppLabel>
            </v-col>
            <v-col cols="6">
            <!-- 相簿多選 -->
            <AppLabel :label="$t('Album')" class="mt-2">
                <div class="mt-2 w-full p-2 border rounded border-general">
                    <div v-for="album in albums" :key="album.albumId" class="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            :value="album.albumId" 
                            v-model="selectedAlbums" 
                            class="w-4 h-4"
                        />
                        <label>{{ album.albumName}}</label>
                    </div>
                </div>
                <p v-if="errors.selectedAlbums" class="text-red-500 text-sm mt-1">{{ errors.selectedAlbums }}</p>
            </AppLabel>
          </v-col>
          <v-col cols="6">
            <!-- 相簿多選 -->
            <AppLabel :label="$t('LiveChannel')" class="mt-2">
                <div class="mt-2 w-full p-2 border rounded border-general">
                    <div v-for="device in devices" :key="device.camera_id" class="flex items-center space-x-2">
                        <input 
                            type="checkbox" 
                            :value="device.camera_id" 
                            v-model="selectedDeviceds" 
                            class="w-4 h-4"
                        />
                        <label>{{ device.name}}</label>
                    </div>
                </div>
                <p v-if="errors.selectedDeviceds" class="text-red-500 text-sm mt-1">{{ errors.selectedDeviceds }}</p>
            </AppLabel>
          </v-col>
          <v-col cols="12">
            <!-- 備註 -->
            <AppLabel :label="$t('EventNote')" class="mt-2">
                <textarea v-model="eventNote" placeholder="請輸入備註" class="mt-2 w-full p-2 border rounded border-general"></textarea>
            </AppLabel>
          </v-col>
          </v-row>
          </v-container>
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
                                <AppInput v-model:modelInput="httpConfig.host" 
                                @valid="val => httpValid.host = val" 
                                placeholder="請輸入主機位址"  dark :hasSubmitted="hasSubmitted" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 啟用 SSL -->
                            <AppLabel :label="$t('EnableSSL')">
                                <v-switch v-model="httpConfig.https" inset color="info"></v-switch>
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 帳號 -->
                            <AppLabel :label="$t('Username')">
                                <AppInput v-model:modelInput="httpConfig.user" 
                                @valid="val => httpValid.user = val" 
                                placeholder="請輸入帳號"  dark :hasSubmitted="hasSubmitted" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 密碼 -->
                            <AppLabel :label="$t('Password')">
                                <AppInput v-model:modelInput="httpConfig.pass" 
                                @valid="val => httpValid.pass = val" 
                                placeholder="請輸入密碼"  dark :hasSubmitted="hasSubmitted" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 埠號 -->
                            <AppLabel :label="$t('Port')">
                                <AppInput v-model:modelInput="httpConfig.port" 
                                @valid="val => httpValid.port = val" 
                                 dark :hasSubmitted="hasSubmitted" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- API Path -->
                            <AppLabel :label="$t('Path')">
                                <AppInput v-model:modelInput="httpConfig.url" 
                                @valid="val => httpValid.url = val" 
                                 dark :hasSubmitted="hasSubmitted" />
                            </AppLabel>
                        </v-col>

                        <v-col cols="12">
                            <!-- 顯示url -->
                            <AppLabel :label="$t('ShowCompleteUrl')">
                                <input v-model="httpConfig.completeUrl" type="text" class="w-full p-2 border rounded border-general" readonly />
                            </AppLabel>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <!-- ✅ 第二區塊：API 設定 -->
                    <v-row>
                        <v-col cols="12">
                            <!-- 方法 -->
                            <AppLabel :label="$t('Method')">
                                <AppInput
                                type="select"
                                :options="methodOptions"
                                v-model:modelInput="httpConfig.method"
                                dark
                              />
                            </AppLabel>
                        </v-col>
                        <v-col cols="3">
                            <!-- 欄位名稱 -->
                            <AppLabel :label="$t('FieldName')">
                                <AppInput v-model:modelInput="httpConfig.fieldName"  dark />
                            </AppLabel>
                        </v-col>
                        <v-col cols="3">
                            <!-- 欄位值 -->
                            <AppLabel :label="$t('FieldData')">
                                <AppInput
                                type="select"
                                :options="fieldDataOptions"
                                v-model:modelInput="httpConfig.fieldData"
                                dark
                              />
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
                                <textarea v-model="httpConfig.data_list" class="w-full p-2 border rounded border-general" rows="3"></textarea>
                            </AppLabel>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <!-- ✅ 第三區塊：擴充欄位 -->
                    <v-row>
                        <v-col cols="12">
                            <!-- 擴充欄位 -->
                            <AppLabel :label="$t('ExtraFields')">
                                <textarea v-model="httpConfig.note" class="w-full p-2 border rounded border-general" rows="3"></textarea>
                            </AppLabel>
                        </v-col>
                    </v-row>
                </v-container>
            </template>
            <template v-else-if="eventType === 'mail'">
            <v-container>
              <v-row>
                <!-- SMTP 方法 -->
                <v-col cols="4">
                  <AppLabel :label="$t('SMTPmethod')">
                    <AppInput
                        type="select"
                        :options="SMTPmethodOptions"
                        v-model:modelInput="mailConfig.SMTPmethod"
                        :hasSubmitted="hasSubmitted"
                        dark />
                  </AppLabel>
                </v-col>

                <!-- 主機位址 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Host')">
                    <AppInput v-model:modelInput="mailConfig.host" 
                    @valid="val => mailValid.host = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 埠號 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Port')">
                    <AppInput v-model:modelInput="mailConfig.port" 
                    @valid="val => mailValid.port = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 啟用 SMTPS -->
                <v-col cols="4">
                  <AppLabel :label="$t('EnableSMTPS')">
                    <v-switch v-model="mailConfig.enableSMTPS" inset color="info"/>
                  </AppLabel>
                </v-col>

                <!-- 帳號 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Account')">
                    <AppInput v-model:modelInput="mailConfig.account" 
                    @valid="val => mailValid.account = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 密碼 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Password')">
                    <AppInput v-model:modelInput="mailConfig.password" 
                    @valid="val => mailValid.password = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 寄件者 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Sender')">
                    <AppInput v-model:modelInput="mailConfig.sender" 
                    @valid="val => mailValid.sender = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 主旨 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Title2')">
                    <AppInput v-model:modelInput="mailConfig.subject" 
                    @valid="val => mailValid.subject = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 收件者 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Recipient')">
                    <AppInput v-model:modelInput="mailConfig.recipient" 
                    @valid="val => mailValid.recipient = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 副本 -->
                <v-col cols="4">
                  <AppLabel :label="$t('CC')">
                    <AppInput v-model:modelInput="mailConfig.cc" 
                    @valid="val => mailValid.cc = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 密件副本 -->
                <v-col cols="4">
                  <AppLabel :label="$t('BCC')">
                    <AppInput v-model:modelInput="mailConfig.bcc" 
                    @valid="val => mailValid.bcc = val" dark 
                    :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 語言 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Language')">
                    <AppInput
                        type="select"
                        :options="languageOptions"
                        v-model:modelInput="mailConfig.language"
                        :hasSubmitted="hasSubmitted"
                        dark />
                </AppLabel>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>
              <v-row>
    
                <!-- 欄位選擇 -->
                <v-col cols="6">
                  <AppLabel :label="$t('IncludeFields')">
                    <div class="p-2 border rounded border-general">
                      <div v-for="(value, key) in mailConfig.fields" :key="key" class="flex items-center space-x-2">
                        <input type="checkbox" v-model="mailConfig.fields[key]" class="w-4 h-4" />
                        <label>{{ key }}</label>
                      </div>
                    </div>
                  </AppLabel>
                </v-col>
                <!-- 擴充欄位 -->
                <v-col cols="6">
                  <AppLabel :label="$t('AdditionalFields')">
                    <textarea v-model="mailConfig.additionalFields" class="w-full p-2 border rounded border-general" rows="5"></textarea>
                  </AppLabel>
                </v-col>

              </v-row>

            </v-container>
          </template>

          <template v-else-if="eventType === 'line' || eventType === 'telegram'">
            <v-container>
              <v-row>
                <v-col cols="4">
                  <AppLabel :label="$t('Token')">
                    <AppInput v-model:modelInput="lineConfig.token" 
                    @valid="val => lineValid.token = val" dark 
                    :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>
                <v-col cols="4">
                  <AppLabel :label="$t('GroupId')">
                    <AppInput v-model:modelInput="lineConfig.groupid" 
                    @valid="val => lineValid.groupid = val" dark 
                    :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>
                <v-col cols="4">
                  <AppLabel :label="$t('Language')">
                    <AppInput
                        type="select"
                        :options="languageOptions"
                        v-model:modelInput="lineConfig.language"
                        :hasSubmitted="hasSubmitted"
                        dark />
                </AppLabel>
                </v-col>
                <v-divider class="my-4"></v-divider>
              <v-row>
    
                <!-- 欄位選擇 -->
                <v-col cols="6">
                  <AppLabel :label="$t('IncludeFields')">
                    <div class="p-2 border rounded border-general">
                      <div v-for="(value, key) in lineConfig.fields" :key="key" class="flex items-center space-x-2">
                        <input type="checkbox" v-model="lineConfig.fields[key]" class="w-4 h-4" />
                        <label>{{ key }}</label>
                      </div>
                    </div>
                  </AppLabel>
                </v-col>
                <!-- 擴充欄位 -->
                <v-col cols="6">
                  <AppLabel :label="$t('AdditionalFields')">
                    <textarea v-model="lineConfig.additionalFields" class="w-full p-2 border rounded border-general" rows="5"></textarea>
                  </AppLabel>
                </v-col>

              </v-row>

            
              </v-row>
            </v-container>

          </template>
        </div>

  
        <div v-if="currentStep === 3">
          <v-container>

              <h2 class="my-4">{{ $t('WeeklyScheduler') }}</h2>
              <FullCalendar ref="calendarRef" :options="calendarOptions" />
              <v-btn color="error" class="mt-4" @click="clearSelectedTimes">
                {{ $t('ClearAll') }}
              </v-btn>

              <v-divider class="my-4"></v-divider>

              <h2 class="my-4">{{ $t('AssignTimeScheduler') }}</h2>
              <div class="flex items-center gap-2">
                <AppDatePicker
                  v-model:modelSelected="selectedTimesRange"
                  :dark="true"
                  :range="true"
                  mode="date-time"
                  :min-date="new Date()" 
                  :max-date="new Date(2025, 11, 31)"
                />
                <!-- 加入選擇時間範圍的按鈕 -->
                <v-btn color="primary" @click="addSelectedRange">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>

              <!-- 顯示已選擇的時間範圍 -->
              <div v-if="selectedRanges.length > 0" class="mt-4 border rounded p-2">
                <div v-for="(range, index) in selectedRanges" :key="index" class="flex justify-between items-center p-2 border-b">
                  <span>{{ range.start }} ~ {{ range.end }}</span>
                  <v-btn color="error" @click="removeRange(index)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-container>
        </div>

        <div v-if="currentStep === 4">
          <h1 class="text-3xl flex items-center justify-center">{{ $t('Finish') }}</h1>
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
  
          <AppButton v-if="currentStep === 4" type="primary" class="px-6" @click="onSaveNotify">
            {{ $t('Save') }}
          </AppButton>
        </div>
      </template>
  </ModalLayout>
</template>

<script setup>

import { ref, computed ,watch, onMounted, defineExpose, defineEmits, reactive} from 'vue';
import useStore from '@/modules/config/stores/index';
import FullCalendar from '@fullcalendar/vue3';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
const modal = ref('');
const store = useStore();
const currentStep = ref(1);
const eventName = ref('');
const eventType = ref('http'); 
const eventNote = ref('');
const selectedTimes = ref([]); 
const calendarRef = ref(null); 
const selectedTimesRange = ref('')
const selectedRanges = ref([]); 
const notifyEditData = ref(null)
const albums = ref([]); 
const selectedAlbums = ref([]); 

const devices = ref([])
const selectedDeviceds= ref([])
const hasSubmitted = ref(false);

const errors = ref({
  eventName: '',
  eventType: '',
  selectedAlbums: '',
  selectedDeviceds: ''
});

const eventTypeOptions = {
  HTTP: 'http',
  Mail: 'mail',
  Line: 'line',
  Telegram: 'telegram'
};

const methodOptions = {
  GET: "GET",
  POST:"POST"
}

const fieldDataOptions = {
  channel: "channel",
  time:"time",
  albumn:"albumn"
}
const SMTPmethodOptions = {
  SMTP : "SMTP",
  others: "others"
}

const languageOptions = {
  English :"en",
  繁體中文:"zh",
  日本語: "ja",
  Español : "es",
  Français:"fr",
  แบบไทย:"th",
}

const httpValid = reactive({
  host: false,
  user: false,
  pass: false,
  port: false,
  url: false,
  check: computed(() =>
    httpValid.host &&
    httpValid.user &&
    httpValid.pass &&
    httpValid.port &&
    httpValid.url
  )
});

const mailValid = reactive({
  host: false,
  port: false,
  account: false,
  password: false,
  sender: false,
  subject: false,
  recipient: false,
  cc: false,
  bcc: false, // 可選填，預設 true
  check: computed(() =>
    mailValid.host &&
    mailValid.port &&
    mailValid.account &&
    mailValid.password &&
    mailValid.sender &&
    mailValid.subject &&
    mailValid.recipient &&
    mailValid.cc &&
    mailValid.bcc
  )
});

const lineValid = reactive({
  token: false,
  groupid: false,
  check: computed(() =>
    lineValid.token &&
    lineValid.groupid 
  )
});
const httpConfig = ref("")
const mailConfig = ref({
  SMTPmethod: "SMTP",
  host: "",
  port: "",
  enableSMTPS: false,
  account: "",
  password: "",
  sender: "",
  subject: "",
  recipient: "",
  cc: "",
  bcc: "",
  language: "en",
  additionalFields: "", // 擴充欄位
  fields:"",
});
const lineConfig = ref({
    token: '',
    groupid: '',
    language: "en",
    additionalFields: "",
    fields:"",
});
const emit = defineEmits(['refreshNotifyList']);

onMounted(async () => {
    try {
        const response1 = await store.getAllAlbums(); // 假設這是呼叫 API 取得相簿的函式
        console.log("albums",response1)
        albums.value = response1.data; // 假設後端返回的結構為 { data: [...] }

        const response2 = await store.getAllLiveDevices(); // 假設這是呼叫 API 取得相簿的函式
        console.log("livedevices",response2)
        devices.value = response2.data; // 假設後端返回的結構為 { data: [...] }
    } catch (error) {
        console.error("❌ 無法取得相簿列表:", error);
    }
});

const stepDescription = computed(() => {
    switch (currentStep.value) {
      case 1: return '編輯事件資訊';
      case 2: return '編輯通知資訊';
      case 3: return '編輯排程';
      case 4: return '編輯完成';
      default: return '';
    }
  });

  function validateFields(configObj, validObj, fieldKeys) {
  fieldKeys.forEach((key) => {
    validObj[key] = !!configObj[key];
  });
}
  function validateStep1() {
  let valid = true;
  errors.value = {
    eventName: '',
    eventType: '',
    selectedAlbums: '',
    selectedDeviceds: ''
  };

  if (!eventName.value.trim()) {
    errors.value.eventName = '事件名稱為必填';
    valid = false;
  }

  if (!eventType.value) {
    errors.value.eventType = '事件類別為必填';
    valid = false;
  }

  if (selectedAlbums.value.length === 0) {
    errors.value.selectedAlbums = '請至少選擇一個相簿';
    valid = false;
  }

  if (selectedDeviceds.value.length === 0) {
    errors.value.selectedDeviceds = '請至少選擇一個設備';
    valid = false;
  }

  return valid;
}
  function nextStep() {
    if (currentStep.value === 1 && !validateStep1()) {
    return; // 驗證沒通過就中止
  }
  if (currentStep.value === 2) {
    console.log("httpValid.check",httpValid)
    if (eventType.value === 'http' && !httpValid.check) {
      hasSubmitted.value = true; 
      console.warn('HTTP 設定尚未填寫完整');
      return;
    }

    if (eventType.value === 'mail' && !mailValid.check) {
      hasSubmitted.value = true; 
      console.warn('Mail 設定尚未填寫完整');
      return;
    }
    if((eventType.value === 'line' || eventType.value === 'telegram') && !lineValid.check) {
      hasSubmitted.value = true; 
      console.warn('line/telegram設定尚未填寫完整');
      return;
    }
  }
    if (currentStep.value < 4) currentStep.value++;
    if (currentStep.value === 3) {
        refreshEvents()
    }
  }
  
  function prevStep() {
    if (currentStep.value > 1) currentStep.value--;
    if (currentStep.value === 3) {
        refreshEvents()
    }
  }

  // **根據 JSON/XML 選擇變更 Label**
  const selectedFormatLabel = computed(() => {
  return httpConfig.value.dataFormat === "JSON" ? "JSON" : "XML";
});
  

// **監聽 `method` 變化，當切換 GET/POST 時清空 urlParams**
watch(() => httpConfig.value.method, () => {
  httpConfig.value.data_list = "";
  httpConfig.value.completeUrl = "";
});

// **監聽 `dataFormat` 變化，當切換 JSON/XML 時清空 urlParams**
watch(() => httpConfig.value.dataFormat, () => {
  httpConfig.value.data_list = "";
});

  function addToUrlParams() {
  if (httpConfig.value.method === "GET") {
    // 確保有欄位名稱和欄位值
    if (!httpConfig.value.fieldName || !httpConfig.value.fieldData) return;

    // 格式化 GET 參數
    const newParam = `&${httpConfig.value.fieldName}=##${httpConfig.value.fieldData}##`;

    // 檢查是否已經存在
    if (!httpConfig.value.data_list.includes(newParam)) {
      httpConfig.value.data_list += newParam;
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
    if (!httpConfig.value.data_list.includes(newField)) {
      httpConfig.value.data_list += httpConfig.value.data_list ? `\n${newField}` : newField;
    }

    // 清空輸入欄位
    httpConfig.value.fieldName = "";
    httpConfig.value.fieldData = "";
  }
}


// **動態更新完整 URL**
function updateCompleteUrl() {
  const basePath = httpConfig.value.url.startsWith("/") ? httpConfig.value.url : `/${httpConfig.value.url}`;
  httpConfig.value.completeUrl = `${basePath}${httpConfig.value.data_list ? "?" + httpConfig.value.data_list : ""}`;
}

// **監聽 URL 參數變化，自動更新完整 URL**
watch(() => httpConfig.value.url, updateCompleteUrl);

const calendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek', // 單週時間視圖
  selectable: true, // 允許選擇
  selectMirror: true, // 拖曳時顯示效果
  allDaySlot: false, // 移除 "全天"
  slotDuration: '01:00:00', // 每格 30 分鐘
  slotMinTime: '00:00:00', // 最早時間 6:00 AM
  slotMaxTime: '24:00:00', // 最晚時間 10:00 PM
  hiddenDays: [], // 顯示整週
  headerToolbar: false, // 移除上方標題
  dayHeaderFormat: { weekday: 'short' }, // 只顯示 "Mon, Tue..."
  eventOverlap: false, // 不允許時間重疊
  // ✅ 限制使用者只能在單日內選擇
  selectAllow: (selectInfo) => {
    return selectInfo.start.getDate() === selectInfo.end.getDate();
  },
  select: (info) => {
    // 使用者拖曳選擇時段時
    selectedTimes.value.push({
      start: info.startStr,
      end: info.endStr,
      dow: info.start.getDay(), // 取得星期幾
    });
    console.log('選擇時段:', selectedTimes.value);
    console.log('格式化選擇時段',convertToBackendFormat(selectedTimes.value));
    refreshEvents();
  },
  events: selectedTimes.value, // 顯示選擇的時段
});

// **清除所有選擇的時間**
const clearSelectedTimes = () => {
  selectedTimes.value = []; // 清空選擇的時段
  refreshEvents();
};



const refreshEvents = () => {
  
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    
    // 移除所有舊的事件
    calendarApi.removeAllEvents();

    // 重新加入新的事件
    selectedTimes.value.forEach(event => {
      calendarApi.addEvent({
        start: event.start,
        end: event.end,
        dow: event.dow 
      });
    });
  }
};
const convertToBackendFormat = (selectedTimes) => {
  const groupedByDay = {};

  selectedTimes.forEach((time) => {
    const dayOfWeek = time.dow; // 取得星期幾
    const startHour = new Date(time.start).getHours();
    const endHour = new Date(time.end).getHours();

    // 確保該星期有對應的陣列
    if (!groupedByDay[dayOfWeek]) {
      groupedByDay[dayOfWeek] = new Set();
    }

    // 把時間範圍內的每個小時加入 Set（確保不重複）
    for (let hour = startHour; hour < endHour; hour++) {
      groupedByDay[dayOfWeek].add(hour);
    }
  });

  // 轉換為後端格式
  const weeklySchedule = {
      list: Object.entries(groupedByDay).map(([day_of_week, hoursSet]) => ({
        day_of_week: parseInt(day_of_week), // 轉換回數字
        hours_list: [...hoursSet].sort((a, b) => a - b), // 轉換為陣列並排序
      })),
    
  };

  return weeklySchedule;
};

// 🔹 加入選擇的時間範圍
const addSelectedRange = () => {
  if (!selectedTimesRange.value || !selectedTimesRange.value.length === 2) {
    console.warn("請選擇一個有效的時間範圍");
    return;
  }

  // 確保選擇範圍內有開始和結束時間
  const [start, end] = selectedTimesRange.value;
  if (!start || !end) return;

  // 避免重複加入相同的時間範圍
  if (!selectedRanges.value.some(range => range.start === start && range.end === end)) {
    selectedRanges.value.push({ start, end });
  }
  console.log("選擇時間",selectedRanges.value)
  console.log("選擇時間格式化",convertToBackendFormat2(selectedRanges.value))
  // 清空選擇框，讓使用者可以選擇下一個區間
  selectedTimesRange.value = '';
};
function convertToBackendFormat2(selectedRanges) {
    return {
        list: selectedRanges.map(item => ({
            start_time: new Date(item.start).getTime(),
            end_time: new Date(item.end).getTime()
        }))
    };
}
// 🔹 移除選擇的時間範圍
const removeRange = (index) => {
  selectedRanges.value.splice(index, 1);
};


// **重設所有表單數據**
function resetForm() {

  // 清空事件基本資訊
  eventName.value = '';
  eventType.value = 'http'; // 預設為 HTTP
  eventNote.value = '';

  // 清空選擇的相簿與設備
  selectedAlbums.value = [];
  selectedDeviceds.value = [];

  // 清空選擇的時間
  selectedTimes.value = [];
  selectedRanges.value = [];
  notifyEditData.value = null;

  // 清空 HTTP 設定
  httpConfig.value = {
    host: '',
    https: false,
    user: '',
    pass: '',
    port: '',
    url: '',
    completeUrl: '',
    method: 'GET',
    data_list: '',
    note: '',
    dataFormat: 'JSON',
    fieldName: '',
    fieldData: ''
  };

  // 清空 Mail 設定
  mailConfig.value = {
    SMTPmethod: "SMTP",
    host: "",
    port: "",
    enableSMTPS: false,
    account: "",
    password: "",
    sender: "",
    subject: "",
    recipient: "",
    cc: "",
    bcc: "",
    language: "en",
    additionalFields: "",
    fields: "",
  };

  // 清空 LINE 設定
  lineConfig.value = {
    token: '',
    groupid: '',
    language: "en",
    additionalFields: "",
    fields: "",
  };

  // 清空 FullCalendar
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.removeAllEvents();
  }

  // 步驟重置
  currentStep.value = 1;
}

function convertToFullCalendar(weeklySchedule) {
    const events = [];
    const now = new Date();
    
    // 取得當週的星期一 (設定為 1~7)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    weeklySchedule.list.forEach(schedule => {
        const dayOffset = schedule.day_of_week - 1; // 1(星期一) -> 0, 2(星期二) -> 1 ...
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + dayOffset); // 找到當週的對應日期

        let startHour = null;
        let endHour = null;

        schedule.hours_list.forEach((hour, index) => {
            if (startHour === null) {
                startHour = hour;
            }

            // 若下一個小時不連續，則結束當前時段
            if (index === schedule.hours_list.length - 1 || schedule.hours_list[index + 1] !== hour + 1) {
                endHour = hour; // 修正：不加 1

                // 設定日期時間
                const startDate = new Date(date);
                startDate.setHours(startHour, 0, 0, 0);
  
                const endDate = new Date(date);
                endDate.setHours(endHour + 1, 0, 0, 0); // `endHour + 1` 表示最後的結束時間

                // 轉換為台北時區 (UTC+8)
                const startISO = new Date(startDate.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace("Z", "+08:00");
                const endISO = new Date(endDate.getTime() + (8 * 60 * 60 * 1000)).toISOString().replace("Z", "+08:00");

                // 推入 FullCalendar 格式
                events.push({
                    start: startISO,
                    end: endISO,
                    dow: dayOffset + 1 // FullCalendar 以 1 (星期一) 開始
                });

                // 重置 startHour，準備處理下一段時段
                startHour = null;
                endHour = null;
            }
        });
    });

    return events;
}
function setModal(type, notifyData) {
    if (type === '') {
    modal.value = type;
    resetForm()
    return
  }
    modal.value = type;
    console.log(notifyData)
    eventName.value = notifyData.name;
    eventType.value = notifyData.action_type;
    eventNote.value = notifyData.remarks;
    selectedDeviceds.value = notifyData.device_list
    selectedAlbums.value = notifyData.group_list
     // **轉換 specify_time 為前端格式**
     selectedRanges.value = notifyData.specify_time?.list.map(item => ({
        start: new Date(item.start_time).toISOString().slice(0, 16).replace("T", " "), 
        end: new Date(item.end_time).toISOString().slice(0, 16).replace("T", " ")
    })) || [];
    console.log("selectedRanges",selectedRanges.value)
    // **轉換 weekly_schedule 為 FullCalendar 格式**
    selectedTimes.value = [];
    selectedTimes.value = convertToFullCalendar(notifyData.weekly_schedule) 
    console.log("selectedTimes",selectedTimes.value)
    
    notifyEditData.value = notifyData
   
    if (eventType.value === 'http') {
        httpConfig.value = { ...notifyData };
        // 手動驗證 http 欄位
        validateFields(httpConfig.value, httpValid, ['host', 'user', 'pass', 'port', 'url']);
        console.log("http",httpConfig.value)
    } else if (eventType.value === 'mail') {
        mailConfig.value.SMTPmethod = notifyData.method;
        mailConfig.value.host = notifyData.host;
        mailConfig.value.port = notifyData.port;
        mailConfig.value.enableSMTPS = notifyData.secure;
        mailConfig.value.account = notifyData.user;
        mailConfig.value.password = notifyData.pass;
        mailConfig.value.sender = notifyData.from;
        mailConfig.value.subject = notifyData.subject;
        mailConfig.value.recipient = notifyData.to.join(',');
        mailConfig.value.cc = notifyData.cc.join(',');
        mailConfig.value.bcc = notifyData.bcc.join(',');
        mailConfig.value.language = notifyData.language;
        mailConfig.value.additionalFields = notifyData.note;
        mailConfig.value.fields = notifyData.data_list;
        validateFields(mailConfig.value, mailValid, [
            'host', 'port', 'account', 'password', 'sender', 'subject', 'recipient', 'cc', 'bcc'
        ]);
        console.log("mail",mailConfig.value)
    }else{
        lineConfig.value.token = notifyData.token;
        lineConfig.value.groupid = notifyData.group_id;
        lineConfig.value.language = notifyData.language;
        lineConfig.value.additionalFields = notifyData.note;
        lineConfig.value.fields = notifyData.data_list;
        validateFields(lineConfig.value, lineValid, ['token', 'groupid']);
        console.log("line",lineConfig.value)
    }
     
}

watch(calendarRef, (newVal) => {
    if (newVal) {
        console.log("calendarRef is now available, refreshing events...");
        refreshEvents();
    }
});

async function onSaveNotify(){

    // **轉換時間排程格式**
  const specifyTimeData = convertToBackendFormat2(selectedRanges.value);
  const weeklyScheduleData = convertToBackendFormat(selectedTimes.value);


  console.log("specifyTimeData",specifyTimeData)
  console.log("weeklyScheduleData",weeklyScheduleData)

  // **組合 API 需要的格式**
  const payload= {
    uuid: notifyEditData.value.uuid,
    name: eventName.value,
    action_type: eventType.value,
    enable: notifyEditData.value.enable, 
    device_list: selectedDeviceds.value, 
    group_list: selectedAlbums.value, 
    remarks: eventNote.value,
    specify_time: specifyTimeData, 
    weekly_schedule: weeklyScheduleData,
  };

  const payloadhttp = {
    ...payload,
    language: "en", // 預設語言
    data_list: httpConfig.value.data_list,
    note: httpConfig.value.note,
    https: httpConfig.value.https,
    method: httpConfig.value.method,
    user: httpConfig.value.user,
    pass: httpConfig.value.pass,
    host: httpConfig.value.host,
    port: httpConfig.value.port, 
    url: httpConfig.value.url,
  }

  const payloadmail = {
    ...payload,
    language: mailConfig.value.language, 
    method: mailConfig.value.SMTPmethod,
    secure: mailConfig.value.enableSMTPS, 
    user: mailConfig.value.account, 
    pass: mailConfig.value.password, 
    host: mailConfig.value.host, 
    port: mailConfig.value.port, 
    from: mailConfig.value.sender, 
    subject: mailConfig.value.subject, 
    to: [mailConfig.value.recipient], 
    cc: [mailConfig.value.cc],
    bcc: [mailConfig.value.bcc],
    data_list: mailConfig.value.fields, 
    note: mailConfig.value.additionalFields
  }

  const payloadline = {
    ...payload,
    language: lineConfig.value.language,
    note: lineConfig.value.additionalFields, 
    token: lineConfig.value.token, 
    group_id: lineConfig.value.groupid, 
    data_list: lineConfig.value.fields,
  }

  console.log("payloadline",payloadline)

  let result = ''
  if (eventType.value === "http"){
    result = await store.editNotify(payloadhttp);
    console.log("result",result)
    
  }else if(eventType.value === "mail"){
    result = await store.editNotify(payloadmail);
    console.log("result",result)
  }else{
    result = await store.editNotify(payloadline);
    console.log("result",result)
  }
  if(result){
    console.log('close')
    resetForm(); // 清空表單
    setModal(''); // 關閉 Modal
    emit('refreshNotifyList');
    }

}
// 讓外部可以呼叫 setModal
defineExpose({ setModal });
</script>