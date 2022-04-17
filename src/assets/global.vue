<script>
const colorSet = [
  '#8DD3C7',
  '#FFFFB3',
  '#BEBADA',
  '#FB8072',
  '#80B1D3',
  '#FDB462',
  '#B3DE69',
  '#FCCDE5',
  '#D9D9D9',
  '#BC80BD',
  '#CCEBC5',
  '#FFED6F',
  '#1B9E77',
  '#D95F02',
  '#7570B3',
  '#E7298A',
  '#66A61E',
  '#E6AB02',
  '#A6761D',
  '#666666',
  '#543005',
  '#8C510A',
  '#BF812D',
  '#DFC27D',
  '#F6E8C3',
  '#C7EAE5',
  '#80CDC1',
  '#35978F',
  '#01665E',
  '#003C30',
]
// set3, dard2,'BrBG'

var myUnique = function (value, index, self) {
  return self.indexOf(value) === index
}

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
  colorSet,
  myUnique,
  plot_gene_body,
}
</script>