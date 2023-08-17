<template>
<div>
    <NavigationBar></NavigationBar>
    <router-view></router-view>
</div>
</template>

<script>
import {defineComponent} from 'vue'
import NavigationBar from "@/components/NavigationBar.vue";

export default defineComponent({
    name: "HomePage",
    components: {NavigationBar}
})
</script>

<style scoped lang="scss">

</style>