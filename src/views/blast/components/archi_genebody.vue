<template></template>

<script>
var BrowserText = (function () {
  var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d')

  /**
   * Measures the rendered width of arbitrary text given the font size and font face
   * @param {string} text The text to measure
   * @param {number} fontSize The font size in pixels
   * @param {string} fontFace The font face ("Arial", "Helvetica", etc.)
   * @returns {number} The width of the text
   **/
  function getWidth(text, fontSize, fontFace) {
    context.font = fontSize + 'px ' + fontFace
    return context.measureText(text).width
  }

  return {
    getWidth: getWidth,
  }
})()

import * as d3 from 'd3'
export default {
  props: ['dataset', 'gene_length', 'max', 'show_len'],
  data() {
    return {}
  },

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
      let height = 100
      let box_height = 35
      let padding = { left: 10, right: 40, top: 35, bottom: 10 }
      let stroke_width = 35
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
        .attr('y1', padding.top + stroke_width / 2)
        .attr('x2', width - padding.right)
        .attr('y2', padding.top + stroke_width / 2)
        .attr('stroke', 'gray')
        .attr('stroke-width', stroke_width)
        .attr('stroke-opacity', 0.5)

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
              return padding.top + 10
            }
          }
          return padding.top
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
        .attr('x', function (d, i) {
          if (i > 0) {
            if (dataset[i - 1][1] > d[0]) {
              return linear(d[0] + (d[1] - d[0]) * 0.6)
            }
          }

          return linear(d[0] + (d[1] - d[0]) * 0.3)
        })
        .attr('y', function (d, i) {
          if (i > 0) {
            if (dataset[i - 1][1] > d[0]) {
              return padding.top + box_height * 0.66 + 10
            }
          }
          return padding.top + box_height * 0.66
        })

        .text(function (d) {
          let letters = d[2].split('')
          let textWidth = linear(BrowserText.getWidth(d[2], 40, 'sans-serif'))
          let rectWidth = linear(d[1] - d[0])
          let num = Math.ceil((rectWidth / 100) * letters.length)
          //   console.log(rectWidth)
          //   console.log(BrowserText.getWidth(d, 22, 'sans-serif')) // 105.166015625
          if (num > letters.length) {
            num = letters.length
          }

          return letters.slice(0, num).join('')
          //   return d[2]
        })

        .style('text-anchor', 'start')
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
      // let ticksValues = function (value, num) {
      //   let span = value / num
      //   let arr = []
      //   for (let i = 0; i < num; i++) {
      //     let v = i * span
      //     arr.push(Math.ceil(v / 50) * 50)
      //   }
      //   arr.push(value)
      //   return arr
      // }
      // let tv = ticksValues(max, 6)
      // //   console.log(tv)

      let axis = d3.axisTop(linear).ticks(7)
      // console.log(axis)
      const axis_plot = gene_svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(10,' + padding.top + ')')
        .call(axis)

      // add gene length text
      // if (this.show_len) {
      //   let gene_svg2 = d3
      //     .select(this.$el)
      //     .append('svg')
      //     .attr('width', 100)
      //     .attr('height', height)
      //   gene_svg2
      //     .append('g')
      //     .append('text')
      //     .attr('x', 2)
      //     .attr('y', padding.top + box_height * 0.66)
      //     .text(this.gene_length + ' AA')
      // }
    },
  },
}
</script>

<style >
/* gene body */
.tooltip {
  position: absolute;
  padding: 1px 5px;
  width: 600px;
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
  font-family: -sansserif;
  /* font-size: calc(9px + 1vmin); */
  font-size: calc(9px + 1vmin);
}

.axis path,
.axis line {
  fill: none;
  stroke: rgb(44, 39, 39);
  stroke-width: 2;
  shape-rendering: crispEdges;
}

.axis {
  font-size: calc(9px + 1vmin);
  font-family: sans-serif;
}
</style>