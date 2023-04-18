import * as d3 from "d3";


export function responsivefy(svg: d3.Selection<SVGSVGElement, any, HTMLElement, any> | any) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode.parentNode),
        
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;
    console.log("container", container, "width", width, "height", height);
    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        console.log("target-width", targetWidth)
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}