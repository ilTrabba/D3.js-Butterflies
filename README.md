# D3.js-Butterflies
Information Visualization Course project

# Task
This project visualizes 10 data cases, each with five positive quantitative variables, as small butterfly silhouettes on the screen.

The first variable determines the x-coordinate of each butterfly.

The second variable determines the y-coordinate.

The third variable determines the size of the butterfly’s wings.

The fourth and fifth variables are initially unused.

When a butterfly is clicked, all butterflies keep their x and y positions, but the wing size switches to use the fourth variable for all butterflies. Clicking again switches the wing size to use the fifth variable, and clicking once more cycles back to the third variable. This cycling repeats on subsequent clicks.

All position and size mappings use d3.js scales, allowing the data domain to be arbitrary while the display coordinates and butterfly sizes are mapped to appropriate screen ranges.

Transitions between wing sizes are animated smoothly for a fluid visual effect.

