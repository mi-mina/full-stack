var theBody = document.getElementById("theBody");
var theDiv  = document.createElement("div");
var l = 400;
var st = 10;
var x = 30;
var y = 60;
var color = 0;
var the_timer;


function show_pattern() {
  while(l > 0){
    theDiv.style.position = "fixed"; //No confundir con theDiv.setAttribute
    theDiv.style.display = "block";
    theDiv.style.left = x + "px"; //si no añado "px" no funciona
    theDiv.style.top = y + "px";
    theDiv.style.height = l + "px";
    theDiv.style.width = l + "px";
    theDiv.style.backgroundColor = "hsl("+ color +", 80%, 80%)";
    theBody.appendChild(theDiv.cloneNode(true));
    //Si pongo solo .appenChild(theDiv) no funciona.
    l -= 2*st;
    x += st;
    y += st;
    color += 3;
  }
}

function change_color(){
  var myDivs = document.getElementsByTagName("div");
  for(var i = 0; i < myDivs.length; i++){
    var colorhsl = tinycolor(myDivs[i].style.backgroundColor);
    var h = colorhsl.toHsl().h;
    myDivs[i].style.backgroundColor = "hsl("+ (h + 3) +", 80%, 80%)";
  }
}

the_timer = setInterval(function(){show_pattern(); change_color();}, 50);
