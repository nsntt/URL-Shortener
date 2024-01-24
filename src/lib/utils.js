export function validarURL(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          return true;
        } else {
            return  false;
        }
      }
    };
    xhr.open('GET', url, true);
    xhr.send();
  }