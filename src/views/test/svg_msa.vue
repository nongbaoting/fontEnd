<template>
  <div>
    <h1>HelloWorld</h1>
    <div id="mymsa"></div>
  </div>
</template>

<script>
var msa = require('msa')
export default {
  mounted() {
    this.useMSseq()
  },
  methods: {
    useMSA() {
      var opts = {
        el: document.getElementById('mymsa'),
        vis: {
          conserv: false,
          overviewbox: false,
        },
        // smaller menu for JSBin
        menu: 'small',
        bootstrapMenu: true,
      }

      var m = new msa.msa(opts)
      m.u.file.importURL(
        'http://rostlab.org/~goldberg/jalv_example.clustal',
        function () {
          m.render()
        }
      )
    },
    useMSseq() {
      var fasta = '>seq1\n\
ACTG\n\
>seq2\n\
ACGG\n'

      // parsed array of the sequences
      var seqs = msa.io.fasta.parse(fasta)

      var m = msa.msa({
        el: document.getElementById('mymsa'),
        seqs: seqs,
      })
      m.render()
    },
  },
}
</script>

<style>
</style>