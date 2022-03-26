<template>
    <button class="taro-button" open-type="getPhoneNumber" @getphonenumber="loginInfo">微信登录</button>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { useLogin } from './hook';

const loginParams = reactive({
    code: '',
    loading: false
});
const { loginInfo } = useLogin(loginParams);
</script>
