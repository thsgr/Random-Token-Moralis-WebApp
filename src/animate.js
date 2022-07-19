import {getRndInteger} from "./utils.js"

/* Random Token Animation START */

export function spin(img){
    img.removeAttribute('style');  
    var deg = getRndInteger(3600,7200);
    var css = '-webkit-transform: rotate(' + deg + 'deg);';
    img.setAttribute('style', css);
}

function spinThis(){
    this.removeAttribute('style');  
    var deg = 3600;
    var css = '-webkit-transform: rotate(' + deg + 'deg);';
    this.setAttribute('style', css);
}

var img = document.querySelector('img')
img.addEventListener('click', spinThis, false)


/* Random Token Animation END */