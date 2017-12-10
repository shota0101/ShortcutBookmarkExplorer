var keies = 'asdfghjklqwertyuiopzxcvbnm1234567890ASDFGHJKLQWERTYUIOPZXCVBNM';

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

function createHTML(node){
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

  var windowIds = [];
  var keyAssigns = [];
  var elements = '';
  var tabsCount = node.length;
  var titleLimit = '';
  var tabElements = '';
  var tabBlockElements = '';
  var targetTabId = '';
  var targetWindowId = '';

  if(tabsCount > 50){
    titleLimit = 8;
    tabElementsWidth = '190px';
    tabBlockWidth = '160px';
  }else if(tabsCount <= 50 && tabsCount > 34){
    titleLimit = 16;
    tabElementsWidth = '260px';
    tabBlockWidth = '230px';
  }else if(tabsCount <= 34 && tabsCount > 17){
    titleLimit = 28;
    tabElementsWidth = '390px';
    tabBlockWidth = '360px';
  }else if(tabsCount <= 17 && tabsCount > 0){
    titleLimit = 58;
    tabElementsWidth = '790px';
    tabBlockWidth = '760px';
  }

  for(var i = 0; i < node.length; i++){
    if(i >= keies.length){
      break;
    }
    elements += '<div class="tab_element">';
    elements += '<div class="key">' + keies[i] + '</div>';
    elements += '<div class="tab_block">';
    if( isFolder(node[i]) ) {
      elements += '<img src="/images/folder64.png" width="16" class="favicon" />';
    }
    if(node[i].title === '') {
      elements += '<span class="tab_title">' + node[i].url.substr(0, titleLimit) + '</span>';
    } else {
      elements += '<span class="tab_title">' + node[i].title.substr(0, titleLimit) + '</span>';
    }
    elements += '</div>';
    elements += '<div class="clear"></div>';
    elements += '</div>';

    // keyAssigns[keies[i]] = node[i].id;
    // windowIds[tabs[i].id] = tabs[i].windowId;
  }

  document.getElementById('bookmark_list').innerHTML = elements;

  tabElements = document.getElementsByClassName('tab_element');
  tabBlockElements = document.getElementsByClassName('tab_block');

  for(var i = 0; i < node.length; i++){
    if(i >= keies.length){
      break;
    }
    tabElements[i].style.width = tabElementsWidth;
    tabBlockElements[i].style.width = tabBlockWidth;
  }

}

window.onload = function() {
  chrome.bookmarks.getTree(function(roots){

    var bookmarks = [];
    var bookmarkBar = roots[0].children[0].children;
    
    createHTML(bookmarkBar);
    
    window.addEventListener('keydown', function(e){
      if(e.shiftKey){
        targetTabId = keyAssigns[String.fromCharCode(e.keyCode)];
      }else{
        targetTabId = keyAssigns[String.fromCharCode((e.keyCode)).toLowerCase()];
      }
      targetWindowId = windowIds[targetTabId];
      chrome.tabs.update(targetTabId, {selected: true});
      chrome.windows.update(targetWindowId, {focused: true});
    });

  });
}
