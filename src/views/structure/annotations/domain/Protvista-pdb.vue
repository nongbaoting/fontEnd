<template>
  <div>
       <protvista-pdb accession="P05067" id="pv1"></protvista-pdb>
  </div>
</template>

<script>
import * as d3 from 'd3'
import "protvista-pdb/dist/protvista-pdb-3.3.0.js"
export default {
    component:{
// "protvista-pdb":protvista
    },
    mounted(){
        window.d3 = d3;
    },
    data(){
        return{

        }
    },
    methods:{

    }

}
</script>

<style scoped>

</style>