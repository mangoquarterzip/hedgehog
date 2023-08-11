const TSS = "0x8531a5aB847ff5B22D855633C25ED1DA3255247e";

const ZETA_CONTRACT_DEPLOYMENT = "0x5270bfC224357Cbf7EB76C8fbBb5D49fD4b86934";
const minOutput = 0;

const ZRC20_GOERLI = "0x13A0c5930C028511Dc02665E7285134B6d11A5f4";
const ZRC20_MUMBAI = "0x48f80608B672DC30DC7e3dbBd0343c5F02C738Eb";
const ZRC20_BSC = "0xd97B1de3619ed2c6BEb3860147E30cA8A7dC9891";

function displayMessage() {
    console.log("");
  }
  

const getEncodedData = (zetaSwap, destination, destinationToken, minOutput) => {
    const paddedDestination = ethers.utils.hexlify(ethers.utils.zeroPad(destination, 32));
    const params = ethers.utils.defaultAbiCoder.encode(
      ["address", "bytes32", "uint256"],
      [destinationToken, paddedDestination, minOutput]
    );
    return zetaSwap + params.slice(2);
};

const switchChainsDestinationMumbai = async () => {
    const targetNetworkId = '0x13881';
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
        });
                //window.location.reload();
    } catch (error) {
        console.error('Error switching network:', error);
    }
};

const switchChainsDestinationGoerli = async () => {
    const targetNetworkId = '0x5';
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetNetworkId }],
        });
        //window.location.reload();
    } catch (error) {
        console.error('Error switching network:', error);
    }
};




async function checkMetaMaskConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('MetaMask connected and authenticated!');
        } catch (err) {
            console.error('User denied account access:', err);
        }
    } else {
        console.error('MetaMask not installed.');
    }
}

