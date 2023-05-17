<template>
  <div>
    <h1>pdbe Molstar</h1>
    <h4>PDBe Mol* AlphaFold Demo</h4>
    <div class="viewerSection">
      <!-- Molstar container -->
      <div id="myViewer"></div>
      <div id="gene"></div>
    </div>
    <div>
      <table>
        <tr v-for="item in data">
          <td style="width: 200px">{{ item }}</td>
          <td style="width: 800px"><div :id="'my' + item"></div></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
require('pdbe-molstar/build/pdbe-molstar-plugin-3.1.0')
require('molstar/build/viewer/molstar.css')
import * as d3 from 'd3'

var plot_gene_body = function (el, dataset, gene_length, max) {
  let width = 600
  let height = 80
  let box_height = 30
  let padding = { left: 10, right: 40, top: 20, bottom: 10 }
  console.log(d3)
  var linear = d3
    .scaleLinear()
    .domain([0, max])
    .range([0, width - padding.left - padding.right])

  console.log(linear(993))
  console.log(linear(675))

  var tooltip = d3
    .select('body')
    .append('el-tooltip')
    .attr('class', 'tooltip')
    .style('opacity', 0.0)

  let gene_svg = d3
    .select(el)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
  gene_svg
    .append('line')
    .attr('x1', padding.left)
    .attr('y1', padding.top)
    .attr('x2', width - padding.left - padding.right)
    .attr('y2', padding.top)
    .attr('stroke', 'red')

  gene_svg
    .selectAll('rect')

    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return linear(d[0])
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
      return d[3]
    })
    .on('mouseover', function (event, d, i) {
      // console.log(event)
      d3.select(this).attr('stroke', 'salmon').attr('stroke-width', 3)
      tooltip.transition().duration(200)
      tooltip
        .html('<p><b>Domain: </b> ' + d[2] + '</p>')
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 20 + 'px')
        .style('opacity', 1)
    })
    .on('mouseout', function (event, d, i) {
      d3.select(this).attr('stroke', 'black').attr('stroke-width', 1)
      tooltip.transition().duration(500).style('opacity', 0.0)
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
        .html('<p><b>Domain: </b> ' + d[2] + '</p>')
        .style('left', event.pageX + 'px')
        .style('top', event.pageY + 20 + 'px')
        .style('opacity', 1)
    })
    .on('mouseout', function (d, i) {
      tooltip.transition().duration(500).style('opacity', 0.0)
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
  // let axis = d3.svg
  //   .axis()
  //   .scale(linear) //指定比例尺
  //   .ticks(7) //指定刻度的数量
  //   .orient('bottom')
  //   .tickSize(2, 6)
  //   .tickValues(tv)

  let axis = d3.axisBottom(linear).tickValues(tv).tickSize(2, 6)
  console.log(axis)
  gene_svg
    .append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(10,45)')
    .call(axis)
}

export default {
  data() {
    return {
      data: [1, 2, 4, 5],
      dataset: [
        [30, 238, 'cas3_1', '#8DD3C7'],
        [305, 675, 'YlqF_related_GTPase', '#FFFFB3'],
        [667, 993, 'Cas7_I-E', '#BEBADA'],
      ],
      gene_length: 1020,
      max: 1020,
    }
  },

  mounted() {
    this.pdbe()
    // plot_gene_body('#gene', this.dataset, 1020, 1020)
    // this.vue_plot_geneBody()
  },

  methods: {
    vue_plot_geneBody() {
      this.data.forEach((item) => {
        console.log(item)
        plot_gene_body('#my' + item, this.dataset, 1020, 1020)
      })
    },
    pdbe() {
      //Create plugin instance
      var viewerInstance = new PDBeMolstarPlugin()

      //Set options (Checkout available options list in the documentation)
      var options = {
        customData: {
          url: 'https://alphafold.ebi.ac.uk/files/AF-O15552-F1-model_v1.cif',
          format: 'cif',
        },
        alphafoldView: true,
        bgColor: { r: 255, g: 255, b: 255 },
        hideCanvasControls: [
          'selection',
          'animation',
          'controlToggle',
          'controlInfo',
        ],
      }

      //Get element from HTML/Template to place the viewer
      var viewerContainer = document.getElementById('myViewer')

      //Call render method to display the 3D view
      viewerInstance.render(viewerContainer, options)
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.msp-plugin ::-webkit-scrollbar-thumb {
  background-color: #474748 !important;
}
.viewerSection {
  margin: 120px 0 0 50px;
}
#myViewer {
  float: left;
  width: 400px;
  height: 400px;
  position: relative;
}

.tooltip {
  position: absolute;
  padding: 1px 5px;
  width: 400px;
  height: auto;
  font-family: sans-serif;
  font-size: calc(11px + 1vmin);
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
  width: 600px;
  bottom: 100%;
  left: 20%;
  margin-left: -8px;
  width: 0;
  height: 0;
  border-bottom: 12px solid rgb(255, 255, 255);
  border-right: 12px solid transparent;
  border-left: 12px solid transparent;
  word-break: break-all;
}

text {
  font-family: sans-serif;
  font-size: calc(11px + 1vmin);
}

.axis path,
.axis line {
  fill: none;
  stroke: black;
  stroke-width: 2;
  shape-rendering: crispEdges;
}

.axis text {
  font-family: sans-serif;
  font-size: calc(11px + 1vmin);
}
</style>