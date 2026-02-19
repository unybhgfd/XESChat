<script setup lang="ts">
import { ref, watch } from "vue";

const group = ref(null);
const showHeader = ref(false);
const props = defineProps({
    title: ref<string>
})

watch(group, () => {
    showHeader.value = false;
});
</script>

<template>
    <v-app-bar :elevation="2" scroll-behavior="collapse">
        <v-app-bar-nav-icon
            variant="text"
            @click.stop="showHeader = !showHeader"
        ></v-app-bar-nav-icon>
        <v-app-bar-title>{{ props.title || "XES Chat" }}</v-app-bar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="showHeader" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
        <v-list>
            <v-list-item prepend-icon="mdi-home-outline" title="首页" href="/xes_chat"></v-list-item>
            <v-list-item prepend-icon="mdi-chat-outline" title="去聊天" href="/xes_chat/chat"></v-list-item>
            <v-list-item prepend-icon="mdi-location-exit" title="回到学而思" href="/"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>
