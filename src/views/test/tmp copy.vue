<el-table-column label="Max Score">
            <template slot-scope="scope">
              {{ scope.row.fields.tools.replace(',', ', ') }}
            </template>
          </el-table-column>
          <el-table-column label="Total Score">
            <template slot-scope="scope">
              {{ format_date(scope.row.fields.upload_date) }}
            </template>
          </el-table-column>
          <!--  E value -->
          <el-table-column sortable prop="fields.run_status" label="E value">
            <el-table-column prop="fields.run_status">
              <template slot="header" slot-scope="scope">
                <el-button type="text" @click="evalue_dialogVisible = true"
                  >< {{ evalue.cutoff }}</el-button
                >
              </template>
              <template slot-scope="scope">
                {{ scope.row.fields.run_status }}
              </template>
            </el-table-column>
          </el-table-column>
          <!-- query -->
          <el-table-column
            sortable
            prop="fields.run_status"
            label="Query cover"
          >
            <el-table-column prop="fields.run_status">
              <template slot="header" slot-scope="scope">
                <el-button type="text" @click="query_dialogVisible = true"
                  >Range: {{ query.min }} ~ {{ query.max }}</el-button
                >
              </template>
              <template slot-scope="scope">
                {{ scope.row.fields.run_status }}
              </template>
            </el-table-column>
          </el-table-column>
          <!-- protein length -->
          <el-table-column
            sortable
            prop="fields.run_status"
            label="Subject Length"
          >
            <el-table-column prop="fields.run_status">
              <template slot="header" slot-scope="scope">
                <el-button type="text" @click="protLen_dialogVisible = true"
                  >Range: {{ protLen.min }} ~ {{ protLen.max }}</el-button
                >
              </template>
              <template slot-scope="scope">
                {{ scope.row.fields.run_status }}
              </template>
            </el-table-column>
          </el-table-column>

          <!-- identity -->
          <el-table-column sortable label="Identity">
            <el-table-column prop="fields.run_status" label="Identity">
              <template slot="header" slot-scope="scope">
                <el-button type="text" @click="ident_dialogVisible = true"
                  >Range: {{ ident.min }} ~ {{ ident.max }}</el-button
                >
              </template>
              <template slot-scope="scope">
                {{ format_date(scope.row.fields.completed_date, '-') }}
              </template>
            </el-table-column>
          </el-table-column>
        