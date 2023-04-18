<template>
  <div>
    <div :key="viewkey" :id="'mypfv'+ viewkey" style="margin-top: 10px"></div>
  </div>
</template>

<script>
import { RcsbFv } from '@rcsb/rcsb-saguaro'

export default {

  props:['viewkey'],
  data() {
    return {
      sequence:'',
      rowConfigData :[]
    }
  },
mounted(){
    
    this.getData()
},
  methods: {

    getData(){
      this.$http.get("protein/api/pdbe/interpro/").then((res)=>{
        // console.log(JSON.parse(res.data))
        // let data = JSON.parse(res.data)
        this.rowConfigData = res.data.rowConfigData
        this.sequence = res.data.sequence
        this.rcsb( this.rowConfigData)
      })
    },

    rcsb(rowConfigData) {
        // let rowConfigData = this.rowConfigData
        console.log(rowConfigData)
      const boardConfigData = {
        
        length: this.sequence.length,
        trackWidth: 600,
        rowTitleWidth: 140,
        includeAxis: true,
        //This function is called when a Feature is clicked.
        //It is also called on dblclick. This will clear the highlighted region and pass an undefined parameter to the function
        elementClickCallBack: (e) => {
          console.log(e)
          this.$emit('clickOnRcsb',e)
        },
      }
      const elementId = 'mypfv'+ this.viewkey
      let thispfv = new RcsbFv({
        boardConfigData,
        rowConfigData,
        elementId,
      })
    },
  },
}
</script>

<style>
</style>