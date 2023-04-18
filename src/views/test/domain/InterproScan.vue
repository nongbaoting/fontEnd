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
      sequence:
        'MIVLFVDFDYFYAQVEEVLNPSLKGKPVVVCVFSGRFEDSGAVATANYEARKFGVKAGIP\
IVEAKKILPNAVYLPMRKEVYQQVSSRIMNLLREYSEKIEIASIDEAYLDISDKVRDYRE\
AYNLGLEIKNKILEKEKITVTVGISKNKVFAKIAADMAKPNGIKVIDDEEVKRLIRELDI\
ADVPGIGNITAEKLKKLGINKLVDTLSIEFDKLKGMIGEAKAKYLISLARDEYNEPIRTR\
VRKSIGRIVTMKRNSRNLEEIKPYLFRAIEESYYKLDKRIPKAIHVVAVTEDLDIVSRGR\
TFPHGISKETAYSESVKLLQKILEEDERKIRRIGVRFSKFIEAIGLDKFFDT',
rowConfigData :[
        {
          trackId: 'sequenceTrack',
          trackHeight: 20,
          trackColor: '#FEFEFE',
          displayType: 'sequence',
          nonEmptyDisplay: true,
          rowTitle: 'SEQUENCE',
          trackData: [
            {
              begin: 1,
              value: this.sequence,
            },
          ],
        },
        {
          trackId: 'alternativeTrack2',
          rowTitle: 'Alt. n°6',
          trackHeight: 25,

          displayType: 'block',
          displayConfig: [
            {
              displayType: 'block',
              displayColor: '#27A3B4',
              displayData: [
                {
                  begin: 1,
                  end: 163,
                  gaps: [
                    { begin: 34, end: 69 },
                    { begin: 100, end: 120 },
                  ],
                  displayId: 'alt_6_domain_0',
                  sourceId: '#27A3B4',
                  featureId:
                    'Alt. n°6 • Dom. n°1 | Length: 356 [1-34;212-241;423-714] | Auth. position: 1 - 714',
                },
              ],
            },

            {
              displayType: 'block',
              displayColor: '#c08423',

              displayData: [
                {
                  begin: 164,
                  end: 236,
                  displayId: 'alt_6_domain_1',
                  sourceId: '#c08423',
                  featureId:
                    'Alt. n°6 • Dom. n°2 | Length: 177 | Auth. position: 35 - 211',
                },
              ],
            },

            {
              displayType: 'block',
              displayColor: '#D83E7C',
              displayData: [
                {
                  begin: 237,
                  end: 355,
                  displayId: 'alt_6_domain_1',
                  sourceId: '#D83E7C',
                  featureId:
                    'Alt. n°6 • Dom. n°2 | Length: 177 | Auth. position: 35 - 211',
                },
              ],
            },
          ],
        },
        {
          trackId: 'blockTrack',
          trackHeight: 20,
          trackColor: '#FEFEFE',
          displayType: 'block',
          displayColor: '#FF0000',
          rowTitle: 'ECOD Domain',
          trackData: [
            {
              featureId: 'a',
              begin: 1,
              end: 163,
              color: '#27A3B4',
              gaps: [{ begin: 61, end: 99, isConnected: 0 }],
            },
            {
              featureId: 'a',
              begin: 61,
              end: 99,
              color: '#1B9E77',
            },

            {
              begin: 164,
              end: 236,
              color: '#C08423',
            },

            {
              begin: 237,
              end: 355,
              color: '#D83E7C',
            },
          ],
        },
        {
          trackId: 'bondTrack',
          trackHeight: 20,
          trackColor: '#FEFEFE',
          displayType: 'bond',
          displayColor: '#6572E3',
          rowTitle: 'BOND',
          trackData: [
            {
              begin: 30,
              end: 90,
              isEmpty: true,
            },
          ],
        },
        {
          trackId: 'pinTrack',
          trackHeight: 20,
          trackColor: '#FEFEFE',
          displayType: 'pin',
          displayColor: '#65F253',
          rowTitle: 'PIN',
          trackData: [
            {
              begin: 60,
            },
            {
              begin: 70,
            },
            {
              begin: 100,
            },
          ],
        },
      ]
    }
  },
mounted(){
    this.rcsb()
},
  methods: {
    rcsb() {
        let rowConfigData = this.rowConfigData
      const boardConfigData = {
        
        length: this.sequence.length,
        trackWidth: 600,
        rowTitleWidth: 100,
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