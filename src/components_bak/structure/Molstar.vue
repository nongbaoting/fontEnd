<template>
  <div>
    <div id="molstar_large"></div>
  </div>
</template>

<script>
import { Viewer } from 'molstar/build/viewer/molstar'
import 'molstar/build/viewer/molstar.css'
export default {
  name: 'Molstar',

  data() {
    return {
      pdb: 'http://222.200.186.47/outputs/testPDB/model_1.pdb',
    }
  },
  mounted() {
    this.molstar()
  },

  methods: {
    getPDB() {
      this.$http({
        url: 'http://222.200.186.47/outputs/testPDB/model_1.pdb',
        // url: 'outputs/testPDB/model_1.pdb',
        // url: '/static/protein/testPDB/AF-P04637-F1-model_v1.pdb.gz',
        // http://222.200.186.47:8989/protein/static/protein/testPDB/AF-Q9NR63-F1-model_v1.pdb.gz
        method: 'GET',
        // responseType: 'blob', // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        // const link = document.createElement('a');
        // link.href = url;
        // link.setAttribute('download', 'file.pdf');
        // document.body.appendChild(link);
        // link.click();
      })
    },

    molstar(app_id) {
      this.$nextTick(function () {
        // Code that will run only after the
        // entire view has been re-rendered
        let viewer = new Viewer('molstar_large', {
          layoutIsExpanded: false,
          layoutShowControls: true,
          layoutShowRemoteState: false,
          layoutShowSequence: true,
          layoutShowLog: false,
          layoutShowLeftPanel: true,

          viewportShowExpand: false,
          viewportShowSelectionMode: false,
          viewportShowAnimation: true,
          // 'http://222.200.186.47/outputs/testPDB/AF-P04637-F1-model_v1.pdb.gz',
        })
        // viewer.loadPdb('7bv2')
        // viewer.loadEmdb('EMD-30210', { detail: 6 })

        // this.$http
        //   .get('/static/protein/testPDB/model_1.pdb', {
        //     headers: { 'Access-Control-Allow-Origin': '*' },
        //     crossdomain: true,
        //   })
        //   .then((response) => {
        //     console.log(response)
        //   })
        viewer.loadStructureFromUrl(this.pdb, 'pdb')
        console.log(this.pdb)
      })
    },
  },
}
</script>

<style  scoped>
#molstar_large {
  width: 100%;
  height: 100%;
}
</style>