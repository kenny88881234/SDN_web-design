'use strict';

var topo_view = $('#topology');
var width = topo_view.width();
var height = topo_view.height();
var allSVGElem = {};
var svg = d3.select('#topology')
                   .attr("width", width)
                   .attr("height", height);
var i, j;
var d3_nodes = [],
    d3_links = [],
    sta_data = [3];

for (i=0;i<3;i++) {
    sta_data[i] = [5];
    for(j=0;j<5;j++) {
        sta_data[i][j] = new Object;
    }
}
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
	if(d.type === 'h') {
	    if(d.sta_data.flag == '1') {
		if(d.sta_data.limitnum == '1') {
	    	    return "<strong> Port : </strong> <span style='line-height: 15px;'>" + String(Number(d.port.port_no)-1) + "</span><br>" + "<strong> Ip : </strong> <span style='line-height: 50px;'>" + d.ipv4 + "</span><br>" + "<strong> 流速 : </strong> <span>" + d.speed + "</span><span style='line-height: 20px;'> Mb/s</span><br>" + "<strong> 總流量 : </strong> <span>" + d.totalflow + "</span><span style='line-height: 50px;'> G</span><br>" + "<strong style='color:red'> 已限制</strong> <span style='color:red'>" + "<strong style='color:red'> ( </strong> <span style='color:red'>8Mb/s</span><strong style='color:red'ne-height: 30px;> ) </strong><br>";
		}
		if(d.sta_data.limitnum == '2') {
                    return "<strong> Port : </strong> <span style='line-height: 15px;'>" + String(Number(d.port.port_no)-1) + "</span><br>" + "<strong> Ip : </strong> <span style='line-height: 50px;'>" + d.ipv4 + "</span><br>" + "<strong> 流速 : </strong> <span>" + d.speed + "</span><span style='line-height: 20px;'> Mb/s</span><br>" + "<strong> 總流量 : </strong> <span>" + d.totalflow + "</span><span style='line-height: 50px;'> G</span><br>" + "<strong style='color:red'> 已限制</strong> <span style='color:red'>" + "<strong style='color:red'> ( </strong> <span style='color:red'>2Mb/s</span><strong style='color:red'ne-height: 30px;> ) </strong><br>";
                }
		if(d.sta_data.limitnum == '3') {
                    return "<strong> Port : </strong> <span style='line-height: 15px;'>" + String(Number(d.port.port_no)-1) + "</span><br>" + "<strong> Ip : </strong> <span style='line-height: 50px;'>" + d.ipv4 + "</span><br>" + "<strong> 流速 : </strong> <span>" + d.speed + "</span><span style='line-height: 20px;'> Mb/s</span><br>" + "<strong> 總流量 : </strong> <span>" + d.totalflow + "</span><span style='line-height: 50px;'> G</span><br>" + "<strong style='color:red'> 已限制</strong> <span style='color:red'>" + "<strong style='color:red'> ( </strong> <span style='color:red'>斷線</span><strong style='color:red'ne-height: 30px;> ) </strong><br>";
                }
	    }
	    else {
		    return "<strong> Port : </strong> <span style='line-height: 15px;'>" + String(Number(d.port.port_no)-1) + "</span><br>" + "<strong> Ip : </strong> <span style='line-height: 50px;'>" + d.ipv4 + "</span><br>" + "<strong> 流速 : </strong> <span>" + d.speed + "</span><span style='line-height: 20px;'> Mb/s</span><br>" + "<strong> 總流量 : </strong> <span>" + d.totalflow + "</span><span style='line-height: 50px;'> G</span><br>" + "<strong style='color:green'> 未限制</strong>";
	    }
	} else if(d.type === 's') {
	    return "<strong>Switch</strong>";
	}
  });

