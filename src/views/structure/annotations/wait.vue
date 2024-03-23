<template>
  <div style="margin:60px">
    <el-row>
      <el-col :span="12" :offset="3">
        <h3>This page will refresh every 10 seconds until the job has completed. If the result page not appear please click the link below: </h3>
        <el-link type="success" :href="url" target="_blank"> To reuslt page</el-link>
        <h2>Job Status: <em>{{task_status}}</em></h2> 
        <p>Time duration: {{formatTime(timer)}} </p>
       
        
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      uuid: this.$route.query.uuid,
      job_name: this.$route.query.job_name,
      intervalId: null,
      intervalTimerID: null,
      task_status: 'uploaded',
      url: null,
      timer:0,
    }
  },

  mounted() {
    this.to_result()
  },
  methods: {
    check_job() {
       
      this.$http
        .get('protein/api/pdb_domain_annotations/check_job/', {
          params: {
            uuid: this.uuid,
            // end table
          },
        })
        .then((res) => {
          console.log(res.data)
        this.task_status = res.data.task_status
          if (res.data.task_status === 'SUCCESS') {
            clearInterval(this.intervalId)
            clearInterval( this.intervalTimerID )
            
            window.open(this.url)
            
          } else if (res.data.task_status == 'FAILURE') {
             clearInterval(this.intervalId)
              clearInterval( this.intervalTimerID )
          } else if (res.data.task_status == 'not_exist') {
             clearInterval(this.intervalId)
              clearInterval( this.intervalTimerID )
          }
        })
    },

    to_result() {
      let mypath = '/domain_annotation/annotationsResult'
            let routeData = this.$router.resolve({
              path: mypath,
              query: {
                uuid: this.uuid,
                job_name: this.job_name,
                
              },
            })
           
            this.url = routeData.href

      this.intervalId = setInterval(() => {
        // 调用查询函数
        this.check_job()
      }, 10000)
    this.intervalTimerID = setInterval(()=>{
      this.timer++ 
    },1000)

    },

  formatTime(time) {
      // 将时间格式化为 hh:mm:ss 的形式
      let hour = Math.floor(time / 3600);
      let minute = Math.floor((time - hour * 3600) / 60);
      let second = Math.floor(time - hour * 3600 - minute * 60);
      return `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    },

  },
}
</script>

<style></style>
