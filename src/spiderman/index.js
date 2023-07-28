import dayjs from 'dayjs';

import localStorage from './local-storage';
import base64Image from './base64-image';
import apiService from './api-service';

const system = {
  version: '2.0.0',
  apiBaseUrl: 'http://211.75.111.228:8083',
};

export default {
  dayjs,
  localStorage,
  base64Image,
  apiService,
  system,
};
