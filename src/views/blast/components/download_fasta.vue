<template>
  <el-button
    :disabled="seqIDs.length < 1"
    @click="downTextFile('fasta', 'sequence.fasta')"
    >Download Fasta</el-button
  >
</template>

<script>
export default {
  props: ['name', 'seqIDs'],
  data() {
    return {}
  },
  methods: {
    downTextFile(wantedType, outFiName) {
      console.log('number of seqIDs' + this.seqIDs.length)
      this.$notify({
        type: 'info',
        message: 'Select ' + this.seqIDs.length + ' sequence!',

        position: 'bottom-left',
      })

      this.previewDownFile(wantedType).then((v) => {
        if (v.status == 200) {
          let binaryData = []
          binaryData.push(v.data)
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(
            new Blob(binaryData, { type: 'application/txt' })
          )
          link.download = outFiName
          link.click()
          link.remove()
          this.$notify({
            type: 'success',
            message: 'Download Complete!',

            position: 'bottom-left',
          })
        } else {
          this.$notify({
            type: 'error',
            message: 'error!',

            position: 'bottom-left',
          })
        }
      })
    },
    previewDownFile(wantedType) {
      return new Promise((resolve, reject) => {
        this.$http({
          url: `api/phylo/get_fasta/`,
          data: {
            wantedType: wantedType,
            uuid: this.$route.query.uuid,
            seqIDs: this.seqIDs,
          },
          timeout: 0,
          method: 'post',
          responseType: 'blob',
          header: { 'Content-Type': 'multipart/form-data' },
        })
          .then((res) => {
            resolve(res)
          })
          .catch(() => {
            resolve(false)
          })
      })
    },
  },
}
</script>

<style>
</style>