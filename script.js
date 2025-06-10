const svg = d3.select("svg");
const width = +svg.attr("width");
const height = +svg.attr("height");

const margin = 50;

let sizeCycle = ["v3", "v4", "v5"];
let sizeIndex = 0;
let currentSizeVar = sizeCycle[sizeIndex];

let sizeScale;

// Funzione silhouette farfalla
function butterflyPath(size) {
  const w = size;
  const h = size * 1.2;
  const bodyWidth = size * 0.15;
  const bodyHeight = size * 0.7;

  const topWing = (dir) => `
    M 0 0
    C ${dir * w * 0.6} ${-h * 0.9},
      ${dir * w * 0.9} ${-h * 0.3},
      ${dir * w * 0.4} 0
    C ${dir * w * 0.7} ${-h * 0.1},
      ${dir * w * 0.2} ${-h * 0.05},
      0 0
  `;

  const bottomWing = (dir) => `
    M 0 0
    C ${dir * w * 0.5} ${h * 0.6},
      ${dir * w * 0.8} ${h * 0.3},
      ${dir * w * 0.3} 0
    C ${dir * w * 0.5} ${h * 0.2},
      ${dir * w * 0.1} ${h * 0.15},
      0 0
  `;

  const body = `
    M ${-bodyWidth / 2} ${-bodyHeight / 2}
    L ${bodyWidth / 2} ${-bodyHeight / 2}
    Q 0 0, ${bodyWidth / 2} ${bodyHeight / 2}
    L ${-bodyWidth / 2} ${bodyHeight / 2}
    Q 0 0, ${-bodyWidth / 2} ${-bodyHeight / 2}
    Z
  `;

  return [
    topWing(1), topWing(-1),
    bottomWing(1), bottomWing(-1),
    body
  ].join(" ");
}

function antennaLeftPath(size) {
  return `
    M 0 -${size * 0.55}
    C -${size * 0.1} -${size * 0.8}, -${size * 0.15} -${size * 0.9}, -${size * 0.2} -${size * 0.95}
  `;
}

function antennaRightPath(size) {
  return `
    M 0 -${size * 0.55}
    C ${size * 0.1} -${size * 0.8}, ${size * 0.15} -${size * 0.9}, ${size * 0.2} -${size * 0.95}
  `;
}

d3.json("butterflies.json").then(data => {
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.v1))
    .range([margin, width - margin]);

  const yScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.v2))
    .range([margin, height - margin]);

  // Dominio unificato per v3, v4, v5
  const allSizes = data.flatMap(d => [d.v3, d.v4, d.v5]);
  const sizeDomain = d3.extent(allSizes);

  sizeScale = d3.scaleLinear()
    .domain(sizeDomain)
    .range([10, 40]);

  const butterflies = svg.selectAll(".butterfly-group")
    .data(data)
    .enter()
    .append("g")
    .attr("class", "butterfly-group")
    .attr("transform", d => `translate(${xScale(d.v1)},${yScale(d.v2)})`);

  butterflies.append("path")
    .attr("class", "butterfly")
    .attr("d", d => {
      const scaledSize = Math.round(sizeScale(d[currentSizeVar]));
      console.log(`Init - ${currentSizeVar} = ${d[currentSizeVar]}, scaled size = ${scaledSize}`);
      return butterflyPath(scaledSize);
    })
    .on("click", () => {
      sizeIndex = (sizeIndex + 1) % sizeCycle.length;
      currentSizeVar = sizeCycle[sizeIndex];
      updateSizes();
    });

  butterflies.append("path")
    .attr("class", "antenna antenna-left")
    .attr("d", d => antennaLeftPath(Math.round(sizeScale(d[currentSizeVar]))));

  butterflies.append("path")
    .attr("class", "antenna antenna-right")
    .attr("d", d => antennaRightPath(Math.round(sizeScale(d[currentSizeVar]))));

  function updateSizes() {
    butterflies.select(".butterfly")
      .transition()
      .duration(800)
      .attr("d", d => {
        const scaledSize = Math.round(sizeScale(d[currentSizeVar]));
        console.log(`Update - ${currentSizeVar} = ${d[currentSizeVar]}, scaled size = ${scaledSize}`);
        return butterflyPath(scaledSize);
      });

    butterflies.select(".antenna-left")
      .transition()
      .duration(800)
      .attr("d", d => antennaLeftPath(Math.round(sizeScale(d[currentSizeVar]))));

    butterflies.select(".antenna-right")
      .transition()
      .duration(800)
      .attr("d", d => antennaRightPath(Math.round(sizeScale(d[currentSizeVar]))));
  }
});
