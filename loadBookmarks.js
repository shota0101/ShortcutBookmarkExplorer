function isFolder(node) {
  if(node.children === undefined) {
    return false;
  } else {
    return true;
  }
}

function getDomain(url) {
  return url.split('/')[2];
}

// function getFaviconUrl(domain) {
//   const request = new XMLHttpRequest();
//   // request.open("GET", `https://api.github.com`);
//   request.open("GET", `https://www.google.com/s2/favicons?domain=developer.chrome.com`);
//   request.addEventListener("load", (event) => {
// 	console.log(event.target.status); // => 200
// 	console.log(event.target.responseText);
//   });
//   request.send();
// }

function getHtml(node){
  var html = '';
  for(var i = 0; i < node.length; i++){
    var title = node[i].title;
    html += title;
    if( isFolder(node[i]) ) {
      html += '<hr/>';
      continue;
    }
    if(title === '') {
      html += node[i].url;
    }
    html += '<hr/>';
  }
  return html;
}

window.onload = function() {
  chrome.bookmarks.getTree(function(roots){

    var keies = 'asdfghjklqwertyuiopzxcvbnm1234567890ASDFGHJKLQWERTYUIOPZXCVBNM';
    var bookmarks = [];
    var bookmarkBar = roots[0].children[0].children;
    var html = getHtml(bookmarkBar);

    document.getElementById('bookmark_list').innerHTML = html;
  });
}
