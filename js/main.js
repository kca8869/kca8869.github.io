
$("#portfolio").fadeOut();
var links=$(".header__nav-link");
for (var i = 0; i < links.length; i++) {

  $(links[i]).click(function () {
      if (this.text=="About") {
        $("#portfolio").fadeOut();
        $("#about").fadeIn();

      }
      if (this.text=="Portfolio") {
        $("#about").fadeOut();
        $("#portfolio").fadeIn();
      }
  })
}

var caccordionLinks=$(".caccordion__item--link");
var caccordionContent=$(".caccordion__item--content");
for (var i = 0; i < caccordionContent.length; i++) {
  $(caccordionContent[i]).fadeOut();
}
//display
for (var i = 0; i < caccordionLinks.length; i++) {
  if ($(caccordionLinks[i]).hasClass("active")) {
    $(caccordionContent[i]).fadeIn();
  }
}

//console.log(caccordionContent[i]);
for (var i = 0; i < caccordionLinks.length; i++) {
  $(caccordionLinks[i]).click(function () {
    for (var i = 0; i < caccordionLinks.length; i++) {
      $(caccordionLinks[i]).removeClass("active");
    }
    $(this).addClass("active");
    for (var i = 0; i < caccordionContent.length; i++) {
      $(caccordionContent[i]).fadeOut(0);
    }
    $("#"+this.id+"Content").fadeIn();
  })
}
