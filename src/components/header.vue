<script setup lang="ts">
import { ref, watch } from "vue";

const items = [
    {
        title: "首页",
        href: "/xes_chat",
    },
    {
        title: "去聊天",
        href: "/xes_chat/chat",
    },
    {
        title: "回到学而思",
        href: "/",
    },
];

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
            <v-list-item v-for="n in items" :title="n.title" :href="n.href"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<!--<template>-->
<!--  <v-card>-->
<!--    <v-layout>-->
<!--      <v-app-bar color="primary">-->
<!--        <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>-->

<!--        <v-toolbar-title>My files</v-toolbar-title>-->

<!--        <template v-if="$vuetify.display.mdAndUp">-->
<!--          <v-btn icon="mdi-magnify" variant="text"></v-btn>-->

<!--          <v-btn icon="mdi-filter" variant="text"></v-btn>-->
<!--        </template>-->

<!--        <v-btn icon="mdi-dots-vertical" variant="text"></v-btn>-->
<!--      </v-app-bar>-->

<!--      <v-navigation-drawer-->
<!--          v-model="drawer"-->
<!--          :location="$vuetify.display.mobile ? 'bottom' : undefined"-->
<!--          temporary-->
<!--      >-->
<!--        <v-list-->
<!--            :items="items"-->
<!--        ></v-list>-->
<!--      </v-navigation-drawer>-->

<!--      <v-main style="height: 500px;">-->
<!--        <v-card-text>-->
<!--          The navigation drawer will appear from the bottom on smaller size screens.-->
<!--        </v-card-text>-->
<!--      </v-main>-->
<!--    </v-layout>-->
<!--  </v-card>-->
<!--</template>-->