var force = d3.layout.force()
              .gravity(0.4)
              .charge(-3000)
              .linkDistance(function (d) {
                  // XXX: I can't change link distance.....
                  if(d === 'c') {
                      return 100;
                  } else {
                      return 100;
                  }
              })
              .linkStrength(function (d) {
                  // XXX: no use?
                  if(d === 'c') {
                      return 1.5;
                  } else {
                      return 1.5;
                  }
              })
              .friction(0.7)
              .theta(0.3)
              .size([width, height]);

function linkExist(src, dst, links) {
    var index;
    for (index = 0; index < links.length; index++) {
        if (links[index].source === src && links[index].target === dst) {
            return true;
        }
        if (links[index].source === dst && links[index].target === src) {
            return true;
        }
    }
    return false;
}

function searchSwitchIndex(dpid, nodes) {
    var index;
    for (index = 0; index < nodes.length; index++) {
        if (nodes[index].dpid === dpid) {
            return index;
        }
    }
    return -1;
}

function forceTick(e) {
    var k = 0.1 * e.alpha;
    allSVGElem.links
        .attr('x1', function (d) { return d.source.x; })
        .attr('y1', function (d) {
                if (d.source.y + 20 > height) {
                    return height - 20;
                } else {
                    return d.source.y;
                }
                if (d.source.y - 20 < height) {
                    return height + 20;
                } else {
                    return d.source.y;
                }
        })
        .attr('x2', function (d) { return d.target.x; })
        .attr('y2', function (d) {
                if (d.target.y > height) {
                    return height;
                } else {
                    return d.target.y;
                }
                if (d.target.y < height) {
                    return height;
                } else {
                    return d.target.y;
                }
        });

    allSVGElem.nodes
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) {
            // give it limit!
                if (d.y - 20 > height) {
                    return height;
                } else {
                    return d.y;
                }
                if (d.y - 20 < height) {
                    return height;
                } else {
                    return d.y;
                }
        })
	.attr('x', function (d) { return d.x; })
        .attr('y', function (d) {
            // give it limit!
                if (d.y - 20 > height) {
                    return height;
                } else {
                    return d.y;
                }
                if (d.y - 20 < height) {
                    return height;
                } else {
                    return d.y;
                }
        });
}

function loadStatusData(err, statusdata) {

        if (err) {
                console.log(err);
                console.log('Error on loading data!');
                return;
        }

        var i,j;

        var status_data = statusdata;

        for (i = 1; i < 2; i++) {
	    for(j = 1; j < 4; j++) {
            //status_data.1.String(index).type = 'p';
	    	sta_data[i][j+1].limitnum = status_data[String(i)][String(j)].limitnum;
		sta_data[i][j+1].flag = status_data[String(i)][String(j)].flag;
	    }
        }
	console.log("success!");
	console.log(sta_data);
}

