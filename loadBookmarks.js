var keies = 'asdfghjklqwertyuiopzxcvbnm1234567890ASDFGHJKLQWERTYUIOPZXCVBNM';
var node = null;

function isFolder(node) {
  if(node.children)
    return true;
  return false;
}

function isPage(node) {
  if(node.children)
    return false;
  return true;
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

    // フォルダ
    if( isFolder(node[i]) )
      elements += '<img src="/images/folder64.png" width="16" class="favicon" />';

    // タイトルがなければURLを表示
    if(node[i].title === '') {
      if(node[i].url !== undefined)
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

    // 初期化
    node = roots[0].children[0].children;
    createHTML(node);
    
    window.addEventListener('keydown', function(e){

      var code = String.fromCharCode(e.keyCode);

      // if(e.metaKey) { // ⌘
      // 	document.getElementById('bookmark_list').innerHTML = '⌘';
      // }else if(e.ctrlKey) { // ^
      // 	document.getElementById('bookmark_list').innerHTML = '^';
      // }else if(e.altKey) { // ⌥
      // 	document.getElementById('bookmark_list').innerHTML = '⌥';
      // }

      var index = -1;
      if(e.shiftKey === false) { // ⇧
	code = code.toLowerCase();
      }
      index = keies.indexOf(code);
      if(index !== -1) {
	if( isPage(node[index]) ) {
	  chrome.tabs.create({
	    url : node[index].url
	  });
	} else {
	  createHTML(node[index].children);
	}
      }
      
      // targetWindowId = windowIds[targetTabId];
      // chrome.tabs.update(targetTabId, {selected: true});
      // chrome.windows.update(targetWindowId, {focused: true});
    });

  });
}
