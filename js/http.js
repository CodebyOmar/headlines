/**
 * HTTP function:
 * send request to remote server
 */
var HTTP = (method, endpoint, body = null) => {
  return new Promise( (resolve, reject) => {
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.open(method, endpoint, true);
    request.setRequestHeader("Authorization", "27b3f2e5064e4ddea8ca6ccd0e929428");

    request.onload = function () {
        if (request.status === 200) {
          resolve(request.response)
        }else {
          reject(request.response)
        }
    }

    request.onerror = function () {
      reject(Error("There is a network problem!"))
    }
    
    request.send();
  })
}
