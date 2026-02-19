<script setup lang="ts">
// example code
import Header from "../../components/header.vue";
import { ref } from "vue";
import { getAnnouncement } from "../../utils/management-info/announcement.ts";

const announcementContent = ref("loading...");
getAnnouncement().then((announcement) => {
    announcementContent.value = announcement;
});
</script>

<template>
    <v-app>
        <Header />
        <v-main>
            <h1 class="text-center mt-3">XES Chat 首页</h1>
            <v-divider></v-divider>
            <div>
                <v-card
                    max-width="344"
                    class="ma-3 d-inline-block"
                    title="口号"
                    text="无审查, 无限制, 高自由度, 随心所欲"
                ></v-card>
                <v-card
                    max-width="344"
                    class="ma-3 d-inline-block"
                    append-icon="mdi-open-in-new"
                    href="https://github.com/unybhgfd/XESChat"
                    prepend-icon="mdi-github"
                    rel="noopener"
                    subtitle="查看GitHub上XESChat的官方repo"
                    target="_blank"
                    title="源代码"
                ></v-card>
                <v-card
                    max-width="344"
                    class="ma-3 d-inline-block"
                    title="耻辱柱"
                    disabled
                    subtitle="对XESChat产生不利影响的人...目前只有学而思"
                ></v-card>
                <v-card class="ma-3 d-inline-block">
                    <v-card-title>公告</v-card-title>
                    <v-card-text>{{ announcementContent }}</v-card-text>
                </v-card>
            </div>
        </v-main>
    </v-app>
</template>
