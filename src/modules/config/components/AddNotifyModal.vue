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
                  />
                  <p v-if="errors.eventType" class="text-red-500 text-sm mt-1">{{ errors.eventType }}</p>
                </AppLabel>
            </v-col>
            <v-col cols="6">
            <!-- 相簿多選 -->
            <AppLabel :label="$t('Album')" class="mt-2">
                <div class="mt-2 w-full p-2 border rounded border-general ">
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
            <!-- 相機多選 -->
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
                              <AppInput v-model:modelInput="httpConfig.host" @valid="val => httpValid.host = val" placeholder="請輸入主機位址"  dark :hasSubmitted="hasSubmitted" />
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
                                <AppInput v-model:modelInput="httpConfig.username" @valid="val => httpValid.username = val" placeholder="請輸入帳號" dark  :hasSubmitted="hasSubmitted"/>
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 密碼 -->
                            <AppLabel :label="$t('Password')">
                                <AppInput v-model:modelInput="httpConfig.password" @valid="val => httpValid.password = val" placeholder="請輸入密碼" dark :hasSubmitted="hasSubmitted"/>
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- 埠號 -->
                            <AppLabel :label="$t('Port')">
                                <AppInput v-model:modelInput="httpConfig.port" @valid="val => httpValid.port = val" dark :hasSubmitted="hasSubmitted"/>
                            </AppLabel>
                        </v-col>

                        <v-col cols="6">
                            <!-- API Path -->
                            <AppLabel :label="$t('Path')">
                                <AppInput v-model:modelInput="httpConfig.path" @valid="val => httpValid.path = val" dark :hasSubmitted="hasSubmitted"/>
                            </AppLabel>
                        </v-col>

                        <v-col cols="12">
                            <!-- 顯示url -->
                            <AppLabel :label="$t('ShowCompleteUrl')">
                                <input v-model="httpConfig.completeUrl" type="text" class="w-full p-2 border rounded border-general"  readonly />
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
                                <textarea v-model="httpConfig.urlParams" class="w-full p-2 border rounded border-general" rows="3"></textarea>
                            </AppLabel>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <!-- ✅ 第三區塊：擴充欄位 -->
                    <v-row>
                        <v-col cols="12">
                            <!-- 擴充欄位 -->
                            <AppLabel :label="$t('ExtraFields')">
                                <textarea v-model="httpConfig.extraFields" class="w-full p-2 border rounded border-general" rows="3"></textarea>
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
                    <AppInput v-model:modelInput="mailConfig.host" @valid="val => mailValid.host = val" dark :hasSubmitted="hasSubmitted" />
                  </AppLabel>
                </v-col>

                <!-- 埠號 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Port')">
                    <AppInput v-model:modelInput="mailConfig.port" @valid="val => mailValid.port = val" dark :hasSubmitted="hasSubmitted"/>
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
                    <AppInput v-model:modelInput="mailConfig.account" @valid="val => mailValid.account = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 密碼 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Password')">
                    <AppInput v-model:modelInput="mailConfig.password" @valid="val => mailValid.password = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 寄件者 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Sender')">
                    <AppInput v-model:modelInput="mailConfig.sender" @valid="val => mailValid.sender = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 主旨 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Title2')">
                    <AppInput v-model:modelInput="mailConfig.subject" @valid="val => mailValid.subject = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 收件者 -->
                <v-col cols="4">
                  <AppLabel :label="$t('Recipient')">
                    <AppInput v-model:modelInput="mailConfig.recipient" @valid="val => mailValid.recipient = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 副本 -->
                <v-col cols="4">
                  <AppLabel :label="$t('CC')">
                    <AppInput v-model:modelInput="mailConfig.cc" @valid="val => mailValid.cc = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>

                <!-- 密件副本 -->
                <v-col cols="4">
                  <AppLabel :label="$t('BCC')">
                    <AppInput v-model:modelInput="mailConfig.bcc" @valid="val => mailValid.bcc = val" dark :hasSubmitted="hasSubmitted"/>
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
                    <div class="p-2 border rounde border-general">
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
                    <AppInput v-model:modelInput="lineConfig.token" @valid="val => lineValid.token = val" dark :hasSubmitted="hasSubmitted"/>
                  </AppLabel>
                </v-col>
                <v-col cols="4">
                  <AppLabel :label="$t('GroupId')">
                    <AppInput v-model:modelInput="lineConfig.groupid" @valid="val => lineValid.groupid= val" dark :hasSubmitted="hasSubmitted"/>
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
  import { ref, computed ,watch, onMounted, defineEmits, reactive} from 'vue';
  import useStore from '@/modules/config/stores/index';
  import FullCalendar from '@fullcalendar/vue3';
  import timeGridPlugin from '@fullcalendar/timegrid';
  import interactionPlugin from '@fullcalendar/interaction';

  const selectedTimes = ref([]); // 存儲選擇的時間
  const calendarRef = ref(null); // 取得 FullCalendar 實例
  const selectedTimesRange = ref('')
  const selectedRanges = ref([]); 
  const emit = defineEmits(['refreshNotifyList']);
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
const errors = ref({
  eventName: '',
  eventType: '',
  selectedAlbums: '',
  selectedDeviceds: ''
});

