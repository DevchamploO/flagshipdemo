// get the height for responsive aspect //var aspect_ratio = 1;

var $box = $(".lg-box");

function get_height(elem, aspect_ratio) {
  elem.css("height", elem.width() * aspect_ratio + "px");
  console.log(elem.width());
}

function init_height() {
  get_height($box, 1);
  get_height($(".tall-box"), 2);
  get_height($(".wide-box"), 0.3);
  get_height($(".short-oval"), 1.3);
  get_height($(".short-rectangle"), 1.3);
  get_height($(".full-width-rectangle"), 0.2);
  get_height($(".half-square"), 1);
}

init_height();

$(window).resize(function() {
  init_height();
});

var $grid = $(".grid").packery({
  percentPosition: true,
  itemSelector: ".grid-item",
  gutter: ".gutter-sizer"
});

// make all grid-items draggable
$('.grid-item').draggabilly({handle: '.move-btn'})

// Make items resizable from btn click
$(".resize-btn").click(function() {
  square = $(this)
    .parent()
    .parent();
  var currentWidth = square.width();
  var currentHeight = square.height();
  console.log(currentHeight);
  var isCountDown = $(this).data("isCountDown") || false;
  var initWidth;
  var initHeight;
  var multiplierWidth;
  var multiplierHeight;
  if ($(this).data("initWidth") === undefined) {
    $(this).data("initWidth", currentWidth);
    $(this).data("initHeight", currentHeight);
  }
  initWidth = $(this).data("initWidth");
  initHeight = $(this).data("initHeight");
  console.log("Data: " + $(this).data("initWidth"));
  multiplierWidth = initWidth / 4;
  multiplierHeight = initHeight / 4;
  console.log("old width:" + currentWidth);
  if (isCountDown == false) {
    currentWidth += multiplierWidth;
    currentHeight += multiplierHeight;
    square.width(currentWidth);
    square.height(currentHeight);
    if (Math.trunc(currentWidth) == Math.trunc(initWidth * 2)) {
      isCountDown = true;
      $(this).data("isCountDown", isCountDown);
    }
  } else if (isCountDown == true) {
    currentWidth -= multiplierWidth;
    currentHeight -= multiplierHeight;
    square.width(currentWidth);
    square.height(currentHeight);
    if (Math.trunc(currentWidth) == Math.trunc(initWidth)) {
      isCountDown = false;
      $(this).data("isCountDown", isCountDown);
    }
  }
  console.log("new width: " + currentWidth);
  $(".grid").packery();
});

// rotate shapes counter-clockwise
$(".rotate-btn").click(function() {
  parent = $(this).closest(".grid-item");
  var width = parent.css("width");
  var height = parent.css("height");
  console.log(width);
  console.log(height);
  var angle = parent.data("angle") + 45 || 45;
  console.log(angle);
  parent.css({ transform: "rotate(" + angle + "deg)" });
  parent.data("angle", angle);
  let indexValue = 2;
  parent.css("z-index", indexValue + "");
  if (angle >= 360) {
    parent.data("angle", 0);
  }
  $(".grid").packery();
});

// delete shape after prompt
$(".remove-btn").click(function() {
  var parent = $(this).closest(".grid-item");
  var toDelete = confirm(
    "Are you sure you wany to remove this shape? Once it is gone it cannot be returned."
  );
  if (toDelete) {
    parent.remove();
  }
});

// clone node of widget html
/*var cloned;

$(".clone").click(function() {
  var node = $(this)
    .parent()
    .parent()
    .children("iframe");
  // Node and children are cloned and stored
  cloned = node.get(0).cloneNode();
  alert("widget HTML is has been copied into Javascript variable cloned");
  console.log("widget HTML is has been copied into Javascript variable cloned");
});*/

// Upload images
//open modal
var parentframe;
var gridItem;
$(".open-modal-btn").click(function() {
  $(this).css("display", "block");
  parentframe = $(this)
    .parent()
    .parent()
    .children(".item-content");
  gridItem = $(this)
    .parent()
    .parent();
  console.log(gridItem);
});

$("#text-submit").click(function() {
  if (parentframe != 'undefined') {
    parentframe.empty();
  }
  var txt = $(this)
    .parent()
    .children("textarea")
    .val();
  parentframe.append('<p>'+txt+'</p>');
});

/* ------ upload to storage ------ */
$("#submit-img").click(function() {
  var $input = $(".file-upload");
  console.log($input);
  var file = $input[0].files[0];

  var reader = new FileReader();
  reader.onload = function() {
    var images = JSON.parse(localStorage.getItem("pics3")) || [];
    images[$input.index(".file-upload")] = reader.result;
    localStorage.setItem("pics3", JSON.stringify(images));
    showImages(images);
  };
  reader.readAsDataURL(file);
});

function showImages(content) {
  parentframe.empty();
  var images = content || JSON.parse(localStorage.getItem("pics3")) || [];
  images.forEach(function(image, i) {
    //$('<img />').prop('src', image).appendTo($('.image').eq(i));
  });
  parentframe.append($("<img />").prop("src", images[0]));
}

// add iframe
$("#submit-iframe").click(function() {
  parentframe.empty();
  var widgetLink = $(this)
    .parent()
    .children("textarea")
    .val();
  console.log(widgetLink);
  parentframe.append($("<iframe></iframe>").prop("src", widgetLink));
});

function onTabClick(event) {
  let activeTabs = document.querySelectorAll('.active');
  
  // deactivate existing active tab and panel
  // for( let i = 0; i < activeTabs.length; i++) {
  //   activeTabs[i].className = activeTabs[i].className.replace('active', '');
  // }
  
  activeTabs.forEach(function(tab) {
    tab.className = tab.className.replace('active', '');
  });
  
  // activate new tab and panel
  event.target.parentElement.className += ' active';
  document.getElementById(event.target.href.split('#')[1]).className += ' active';
}

var element = document.getElementById('nav-tab');

element.addEventListener('click', onTabClick, false);

//change colors of box appearance
var opacity;

//Initialize color picker
var background = new iro.ColorPicker("#colorpicker", {
  // color picker options
  // Option guide: https://iro.js.org/guide.html#color-picker-options
  width: 250,
  color: "rgb(255, 0, 0)",
  borderWidth: 1,
  borderColor: "#fff"
});

//set background color
$("#submit-styles").click(function() {
  gridItem.css("background", background.color.hexString);
  opacity = $("#background-opacity").val();
  if (opacity >= 0.0 && opacity <= 1.0) {
    gridItem.css("opacity", opacity);
  }
});

//Add name to footer
var name;
$(".submit-name").click(function() {
  name = $(this).parent().find(".add-name").val();
  $("#name").text(name);
});
