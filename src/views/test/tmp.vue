   sortChange1: function (column) {
      function compare(property, order) {
        return function (obj1, obj2) {
          var value1 = obj1[property]
          var value2 = obj2[property]
          if (order === 'ascending') {
            return value1 - value2 // 升序
          } else {
            return value2 - value1
          }
        }
      }
      function myorder_str(value1, value2) {
        if (value1 < value2) {
          return -1
        } else if (value1 > value2) {
          return 1
        } else {
          return 0
        }
      }
      function compare_str(property, order) {
        return function (obj1, obj2) {
          let value1 = obj1[property].toUpperCase()
          let value2 = obj2[property].toUpperCase()
          if (order === 'ascending') {
            return myorder_str(value1, value2) // 升序
          } else {
            return myorder_str(value2, value1)
          }
        }
      }
      console.log(column.column + '-' + column.prop + '-' + column.order)
      this.loading = true
      if (column.prop === 'desc') {
        this.tableData.sort(compare_str(column.prop, column.order))
      } else {
        this.tableData.sort(compare(column.prop, column.order))
      }

      this.loading = false
    },

    rangeFilter() {
      this.loading = true
      let arr = new Array()
      for (let i = 0; i < this.obtainData.length; i++) {
        if (
          this.obtainData[i]['target_len'] > this.protLen.min &&
          this.obtainData[i]['target_len'] < this.protLen.max &&
          this.obtainData[i].acc > this.ident.min &&
          this.obtainData[i].acc < this.ident.max &&
          this.obtainData[i].E_value < this.evalue.cutoff
        ) {
          arr.push(this.obtainData[i])
        }
      }
      this.tableData = arr
      this.descFilter()
      this.loading = false
    },



descFilter() {
      if (!this.searchContent) {
        return
      }
      let arr = new Array()
      let arr_ex = new Array()

      for (let i = 0; i < this.tableData.length; i++) {
        if (
          this.tableData[i]['desc']
            .toUpperCase()
            .indexOf(this.searchContent.toUpperCase()) != -1
        ) {
          arr.push(this.tableData[i])
        } else {
          arr_ex.push(this.tableData[i])
        }
      }
      if (!this.desc_exclude) {
        this.tableData = arr
      } else {
        this.tableData = arr_ex
      }
    },


    // queue(pageSize, currentPage) {
    //   this.loading = true
    //   console.log(this.$route.query.program)
    //   let that = this
    //   this.$http
    //     .post('/protein/api/blast/res/blast_jackhmmer/', {
    //       params: {
    //         uuid: this.$route.query.uuid,
    //         program: this.$route.query.program,
    //         // page
    //         pageSize: pageSize,
    //         currentPage: currentPage,
    //         // order
    //         field: this.field,
    //         order: this.order,
    //         //filter
    //         ident_min: this.ident.min,
    //         ident_max: this.ident.max,
    //         protLen_min: this.protLen.min,
    //         protLen_max: this.protLen.max,
    //         evalue: this.evalue.cutoff,
    //         searchContent: this.searchContent,
    //         desc_exclude: this.desc_exclude,
    //       },
    //     })
    //     .then((response) => {
    //       console.log(response.data.status)
    //       let status = response.data.status
    //       if (status == 200) {
    //         this.tableData = response.data.data
    //         this.totalCount = response.data.totalCount

    //         console.log(this.tableData)
    //       }
    //       this.loading = false
    //     })
    // },
