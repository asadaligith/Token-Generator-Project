/**
 * Utility to load and initialize the Facebook SDK
 */

export const initFacebookSDK = () => {
  return new Promise((resolve, reject) => {
    // If already initialized, resolve immediately
    if (window.FB) {
      resolve();
      return;
    }

    // Set timeout to avoid hanging forever
    const timeout = setTimeout(() => {
      reject(new Error('Facebook SDK load timeout'));
    }, 10000);

    // Wait for SDK to load
    window.fbAsyncInit = function() {
      clearTimeout(timeout);
      window.FB.init({
        appId      : '1623127182236806', // Your Facebook App ID
        cookie     : true,
        xfbml      : true,
        version    : 'v18.0'
      });
      resolve();
    };

    // Load SDK script if not already present
    if (document.getElementById('facebook-jssdk')) {
      // If script exists but FB is not ready, we wait for fbAsyncInit
      return;
    }

    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  });
};

export const getFacebookLoginStatus = () => {
  return new Promise((resolve) => {
    window.FB.getLoginStatus((response) => {
      resolve(response);
    });
  });
};

export const facebookLogin = () => {
  return new Promise((resolve, reject) => {
    window.FB.login((response) => {
      if (response.authResponse) {
        resolve(response.authResponse);
      } else {
        reject(new Error('User cancelled login or did not fully authorize.'));
      }
    }, { scope: 'public_profile,email' });
  });
};