const httpValid = reactive({
  host: false,
  username: false,
  password: false,
  port: false,
  path: false,
  check: computed(() =>
    httpValid.host &&
    httpValid.username &&
    httpValid.password &&
    httpValid.port &&
    httpValid.path
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

// **重新整理 FullCalendar 的事件**
const refreshEvents = () => {
  console.log("clear")
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.removeAllEvents(); // 刪除所有事件
    selectedTimes.value.forEach(event => calendarApi.addEvent(event)); // 重新加入事件
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
  
  const store = useStore();
  const modal = ref('');
  const currentStep = ref(1);
  const hasSubmitted = ref(false);
const eventName = ref('');
const eventType = ref('http'); // 預設值

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
  fields: {
    device_uuid: false,
    device_name: false,
    timestamp: false,
    datetime: false,
    album_id: false,
    album_name: false,
  },
});


// LINE 設定
const lineConfig = ref({
    token: '',
    groupid: '',
    language: "en",
    additionalFields: "",
    fields: {
    device_uuid: false,
    device_name: false,
    timestamp: false,
    datetime: false,
    album_id: false,
    album_name: false,
  }
});



const albums = ref([]); // 存放從後端取得的相簿
const selectedAlbums = ref([]); // 存放使用者選中的相簿

const devices = ref([])
const selectedDeviceds= ref([])
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
  eventName.value = "";
  eventType.value = "http"; // 重置為預設值
  eventNote.value = "";

  selectedAlbums.value = [];
  selectedDeviceds.value = [];

  selectedTimes.value = [];
  selectedTimesRange.value = "";
  selectedRanges.value = [];

  httpConfig.value = {
    host: "",
    ssl: false,
    username: "",
    password: "",
    port: "",
    path: "",
    completeUrl: "",
    urlParams: "",
    extraFields: "",
    dataFormat: "JSON",
    method: "GET",
  };

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
    fields: {
      device_uuid: false,
      device_name: false,
      timestamp: false,
      datetime: false,
      album_id: false,
      album_name: false,
    },
  };

  lineConfig.value = {
    token: "",
    groupid: "",
    language: "en",
    additionalFields: "",
    fields: {
      device_uuid: false,
      device_name: false,
      timestamp: false,
      datetime: false,
      album_id: false,
      album_name: false,
    },
  };

  // 清空 FullCalendar
  if (calendarRef.value) {
    const calendarApi = calendarRef.value.getApi();
    calendarApi.removeAllEvents();
  }

  currentStep.value = 1; 
}

function setModal(val) {
  if (val === '') {
    resetForm(); 
    modal.value = val;
  }
  modal.value = val;
}