async function transferWithArbitraryData(encodedData) {
    try {
        if (typeof window.ethereum === 'undefined') {
            console.error('MetaMask not installed.');
            return;
        }
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        activeAccount = accounts[0];
        if (!accounts.length) {
            console.error('Please connect and authenticate with MetaMask first.');
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const txData = {
            to: TSS,
            value: ethers.utils.parseEther('0.01'),
            data: getEncodedData(ZETA_CONTRACT_DEPLOYMENT, activeAccount, ZRC20_GOERLI, minOutput)
        };
        console.log(txData);

        const tx = await signer.sendTransaction(txData);
        await tx.wait();
        console.log('Transaction successful!');
    } catch (err) {
        console.error('Error:', err);
    }
}

const sendButton = document.getElementById('send');
sendButton.addEventListener('click', () => {
    async function executeTransferAndSwitchChains() {
        // Need to make sure that we start with BSC
        await transferWithArbitraryData(); //BSC calls to ZETA
        setTimeout(displayMessage, 20000);
        await switchChainsDestinationMumbai(); //BSC switched to MUMBAI
        setTimeout(displayMessage, 20000);

//uniswap contract address 0x692345f94C6133186f6CfE10f94aDA8CfC4D70a4 deployed by me 

// this takes WETH as the input param and WMATIC as the output param


// Update the WETH contract address and ABI with the correct values
// this is goerli
const WethToWmaticContractAddress = '0x692345f94C6133186f6CfE10f94aDA8CfC4D70a4';
const wethtomaticabi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"name": "swapExactInputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "_swapRouter",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "DAI",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "poolFee",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "",
				"type": "uint24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapRouter",
		"outputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WETH9",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
 // Replace with the WETH contract ABI

async function WETHtoWMATIC() {
  try {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not installed.');
      return;
    }

    // Request account access if not connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });
	console.log("good1")

    // Set up the ethers provider and signer using MetaMask's provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
	console.log("good2")
    const signer = provider.getSigner();
	console.log("good3")

    // Create the contract instance using the WETH contract address and ABI
    const Contract = new ethers.Contract(WethToWmaticContractAddress, wethtomaticabi, signer);
	console.log("good4")

    // Convert 0.000001 WETH to its base unit (Wei)
    const amountIn = ethers.utils.parseUnits('0.000001', 18); // need to make this dynamic
	console.log("good5")

    // Call the withdraw function on the WETH contract
    const tx = await Contract.swapExactInputSingle(amountIn);
	console.log("good6")

    console.log('Withdraw transaction hash:', tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Withdrawal successful!');
  } catch (error) {
    console.error('Error while withdrawing WETH:', error);
  }
}
WETHtoWMATIC();
setTimeout(displayMessage, 2000);

// at this point the swap as been made so we have WMATIC
// now we need to unwrap it to MATIC

// Update the WETH contract address and wmaticABI with the correct values
const wmaticContractAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
const wmaticABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
 // Replace with the WETH contract wmaticABI

async function withdrawWMATIC() {
  try {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not installed.');
      return;
    }

    // Request account access if not connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Set up the ethers provider and signer using MetaMask's provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create the contract instance using the WETH contract address and wmaticABI
    const wethContract = new ethers.Contract(wmaticContractAddress, wmaticABI, signer);

    // Convert 0.01 WETH to its base unit (Wei)
    const wad = ethers.utils.parseUnits('0.00001', 18); //needs to be turned into dynamic with accounts[0]

    // Call the withdraw function on the WETH contract
    const tx = await wethContract.withdraw(wad);

    console.log('Withdraw transaction hash:', tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Withdrawal successful!');
  } catch (error) {
    console.error('Error while withdrawing WETH:', error);
  }
}

// Call the withdrawWMATIC function when you want to execute the withdrawal
withdrawWMATIC();
setTimeout(displayMessage, 2000);

        // now we have native MUMBAI tMATIC tokens
        await transferWithArbitraryData(); // MUMBAI calls ZETA
        setTimeout(displayMessage, 2000);

        await switchChainsDestinationGoerli(); // we switch to goerli now
        setTimeout(displayMessage, 2000);




        // Update the WETH contract address and ABI with the correct values
// this is goerli
const daiToWethContractAddress = '0xE349e66fF07179113d59fe79b075271895D70aaD';
const daiToWethabi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amountIn",
				"type": "uint256"
			}
		],
		"name": "swapExactInputSingle",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amountOut",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "_swapRouter",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "DAI",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "poolFee",
		"outputs": [
			{
				"internalType": "uint24",
				"name": "",
				"type": "uint24"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swapRouter",
		"outputs": [
			{
				"internalType": "contract ISwapRouter",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "USDC",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "WETH9",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
 // Replace with the WETH contract ABI

async function daiToWeth() {
  try {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not installed.');
      return;
    }

    // Request account access if not connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Set up the ethers provider and signer using MetaMask's provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create the contract instance using the WETH contract address and ABI
    const Contract = new ethers.Contract(daiToWethContractAddress, daiToWethabi, signer);

    // Convert 0.01 WETH to its base unit (Wei)
    const amountIn = ethers.utils.parseUnits('0.01', 18); // need to make this dynamic

    // Call the withdraw function on the WETH contract
    const tx = await Contract.swapExactInputSingle(amountIn);

    console.log('Withdraw transaction hash:', tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Withdrawal successful!');
  } catch (error) {
    console.error('Error while withdrawing WETH:', error);
  }
}

// Call the withdrawWETH function when you want to execute the withdrawal
daiToWeth();
setTimeout(displayMessage, 2000);

// now we have the wrapped token, we now need to unwrap

// Update the WETH contract address and ABI with the correct values
const wethContractAddress = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6';
const abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"guy","type":"address"},{"name":"wad","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"src","type":"address"},{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"wad","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"dst","type":"address"},{"name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"guy","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"dst","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"src","type":"address"},{"indexed":false,"name":"wad","type":"uint256"}],"name":"Withdrawal","type":"event"}];
 // Replace with the WETH contract ABI

async function withdrawWETH() {
  try {
    // Check if MetaMask is available
    if (typeof window.ethereum === 'undefined') {
      console.error('MetaMask not installed.');
      return;
    }

    // Request account access if not connected
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    // Set up the ethers provider and signer using MetaMask's provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    // Create the contract instance using the WETH contract address and ABI
    const wethContract = new ethers.Contract(wethContractAddress, abi, signer);

    // Convert 0.01 WETH to its base unit (Wei)
    const wad = ethers.utils.parseUnits('0.01', 18);

    // Call the withdraw function on the WETH contract
    const tx = await wethContract.withdraw(wad);

    console.log('Withdraw transaction hash:', tx.hash);

    // Wait for the transaction to be mined
    await tx.wait();

    console.log('Withdrawal successful!');
  } catch (error) {
    console.error('Error while withdrawing WETH:', error);
  }
}

// Call the withdrawWETH function when you want to execute the withdrawal
withdrawWETH();
setTimeout(displayMessage, 2000);

// now we have native ETH

/// END





    }
    executeTransferAndSwitchChains();
});