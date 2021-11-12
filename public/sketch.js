
let oBox = document.querySelector('.box')
let oDiv1 = document.querySelector('.collage1')
// let oDiv2 = document.querySelector('.collage2')
//The position of the image relative to the browser when the mouse is pressed
let x 
let y 
let DELTA = 1.1 // The magnification of each zoom in/out

// Mouse down to get the position and add event listener
const mouseDown = e => {
    let transf1 = getTransform(oDiv1)
     //Image initial position
    x = e.clientX - transf1.transX 
    y = e.clientY - transf1.transY 
    document.addEventListener('mousemove', mouseMove)
    document.addEventListener('mouseup', mouseUp)
}
// Mouse drag update transform
const mouseMove = e => {
    let multiple = getTransform(oDiv1).multiple
    let moveX = e.clientX - x 
    let moveY = e.clientY - y 
    let newTransf1= limitBorder(oDiv1, oBox, moveX, moveY, multiple)
    oDiv1.style.transform = `matrix(${multiple}, 0, 0, ${multiple}, ${newTransf1.transX}, ${newTransf1.transY})`
}


// Mouse up Remove the listener
const mouseUp = () => {
    document.removeEventListener('mousemove', mouseMove)
    document.removeEventListener('mouseup', mouseUp)
}

// Mouse wheel zoom update transform
const zoom = e => {
    let transf1 = getTransform(oDiv1)
    if (e.deltaY < 0) {
        transf1.multiple *= DELTA 
    } else {
        transf1.multiple /= DELTA
    }
    let newTransf1 = limitBorder(oDiv1, oBox, transf1.transX, transf1.transY, transf1.multiple)
    oDiv1.style.transform = `matrix(${transf1.multiple}, 0, 0, ${transf1.multiple}, ${newTransf1.transX}, ${newTransf1.transY})`
}

/**
  * Obtain the transform matrix through getComputedStyle and split it with split
  * Such as oDiv's transform: translate(100, 100);
  * getComputedStyle can get "matrix(1, 0, 0, 1, 100, 100)"
  * When the transform attribute does not rotate rotate and stretch skew
  * The 1, 4, 5, and 6 parameters of metrix are multiples in the x direction, multiples in the y direction, offset in the x direction, and offset in the y direction
  * Respectively use string segmentation to get the corresponding parameters
  */
const getTransform = DOM => {
    let arr = getComputedStyle(DOM).transform.split(',')
    return {
        transX: isNaN(+arr[arr.length - 2]) ? 0 : +arr[arr.length - 2], 
        transY: isNaN(+arr[arr.length - 1].split(')')[0]) ? 0 : +arr[arr.length - 1].split(')')[0], 
        multiple: +arr[3] 
    }
}

/**
  * Get the x, y offset of the transform bounded by the border
  * innerDOM: inner box DOM
  * outerDOM: border box DOM
  * moveX: x moving distance of the box
  * moveY: the y moving distance of the box
  */
const limitBorder = (innerDOM, outerDOM, moveX, moveY, multiple) => {
    let { clientWidth: innerWidth, clientHeight: innerHeight, offsetLeft: innerLeft, offsetTop: innerTop } = innerDOM
    let { clientWidth: outerWidth, clientHeight: outerHeight } = outerDOM
    let transX
    let transY
   //When the enlarged picture exceeds the box, the picture can be dragged to align with the frame at most
    if (innerWidth * multiple > outerWidth || innerHeight * multiple > outerHeight) {
        if (innerWidth * multiple > outerWidth && innerWidth * multiple > outerHeight) {
            transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        } else if (innerWidth * multiple > outerWidth && !(innerWidth * multiple > outerHeight)) {
            transX = Math.min(Math.max(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        } else if (!(innerWidth * multiple > outerWidth) && innerWidth * multiple > outerHeight) {
            transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
            transY = Math.min(Math.max(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
        }
    }
      // When the picture is smaller than the box size, the picture cannot be dragged out of the frame
    else {
        transX = Math.max(Math.min(moveX, outerWidth - innerWidth * (multiple + 1) / 2 - innerLeft), -innerLeft + innerWidth * (multiple - 1) / 2)
        transY = Math.max(Math.min(moveY, outerHeight - innerHeight * (multiple + 1) / 2 - innerTop), -innerTop + innerHeight * (multiple - 1) / 2)
    }
    return { transX, transY }
}

const trans = () => {
  // Prohibit text/picture selection
    document.addEventListener('selectstart', e => { e.preventDefault() })
    // Mouse down event
    oDiv1.addEventListener('mousedown', mouseDown)
    // Picture zoom
    oDiv1.addEventListener('wheel', zoom)
}

trans()
