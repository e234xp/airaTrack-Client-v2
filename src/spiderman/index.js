import dayjs from 'dayjs';
import lodash from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import localStorage from './local-storage';
import base64Image from './base64-image';
import apiService from './api-service';
import formatDate from './format-date';
import faceApi from './face-api';

// http://192.168.10.76:8082
// http://192.168.10.119:8081 => 澳洲展
// http://211.75.111.228:8083
// http://192.168.10.70:8081 => 大巨蛋

const system = {
  version: '2.00.01.240517',
  apiBaseUrl: import.meta.env.MODE === 'development'
    ? 'http://192.168.10.62:8081'
    : '',
};

export default {
  dayjs,
  uuid: uuidv4,
  lodash,
  localStorage,
  base64Image,
  apiService,
  system,
  formatDate,
  faceApi,
};
