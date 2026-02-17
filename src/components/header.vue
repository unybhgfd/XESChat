<script setup lang="ts">
import { ref, watch } from "vue";

const drawer = ref(false);
const group = ref(null);

watch(group, () => {
    drawer.value = false;
});
</script>

<template>
    <v-app-bar :elevation="2" scroll-behavior="collapse">
        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>XES Chat</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list>
            <v-list-item title="首页" href="/xes_chat"></v-list-item>
            <v-list-item title="去聊天" href="/xes_chat/chat"></v-list-item>
            <v-list-item title="回到学而思" href="/"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
