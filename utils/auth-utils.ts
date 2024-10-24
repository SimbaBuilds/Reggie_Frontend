export async function clearGoogleAuth() {
  // Clear Google's authentication cache
  const googleLogoutUrl = 'https://accounts.google.com/logout';
  
  // Create a hidden iframe to trigger Google logout
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  iframe.src = googleLogoutUrl;
  
  document.body.appendChild(iframe);
  
  // Remove iframe after logout
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);

  // Clear local storage and session storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear cookies related to Google auth
  document.cookie.split(";").forEach(function(c) {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
}

