<template>
  <div class="container">
    <el-row :gutter="20"
      ><el-col :span="22" :offset="1">
        <el-card>
          <el-form ref="filterForm" :model="filterForm">
            <!-- TODO input title -->
            <el-row :gutter="5" class="align_text_center"
              ><el-col :span="4"><span>Key word type</span></el-col
              ><el-col :span="8">Key word</el-col>
              <el-col :span="6">Count</el-col>
              <el-col :span="4">
                <el-button icon="el-icon-plus" @click.prevent="addDomain()"
                  >Add Keyword</el-button
                >
              </el-col>
            </el-row>
            <el-form-item
              v-for="(domain, index) in filterForm.domains"
              :key="'cdd_domains.' + index + '.value'"
              :prop="'domains.' + index + '.value'"
            >
              <el-row :gutter="5">
                <el-col :span="18">
                  <el-input
                    :placeholder="'Search by CD Keyword'"
                    v-model="domain.value"
                  >
                    <el-select v-model="domain.type" slot="prepend" prop="type'"
                      ><el-option
                        label="CD Name"
                        value="cdd_nameCat"
                      ></el-option>
                      <el-option
                        label="CD Description"
                        value="cdd_noteCat"
                      ></el-option>
                      <el-option
                        label="Protein Description"
                        value="desc"
                      ></el-option>
                    </el-select>

                    <el-input-number
                      controls-position="right"
                      :min="1"
                      slot="append"
                      v-model="domain.count"
                      :prop="'domains.' + index + '.count'"
                    ></el-input-number>
                  </el-input>
                </el-col>

                <el-col :span="2.5">
                  <el-checkbox
                    border
                    :prop="'domains.' + index + '.exclude'"
                    v-model="domain.exclude"
                    >Exclude</el-checkbox
                  >
                </el-col>

                <el-col :span="2.5" v-if="index > 0"
                  ><el-button @click.prevent="removeDomain(domain)"
                    >Delete</el-button
                  ></el-col
                >
              </el-row>
            </el-form-item>

            <el-form-item>
              <el-row :gutter="10">
                <el-col :span="8" class="center"
                  ><span> Target Length </span></el-col
                >
                <!-- <el-col :span="8" class="center"><span>RMSD</span></el-col> -->

                <el-col :span="8" class="center"
                  ><span>Sequence Identity</span></el-col
                >
              </el-row>
              <el-row :gutter="10">
                <!-- Target Length -->
                <el-col :span="8">
                  <el-col :span="10"
                    ><el-input
                      type="number"
                      v-model="filterForm.target_len.min"
                    >
                    </el-input
                  ></el-col>
                  <el-col :span="1" class="inline"><span>-</span></el-col>
                  <el-col :span="10"
                    ><el-input
                      type="number"
                      v-model="filterForm.target_len.max"
                    >
                    </el-input></el-col
                ></el-col>

                <!-- SEQID ident -->
                <el-col :span="8">
                  <el-col :span="10"
                    ><el-input type="number" v-model="filterForm.ident.min">
                    </el-input
                  ></el-col>
                  <el-col :span="1" class="inline"><span>-</span></el-col>
                  <el-col :span="10"
                    ><el-input type="number" v-model="filterForm.ident.max">
                    </el-input></el-col
                ></el-col>
              </el-row>
            </el-form-item>
            <!-- source -->
            <el-form-item
              label-width="120px"
              label="CD Source:"
              props="filterForm.anno_source"
            >
              <el-select v-model="filterForm.anno_source" style="width: 400px">
                <el-option label="ALL (58235 PSSMs)" value="all"></el-option>
                <el-option
                  label="NCBI_Curated (17937 PSSMs)"
                  value="ncbi"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="Submit()"
                >Filter Result</el-button
              >
              <!-- <el-button @click="resetForm('filterForm')">Reset</el-button> -->
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ['filterForm'],
  data() {
    return {
      // filterForm: JSON.parse(JSON.stringify(filterForm_ori)),
    }
  },
  methods: {
    Submit() {
      console.log(this.filterForm)
      this.filterForm['currentPage'] = this.currentPage
      this.filterForm['pageSize'] = this.pageSize
      this.$emit('filter_result', this.filterForm)
    },
    resetForm(formName) {
      console.log('reset ' + formName)
      this.$refs[formName].resetFields()
    },

    removeDomain(item) {
      var index = this.filterForm.domains.indexOf(item)
      if (index > 0) {
        this.filterForm.domains.splice(index, 1)
      }
    },
    addDomain() {
      this.filterForm.domains.push({
        type: 'cdd_nameCat',
        value: '',
        count: 1,
        exclude: false,
        // key: Date.now(),
      })
    },
  },
}
</script>

<style >
.center {
  text-align: center;
}

.el-select {
  width: 140px;
}
</style>