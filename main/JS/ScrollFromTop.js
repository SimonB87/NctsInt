window.onscroll = function() {setStickyMenu()};

function setStickyMenu() {
  if (document.body.scrollTop > 95 || document.documentElement.scrollTop > 95) {
    document.getElementsByTagName("html")[0].className = "scrolled";
  }else{
    document.getElementsByTagName("html")[0].className = "";
  }
}