<template>
    <div class="d-flex">
        <left-side-bar></left-side-bar>
<!--        <router-view/>-->
    </div>
</template>

<script>
import LeftSideBar from "@/components/LeftSideBar.vue";

export default {
    name: "UserHomePage",
    components: {LeftSideBar}
}
</script>

<style scoped lang="scss">

</style>