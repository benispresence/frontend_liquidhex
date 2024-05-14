document.addEventListener('DOMContentLoaded', () => {
    let web3;
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        console.log("MetaMask is available!");
        initializeApp(web3);
    } else {
        console.error("MetaMask is not found. Please install MetaMask.");
    };

    if (typeof ethers === 'undefined') {
        console.error('Ethers.js is not loaded');
        return;
    }
});

function initializeApp(web3) {
    const tokenAddress = '0x1e0D586Ce55581092dF1f35C27Fa8e3A86770Bf9';
    const tokenABI =  [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "mintingStartDate",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "mintingEndDate",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes32[]",
                    "name": "merkleProof",
                    "type": "bytes32[]"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_merkleRoot",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "ECDSAInvalidSignature",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "length",
                    "type": "uint256"
                }
            ],
            "name": "ECDSAInvalidSignatureLength",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "s",
                    "type": "bytes32"
                }
            ],
            "name": "ECDSAInvalidSignatureS",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "allowance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "needed",
                    "type": "uint256"
                }
            ],
            "name": "ERC20InsufficientAllowance",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "balance",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "needed",
                    "type": "uint256"
                }
            ],
            "name": "ERC20InsufficientBalance",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "ERC20InvalidSpender",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "timestamp",
                    "type": "uint256"
                }
            ],
            "name": "Claimed",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "hasClaimedId",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "merkleRoot",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ];

    let account;
    const connectionStatus = document.getElementById('connectionStatus');

    document.getElementById('connectWallet').addEventListener('click', async () => {
        try {
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            account = accounts[0];
            console.log('Connected:', account);
            connectionStatus.textContent = `Connected: ${account}`;
        } catch (error) {
            console.error('Error connecting:', error);
            connectionStatus.textContent = 'Connected: no connection';
        }
    });

    async function getCurrentGasPrices() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gasPrice = await provider.getGasPrice();
        console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
        return gasPrice;
    }

    document.getElementById('transferToken').addEventListener('click', async () => {
        const recipient = document.getElementById('recipientAddress').value;
        const amount = document.getElementById('tokenAmount').value;

        const functionSignature = web3.eth.abi.encodeFunctionSignature('transfer(address,uint256)');
        const data = functionSignature +
                  web3.eth.abi.encodeParameter('address', recipient).substr(2) + // Remove 0x for concatenation
                  web3.eth.abi.encodeParameter('uint256', amount).substr(2); // Remove 0x for concatenation
                     
        const gasPrice = await getCurrentGasPrices();
        const priorityFee = Math.round(gasPrice*0.2);
        const gasLimit = 150000;
        
        const transactionParameters = {
            to: tokenAddress, 
            from: account,
            data: data,
            value: ethers.utils.parseUnits('0.00', 'ether').toHexString(),
            gas: web3.utils.toHex(gasLimit),
            maxPriorityFeePerGas: web3.utils.toHex(priorityFee),
            maxFeePerGas: web3.utils.toHex(gasPrice),
        };

        try {
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            console.log('Transaction Hash:', txHash);
        } catch (error) {
            console.error('Error sending transaction:', error);
        }
    });

    document.getElementById('claimToken').addEventListener('click', async () => {
        const id = document.getElementById('stakeId').value;
        const amount = document.getElementById('claimAmount').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const merkleProof = document.getElementById('claimMerkleProof').value.split(',');
        const signature = document.getElementById('claimSignature').value || '0x';  // Handling empty signature

        const functionSignature = web3.eth.abi.encodeFunctionSignature('claim(uint256,uint256,uint256,uint256,bytes32[],bytes)');
        const data = functionSignature +
                     web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256', 'uint256', 'bytes32[]', 'bytes'], [id, amount, startDate, endDate, merkleProof, signature]).substr(2);
        
        const gasPrice = await getCurrentGasPrices();
        const priorityFee = Math.round(gasPrice*0.2);
        const gasLimit = 350000;

        const transactionParameters = {
            to: tokenAddress,
            from: account,
            data: data,
            value: ethers.utils.parseUnits('0.00', 'ether').toHexString(), // Convert 0 to hex string
            gas: web3.utils.toHex(gasLimit),
            maxPriorityFeePerGas: web3.utils.toHex(priorityFee),
            maxFeePerGas: web3.utils.toHex(gasPrice),
        };

        try {
            const txHash = await ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
            console.log('Transaction Hash:', txHash);
        } catch (error) {
            console.error('Error sending claim transaction:', error);
        }
    });

    document.getElementById('createSignature').addEventListener('click', async () => {
        const recipient = document.getElementById('signatureSender').value;
        const id = document.getElementById('signatureId').value;
        const amount = document.getElementById('signatureAmount').value;
        const data = {
            sender: recipient,
            id: id,
            amount: amount
        };
        const encoded_data = web3.eth.abi.encodeParameters(['address', 'uint256', 'uint256'], [data['sender'], data['id'], data['amount']]);
        const messageHash = ethers.utils.solidityKeccak256(['bytes'], [encoded_data]);

        try {
            const signature = await ethereum.request({
                method: 'personal_sign',
                params: [messageHash, account],
            });
            console.log('Signature:', signature);
            document.getElementById('signatureOutput').innerText = `Signature: ${signature}`;
        } catch (error) {
            console.error('Error signing message:', error);
        }
    });
}
