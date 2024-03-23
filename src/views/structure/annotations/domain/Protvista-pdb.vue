<template>
  <div>
    <protvista-pdb custom-data="true" id="pv1"></protvista-pdb>
  </div>
</template>

<script>
// import * as d3 from 'd3'
// import "@/assets/EBI/d3.v4.min.js"
// import "@/assets/EBI/fonts.css"
// import "protvista-pdb/dist/protvista-pdb-3.3.0.js"

export default {
    props:['viewkey', "protein_id", "request_Data_url"],
  component: {
    // "protvista-pdb":protvista
  },
  mounted() {
    this.getData()
    document.addEventListener('protvista-click',this.handle_protvistaClick);
    document.addEventListener('protvista-mouseover',this.handle_protvistaMouseOver);
  
  },
  data() {
    return {
        customData: {}
    }
  },
  methods: {
    handle_protvista(customData) {
      const pvInstance = document.getElementById('pv1')
      pvInstance.viewerdata = customData
    },

    handle_protvistaMouseOver(e){
        // console.log('mouse_over')
        // console.log(e)
        let highlight= {
            'start':e.detail.start,
            "end":e.detail.end,
            "color":e.detail.color,
            }
        this.$emit('mouseOverPritvista', highlight)
    },

    handle_protvistaClick(e){
        console.log(e)
        console.log(e.detail)
        let data = {
            focus: {
            'start':e.detail.start,
            "end":e.detail.end,
            "color":e.detail.color,
            },
            fragments:e.detail.feature.locations[0].fragments,
            type: e.detail.feature.type
        }
        this.$emit('clickOnPritvista', data)
    },

    getData() {
      this.$http
        .get(this.request_Data_url, {
          params: {
            uuid: this.protein_id,
            request_type: 'protvista',
          },
        })
        .then((res) => {
          console.log("protvista")
          console.log(res.data)
          // let data = JSON.parse(res.data)
          this.customData = res.data
         this.handle_protvista(res.data)
           
        })
     
    },
  },
}
</script>

<style scoped>
</style>