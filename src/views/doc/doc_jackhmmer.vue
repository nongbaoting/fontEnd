<template>
  <div>
    <el-row>
      <el-col>
        <h1>Options for jackhmmer</h1>
        <p>
          # jackhmmer :: iteratively search a protein sequence against a protein
          database<br />
          # HMMER 3.3.2 (Nov 2020);<a href=" http://hmmer.org/">
            http://hmmer.org/
          </a>
        </p>

        <pre class="code">{{ doc }}</pre>
      </el-col></el-row
    >
  </div>
</template>

<script>
export default {
  data() {
    var docs = `
Options controlling scoring system in first iteration:
  --popen <x>   : gap open probability
  --pextend <x> : gap extend probability
  --mx <s>      : substitution score matrix choice (of some built-in matrices)
  --mxfile <f>  : read substitution score matrix from file <f>

Options controlling reporting thresholds:
  -E <x>     : report sequences <= this E-value threshold in output  [10.0]  (x>0)
  -T <x>     : report sequences >= this score threshold in output
  --domE <x> : report domains <= this E-value threshold in output  [10.0]  (x>0)
  --domT <x> : report domains >= this score cutoff in output

Options controlling significance thresholds for inclusion in next round:
  --incE <x>    : consider sequences <= this E-value threshold as significant
  --incT <x>    : consider sequences >= this score threshold as significant
  --incdomE <x> : consider domains <= this E-value threshold as significant
  --incdomT <x> : consider domains >= this score threshold as significant

`
    return {
      doc: docs,
    }
  },
  mounted() {
    this.saveNavState()
  },
  methods: {
    saveNavState() {
      window.sessionStorage.setItem('activePath', '/sequence/blast')
    },
  },
}
</script>

<style lang="less">
.code {
  font-family: 'Courier New', monospace;
  font-size: 18px;
  background: #ffc;
}
</style>