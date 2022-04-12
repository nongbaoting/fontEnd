<template>
  <div>
    <tmalign-table :uuid="uuid"></tmalign-table>
  </div>
</template>

<script>
import TMalignTable from '../components/TMalignTable.vue'
export default {
  components: {
    'tmalign-table': TMalignTable,
  },
  data() {
    return {
      uuid: this.$route.query.uuid,
    }
  },
}
</script>

<style>
</style>