
<template>
  <div>
    <el-row>
      <el-col>
        <h1>Options for PSI-BLAST</h1>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>General search options</span>
          </div>
          <div class="psioptions" v-for="item in psiParams">
            <span
              ><b> {{ item.option }}</b> {{ item.type }}<br />
            </span>
            <span> {{ item.desc }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      direction: 'rtl',
      psiParams: [
        {
          option: '-evalue',
          type: '<Real>',
          desc: "Expectation value (E) threshold for saving hits Default = `10'",
        },
        {
          option: '-word_size',
          type: '<Integer, >=2>',
          desc: 'Word size for wordfinder algorithm',
        },
        {
          option: '-gapopen',
          type: '<Integer>',
          desc: 'Cost to open a gap',
        },
        {
          option: ' -gapextend ',
          type: '<Integer>',
          desc: ' Cost to extend a gap',
        },
        {
          option: '-matrix ',
          type: '<String>',
          desc: 'Scoring matrix name (normally BLOSUM62)',
        },
        {
          option: '-threshold ',
          type: ' <Real, >=0>',
          desc: 'Minimum word score such that the word is added to the BLAST lookup table',
        },
        {
          option: '-comp_based_stats ',
          type: '<String>',
          desc: 'Use composition-based statistics:\
       D or d: default (equivalent to 2 )\
       0 or F or f: No composition-based statistics\
       1: Composition-based statistics as in NAR 29:2994-3005, 2001\
       2 or T or t : Composition-based score adjustment as in Bioinformatics\
   21:902-911,\
       2005, conditioned on sequence properties\
       3: Composition-based score adjustment as in Bioinformatics 21:902-911,\
       2005, unconditionally\
   Default = "2"',
        },
      ],
    }
  },
  methods: {
    hoverOptions() {
      this.optionBG = {
        background: '#ffc',
      }
    },
    hasclosed() {
      this.$emit('funcInSon', false)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
  },
}
</script>

<style lang="less" scoped >
.input_text {
  font-size: 1.4em;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  margin-top: 0px;
}

/deep/ .el-card__body {
  padding: 20px;
}
.psioptions {
  padding: 5px;
  border: 2px;
  border-color: black;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  background: '#f5f5f5';
}

.psioptions:hover {
  background: #ffc;
}
</style>

