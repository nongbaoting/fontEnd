<template>
  <div id="chart-container">
    
    <svg id="chart" :width="width" :height="height" ref="chart"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'

export default {
  props: ['dataset'],
  data(){
      return {
       height: window.innerHeight * .8,
       width: window.innerWidth * 0.4,
      }
  },
  mounted() {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
      this.plot_protein_body(this.dataset)
      console.log('width')
      console.log(this.width)
    })
  },

  watch:{
      dataset: function (oldDataset, newDataset) {
          this.plot_protein_body(this.dataset)
      }
},
computed: {
        svgWidth() {
           
          return Math.min(this.width, 600);
          
        },
        svgHeight() {
          return this.dataset.length * 50 + 50; // Adjust the height as needed
        }
      },
  methods: {
    plot_protein_body(data) {
       
      let dataset = sortDataAddIndex(data)
      console.log("data")

      console.log(data)
    
     d3.select(this.$refs.chart).selectAll("*").remove();
      let gene_svg = d3
        .select(this.$refs.chart)
        // .append('svg')
        // .attr('width', width)
        // .attr('height', height)
    
    
    let maxLength = data[0].qlen
     // Define scales and layout
    const xScale = d3.scaleLinear()
      .domain([0, maxLength]) // Adjust the domain based on your genomic positions
      .range([50, this.width]); // Adjust the range to position the rectangles horizontally

    const yScale = d3.scaleLinear()
      .domain([1, dataset.length]) // Adjust the domain based on the number of rows
      .range([this.height, 20]); // Adjust the range to position the rows vertically
     
    
     // rectangle
     let bar_height = 20
     gene_svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => xScale(d.qstart))
        .attr('y', d => d.index * (bar_height + 5) + 35 )
        .attr('width', d =>xScale(d.qend) - xScale(d.qstart) )
        .attr('height', bar_height)
        .attr('stroke', 'steelblue')
        .attr('fill', '#B3DE69')
        .on('mouseover', showTooltip )
        .on('mouseout', hideTooltip)
        .on('click', handleClick)
 
     let axis = d3.axisTop(xScale)
   gene_svg
        .append('g')
        .attr('class', 'axis')
        .attr('transform', 'translate(10,45)')
        .call(axis)
        .attr("font-size", "24px")


    // function
    let that = this
    function handleClick(event,d){
        console.log(d)
      let e = {
        chain: 'A',
        color: '#d95f02',
        start: d.qstart,
        end: d.qend,
      }
      that.$emit('clickOnSegment', e)
      // console.log(e)
    }

    let  tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0)
    function showTooltip(event,d){
        tooltip.transition().duration(200)
        d3.select(this).attr('stroke', 'salmon').attr('stroke-width', 3)
        tooltip
            .html('<p class = "tooltip_p"><b>Family Name:</b> ' + d.f_name +'<br><b>Domain Name:</b> ' + d.t_name +
             '<br><b>Target TMScore:</b> ' + d.ttmscore + 
             '<br><b>Probability:</b> ' + d.prob  +
             '<br><b>Evalue:</b> ' + d.evalue + 
             '</p>' 
            ) 
            .style('left', event.pageX + 'px')
            .style('top', event.pageY + 20 + 'px')
            .style('opacity', 1)
    }

    function hideTooltip() {
         d3.select(this).attr('stroke', 'steelblue').attr('stroke-width', 1)
       tooltip.selectAll('p').remove()
       tooltip.transition().duration(200).style('opacity', 0.0)
    }
    // function to sort
    function sortDataAddIndex(data){
        let objCopy = JSON.parse(JSON.stringify(data));;
        objCopy.sort((a,b) => a.qstart - b.qstart )
        
        let dataNew = objCopy.map((item,index) =>{
            item.index = index + 1
            return item;
        });
        return dataNew
    }

    },
  },
}
</script>

<style >
.tooltip {
  position: absolute;
  padding: 1px 5px;
  width: 500px;
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
  font-family: sans-serif;
  font-size: calc(9px + 1vmin);
}

.axis path,
.axis line {
  fill: none;
  stroke: rgb(4, 4, 4);
  stroke-width: 1;
  shape-rendering: crispEdges;
}


</style>