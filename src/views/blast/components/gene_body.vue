<template></template>

<script>
import * as d3 from 'd3'
export default {
  props: ['dataset', 'gene_length', 'max'],
  data() {
    return {}
  },
  // watch: {
  //   dataset: function () {
  //     this.plot_gene_body()
  //   },
  // },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.plot_gene_body()
    })
  },
  methods: {
    plot_gene_body() {
      let dataset = this.dataset
      //   let max = d3.max(dataset, function (d) {
      //     return d[1]
      //   })
      // console.log('this')
      // console.log(this)
      let max = this.max
      let width_linear = d3.scaleLinear().domain([0, this.max]).range([0, 1200])

      let width = width_linear(this.gene_length)
      // let width = 1200
      let height = 80
      let box_height = 30
      let padding = { left: 10, right: 40, top: 20, bottom: 10 }

      

      // console.log(d3)
      var linear = d3
        .scaleLinear()
        .domain([0, this.gene_length])
        .range([1, width - padding.left - padding.right])

      var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0)
      // d3.select(this.$el).remove()
      let gene_svg = d3
        .select(this.$el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)

      gene_svg
        .append('line')
        .attr('x1', padding.left)
        .attr('y1', padding.top)
        .attr('x2', width - padding.left - padding.right + 1)
        .attr('y2', padding.top)
        .attr('stroke', 'red')

      gene_svg
        .selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', function (d) {
          return linear(d[0] + padding.left)
        })
        .attr('y', function (d, i) {
          if (i > 0) {
            if (dataset[i - 1][1] > d[0]) {
              return 15
            }
          }
          return 10
        })
        .attr('width', function (d) {
          return linear(d[1] - d[0])
        })
        .attr('height', box_height)
        .attr('stroke', 'steelblue')
        .attr('fill', function (d) {
          return d[4]
        })
        .on('mouseover', function (event, d, i) {
          // console.log(event)
          d3.select(this).attr('stroke', 'salmon').attr('stroke-width', 3)
          tooltip.transition().duration(200)
          tooltip
            .html('<p><b>' + d[2] + ', </b> ' + d[3] + '</p>')
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 20 + 'px')
            .style('opacity', 1)
        })
        .on('mouseout', function (event, d, i) {
          d3.select(this).attr('stroke', 'black').attr('stroke-width', 1)
          tooltip.transition().duration(200).style('opacity', 0.0)
          tooltip.selectAll('p').remove()
        })

      gene_svg
        .selectAll('text')
        .data(dataset)
        .enter()
        .append('text')
        .attr('class', 'svg_text')
        .attr('x', function (d) {
          return linear(d[0] + (d[1] - d[0]) / 2)
        })
        .attr('y', function (d, i) {
          if (i > 0) {
            if (dataset[i - 1][1] > d[0]) {
              return 35
            }
          }
          return 30
        })
        .text(function (d) {
          return d[2]
        })
        .style('text-anchor', 'middle')
        .on('mouseover', function (event, d, i) {
          tooltip.transition().duration(200)
          tooltip
            .html('<p><b>' + d[2] + ', </b> ' + d[3] + '</p>')
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 30 + 'px')
            .style('opacity', 1)
        })
        .on('mouseout', function (d, i) {
          tooltip.transition().duration(200).style('opacity', 0.0)
          tooltip.selectAll('p').remove()
        })

      // 坐标轴
      let ticksValues = function (value, num) {
        let span = value / num
        let arr = []
        for (let i = 0; i < num; i++) {
          let v = i * span
          arr.push(Math.ceil(v / 50) * 50)
        }
        arr.push(value)
        return arr
      }
      let tv = ticksValues(max, 7)
      console.log(tv)

      let axis = d3.axisBottom(linear).ticks(7)
      // console.log(axis)
      const axis_plot = gene_svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(10,45)')
        .call(axis)
    },
  },
}
</script>

<style >
/* gene body */
.tooltip {
  position: absolute;
  padding: 1px 5px;
  width: 400px;
  height: auto;
  font-family: sans-serif;
  font-size: calc(9px + 1vmin);
  color: black;
  border: 1px solid black;
  background-color: rgb(255, 255, 255);
  border-width: 2px solid rgb(255, 255, 255);
  border-radius: 2px;
  word-break: break-all;

}

.tooltip_p {
   border: 1px;
    padding: 2px;
}
.tooltip:after {
  content: '';
  position: absolute;
  width: 700px;
  bottom: 100%;
  left: 20%;
  margin-left: -80px;
  width: 0;
  height: 0;
  border-bottom: 12px solid rgb(255, 255, 255);
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
  word-break: break-all;
}

.svg_text {
  font-family: sans-serif;
  /* font-size: calc(5px + 1vmin); */
}

.axis path,
.axis line {
  fill: none;
  stroke: rgb(4, 4, 4);
  stroke-width: 1;
  shape-rendering: crispEdges;
}

/* .axis {
  font-size: calc(14px + 1vmin);
  font-family: sans-serif;
} */
</style>