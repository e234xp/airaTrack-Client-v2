// 引入 VeeValidate 相關模組
import { createApp } from 'vue';
import { Field, Form, ErrorMessage, defineRule, configure } from 'vee-validate';
import { required, email } from '@vee-validate/rules';

// 定義規則
defineRule('required', required);
defineRule('email', email);

// 配置 VeeValidate
configure({
  generateMessage: ({ field, rule }) => {
    const messages = {
      required: `${field} 為必填欄位`,
      email: `${field} 的格式不正確`
    };
    return messages[rule];
  }
});

const app = createApp(App);

// 註冊 VeeValidate 的全局元件
app.component('Field', Field);
app.component('Form', Form);
app.component('ErrorMessage', ErrorMessage);

app.mount('#app');

<template>
  <Form @submit="submitForm">
    <Field name="name" label="Name" rules="required" v-model="form.name" />
    <ErrorMessage name="name" />

    <Field name="email" label="Email" rules="required|email" v-model="form.email" />
    <ErrorMessage name="email" />

    <button type="submit">Submit</button>
  </Form>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: '',
        email: ''
      }
    };
  },
  methods: {
    submitForm() {
      // 表單提交處理
    }
  }
};
</script>