function nextStep() {
  if (currentStep.value === 1 && !validateStep1()) {
    return; // 驗證沒通過就中止
  }
  if (currentStep.value === 2) {
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
  if (currentStep.value === 3) refreshEvents();
}


  function prevStep() {
    if (currentStep.value > 1) {
      hasSubmitted.value = false;
      currentStep.value--;
    }
    if (currentStep.value === 3) {
      clearSelectedTimes(); // **確保切換回來時不會還原刪除的排程**
    }
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





async function onSaveNotify() {
  
  // **轉換時間排程格式**
  const specifyTimeData = convertToBackendFormat2(selectedRanges.value);
  const weeklyScheduleData = convertToBackendFormat(selectedTimes.value);


  console.log("specifyTimeData",specifyTimeData)
  console.log("weeklyScheduleData",weeklyScheduleData)
  
  // **組合 API 需要的格式**
  const payloadhttp= {
    name: eventName.value,
    action_type: eventType.value,
    enable: true, // 預設啟用
    device_list: selectedDeviceds.value, // 選擇的裝置
    group_list: selectedAlbums.value, // 選擇的群組
    remarks: eventNote.value || "", // 備註
    specify_time: specifyTimeData, // 指定日期排程
    weekly_schedule: weeklyScheduleData, // 每週時間排程
    language: "en", // 預設語言
    data_list: httpConfig.value.urlParams,
    note: httpConfig.value.extraFields,
    https: httpConfig.value.ssl,
    method: httpConfig.value.method,
    user: httpConfig.value.username,
    pass: httpConfig.value.password,
    host: httpConfig.value.host,
    port: httpConfig.value.port, 
    url: httpConfig.value.path
  };
  const payloadmail={
    name: eventName.value,
    action_type: eventType.value,
    enable: true, // 預設啟用
    device_list: selectedDeviceds.value, 
    group_list: selectedAlbums.value, 
    remarks: eventNote.value,
    specify_time: specifyTimeData, // 指定日期排程
    weekly_schedule: weeklyScheduleData, // 每週時間排程
    language: mailConfig.value.language, // 預設語言
    method: mailConfig.value.SMTPmethod,
    secure: mailConfig.value.enableSMTPS, // 啟用安全 SMTP
    user: mailConfig.value.account, // SMTP 帳號
    pass: mailConfig.value.password, // SMTP 密碼
    host: mailConfig.value.host, // SMTP 主機位址
    port: mailConfig.value.port, // SMTP 連接埠
    from: mailConfig.value.sender, // 發件人名稱
    subject: mailConfig.value.subject, // 郵件標題
    to: [mailConfig.value.recipient], // 收件者
    cc: [mailConfig.value.cc],
    bcc: [mailConfig.value.bcc],
    data_list: mailConfig.value.fields, // 選擇的欄位
    note: mailConfig.value.additionalFields
  }

  const payloadline = {
    name: eventName.value, // 事件名稱
    action_type: eventType.value, // 事件類型 (http, mail, line, telegram)
    enable: true, // 預設啟用
    device_list: selectedDeviceds.value, // 選擇的設備 ID 陣列
    group_list: selectedAlbums.value, // 選擇的群組 (相簿) ID 陣列
    remarks: eventNote.value || "", // 事件備註
    specify_time: specifyTimeData, // 指定時間範圍
    weekly_schedule: weeklyScheduleData, // 每週排程
    language: lineConfig.value.language || "en", // 預設語言
    note: lineConfig.value.additionalFields, // LINE 通知的備註
    token: lineConfig.value.token, // LINE API Token
    group_id: lineConfig.value.groupid, // 群組 ID
    data_list: lineConfig.value.fields, // 選擇的欄位
  }


  console.log("🚀 Sending payload to backend:",payloadline);

  let result = ''
  if (eventType.value === "http"){
    result = await store.postNotify(payloadhttp);
    console.log("result",result)
    
  }else if(eventType.value === "mail"){
    result = await store.postNotify(payloadmail);
    console.log("result",result)
  }else{
    result = await store.postNotify(payloadline);
    console.log("result",result)
  }
  if(result){
    console.log("close")
    resetForm(); // 清空表單
    setModal(""); // 關閉 Modal
    emit('refreshNotifyList'); // 發送事件通知父組件重新抓取通知列表
    }

  
}

    // 🔥 這一行很重要！讓父組件可以呼叫 setModal()
    defineExpose({ setModal });
  </script>
  
  


