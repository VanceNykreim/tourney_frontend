function isAuthenticated() {
  var idToken = localStorage.getItem('idToken');
  return idToken ? true : false;
}

window.onload = function() {
  if (!isAuthenticated()) {
      window.location.href = '/login.html';
  }
};
