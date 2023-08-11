document.addEventListener('DOMContentLoaded', (event) => {
    // Make sure the ethereum provider exists
    if (window.ethereum) {
      document.getElementById('connect-wallet').addEventListener('click', () => {
        window.ethereum
          .request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            console.log('Connected accounts:', accounts);
          })
          .catch((err) => {
            console.error('Error connecting to wallet:', err);
          });
      });
    } else {
      console.log('MetaMask is not installed. Please consider installing it: https://metamask.io/download.html');
    }
  });



  