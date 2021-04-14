# etch-a-sketch
<h2 align="center"><a  href="https://aurelien-genois.github.io/etch-a-sketch/">Live Demo</a></h2>

## Description
The [third Odin project](https://www.theodinproject.com/paths/foundations/courses/foundations/lessons/etch-a-sketch-project) for practice basic JavaScript (Arrays, Loops, DOM manipulation, ...). The goal of this project was initially to practice arrays, loops and DOM manipulation but I took this project to learn also how to combine colors (when changing opacity), how to change the mouse cursor and how to manage touch event (for drawing on mobile or tablet).

## Features
<p align="center">
<img src="screenshot-1.gif" alt="screenshot" width="50%"/><br>
</p>

- Can draw in the grid with your mouse (pen) by holding right click
- Can draw and fill by touching with finger
- Can erase with your mouse (eraser) by holding left click
- Can choose a color from the color picker or the history palette
 
 <br>
 <br>
<p align="center">
<img src="screenshot--2.gif" alt="screenshot" width="50%"/>
</p>

- Can change the opacity level, so the pen color is combined to the current grid cell color (additive mode)
- The opacity level is kept when changing the pen color (with the color picker or the history palette)
- Can fill an area of same color cells (opacity stills apply) when fill mode is activated with a switch checkbox
- An erase button can turn the pen/fill to an eraser (necessary for touch screens)
 
 <br>
 <br>
<p align="center">
<img src="screenshot--3.gif" alt="screenshot" width="50%"/>
</p>

- Can create a new grid (replace the current grid)
- Can choose the grid size when create a new grid



### UX feedbacks: 
- The mouse cursor turns to a pen, an eraser or a bucket showing which mode is active
- Newly color choosed with the color picker is automatically added to the history palette
- The current pen color with current opacity is displayed in a box at the top right corner
- An abstract square-patterned background reflects the pixel art function of this project and allows the perception of the opacity level of the current color in the current color box

## Challenges
The goal of this project was : DOM manipulation with arrays of DOM element (and with CSS grid)

I wanted to learn more on :

color additive for opacity (color format conversion)

fill mode // still not optimal because low performance with great grid) 

update mouse cursor icon and cursor position

switch button with css

Touch event
