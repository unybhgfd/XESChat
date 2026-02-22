<script setup lang="ts">
import Header from "../../../../components/header.vue";
import {ref} from "vue";
import * as axios from "axios";
// TODO

const selectedFile = ref(null as null)

function uploadFile() {
  const formData = new FormData();
  formData.append("file", selectedFile);
}
</script>

<template>
    <v-app>
        <Header title="网盘 - 上传" />
        <v-main>
          <v-file-input variant="outlined" v-model="selectedFile" label="选择文件" placeholder="点击选择"></v-file-input>
          <v-btn @click="uploadFile">上传</v-btn>
          <p v-if=""
        </v-main>
    </v-app>
</template>