function loadData(err, data) {

    	if (err) {
        	console.log(err);
        	console.log('Error on loading data!');
        	return;
    	}

    	var index;
	var i,j;

        var switches = data.switch,
            links = data.link,
            hosts = data.host;

	d3_nodes = [];
	d3_links = [];
        for (index = 0; index < switches.length; index++) {
            switches[index].type = 's';
            d3_nodes.push(switches[index]);
        }
	
	var flow_data = new Array(3); //建立空的資料陣列
	for(i=0;i<3;i++) {
    	    flow_data[i] = new Array(5);
    	    for(j=0;j<5;j++) {
        	flow_data[i][j] = [];
    	    }
	}
 
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
    	    if (this.readyState == 4 && this.status == 200) {
        	var total_data = JSON.parse(this.responseText);
        	for(i=0;i<total_data.length;i++) {
            	    flow_data[total_data[i].dpid][total_data[i].port_no].push({"num" : Number(total_data[i].speed_flow), "num2" : Number(total_data[i].tx_flow) + Number(total_data[i].rx_flow)});
        	}
console.log(flow_data);
		for (index = 0; index < hosts.length; index++) {
            	    hosts[index].type = 'h';
            	    for (i=1;i<3;i++) {
                	for (j = 2; j < 5; j++) {
                    	    if(i == Number(hosts[index].port.dpid) && j == Number(hosts[index].port.port_no) && sta_data[i][j].hasOwnProperty('flag')){
                        	hosts[index].sta_data = new Object;
                        	hosts[index].sta_data.flag = sta_data[i][j].flag;
                        	hosts[index].sta_data.limitnum = sta_data[i][j].limitnum;
                        	hosts[index].speed = String(Number(flow_data[i][j][flow_data[i][j].length-1].num)/1000000);
                        	hosts[index].totalflow = String(Number(flow_data[i][j][flow_data[i][j].length-1].num2)/1000000000);
                    	    }
                	}
            	    }
            	    // get index of host before push it.
            	    var host_index = d3_nodes.length,
                    switch_index = searchSwitchIndex(hosts[index].port.dpid, d3_nodes);
            	    d3_nodes.push(hosts[index]);

            	    // add host to switch link.
            	    d3_links.push({source: host_index, target: switch_index, type: 'h'});
        	}
		console.log(d3_nodes);
		for (index = 0; index < links.length; index++) {
                    var src_dpid = links[index].src.dpid,
                    dst_dpid = links[index].dst.dpid,
                    src_index = searchSwitchIndex(src_dpid, d3_nodes),
                    dst_index = searchSwitchIndex(dst_dpid, d3_nodes);
            	    if (!linkExist(src_index, dst_index, d3_links)) {
                	d3_links.push({source: src_index, target: dst_index, type: 's'});
            	    }
        	}
        	force.nodes(d3_nodes)
             	     .links(d3_links)
                     .start();
        	force.on('tick', forceTick);

        	allSVGElem.links = svg.selectAll('.link')
            		  .data(d3_links)
            		  .enter()
            	  	  .append('line')
            		  .attr('class', 'link')
            		  .style("stroke-width", function (d) {
                		if (d.type === 'c') {
                    		    return 5;
                		} else {
                    		    return 3;
                		}
            		  })
            		  .style("stroke", function (d) {
                		if (d.type === 'h') {
                    		    // host to switch link
                    		    return '#F00';
                		} else if (d.type === 's') {
                    		    // switch to switch link
                    		    return '#00F';
                		}
            		  });
		allSVGElem.nodes = svg.selectAll('.node')
            		  .data(d3_nodes)
            		  .enter()
            		  .append('circle')
            		  .attr('fill', function (d) {
                		if (d.type === 's') {
                    		    return '#05A';
                		} else {
                    		    return '#090';
                		}
            		  })
            		  .attr('r', function (d) {
                		if (d.type === 's') {
                    		    return '20';
                		} else {
                    		    return '15';
                		}
            		  })
            		  .attr('class', 'node')
            		  .on("dblclick", function(d) { d3.select(this).classed("fixed", d.fixed = true); })
            		  .on('mouseover', tip.show)
            		  .on('mouseout', tip.hide)
            		  .call(force.drag)
            		  .call(tip);
    	    }
	}
    xmlhttp.open("GET", "getlittleflowdata.php", true);
    xmlhttp.send();
}

function myrefresh()
{
    $(".topo").load(location.href + " .topo");
    topo_view = $('#topology');
    width = topo_view.width();
    height = topo_view.height();
    force = d3.layout.force()
              .gravity(0.4)
              .charge(-3000)
              .linkDistance(function (d) {
                  // XXX: I can't change link distance.....
                  if(d === 'c') {
                      return 100;
                  } else {
                      return 100;
                  }
              })
              .linkStrength(function (d) {
                  // XXX: no use?
                  if(d === 'c') {
                      return 1.5;
                  } else {
                      return 1.5;
                  }
              })
              .friction(0.7)
              .theta(0.3)
              .size([width, height]);
    d3.json('everydaylimit.json', loadStatusData);
    d3.json('topo_data.json', loadData);
}
d3.json('everydaylimit.json', loadStatusData);
d3.json('topo_data.json', loadData);
setInterval('myrefresh()',30000);
