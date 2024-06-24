document.addEventListener('DOMContentLoaded', () => {
	/*
	// Initialize Select2 on the addressSelect element
    $('#addressSelect').select2({
        placeholder: "Add address to view",
        allowClear: true
    });
	*/
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
    const tokenAddress = '0xa73f450E3f17468A64BFdD222b099857Db76634d';
    const tokenABI =  [
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
	/*{
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
	},*/
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
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
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
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
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
				"name": "amount",
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
				"name": "amount",
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
			await fetchAndDisplayStakes(account);
			//await populateAddressSelect();
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

	document.getElementById('autoPopulate').addEventListener('click', async () => {
		const stakeId = document.getElementById('stakeId').value;
	
		if (!stakeId) {
			alert("Please enter a Stake ID.");
			return;
		}
	
		try {
			// Load and parse the CSV file
			const responseCSV = await fetch('merkle_tree_base.csv');
			const csvText = await responseCSV.text();
			const csvData = Papa.parse(csvText, { header: true }).data; // Use PapaParse library to parse CSV
	
			// Find the row with the matching Stake ID
			const row = csvData.find(row => row['id'] === stakeId);
	
			if (!row) {
				alert("Stake ID not found in CSV file.");
				return;
			}
	
			// Fill in the fields from the CSV file
			document.getElementById('claimAmount').value = row['amount'];
			document.getElementById('startDate').value = row['minting_start_date'];
			document.getElementById('endDate').value = row['minting_end_date'];
	
            // List of Merkle Proof CSV files
            const proofFiles = [
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_3_until_end_stake_id_174231.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_174242_until_end_stake_id_272449.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_272460_until_end_stake_id_338663.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_338667_until_end_stake_id_385896.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_385899_until_end_stake_id_433470.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_433472_until_end_stake_id_474864.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_474866_until_end_stake_id_513074.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_513075_until_end_stake_id_550468.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_550469_until_end_stake_id_584350.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_584351_until_end_stake_id_614067.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_614069_until_end_stake_id_650060.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_650062_until_end_stake_id_684853.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_684854_until_end_stake_id_722051.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_722054_until_end_stake_id_762413.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_762417_until_end_stake_id_55555516.csv'
            ];

            let proofRow = null;

            // Search through the Merkle Proof CSV files
            for (const file of proofFiles) {
                const [startStakeId, endStakeId] = file.match(/_stake_id_(\d+)_until_end_stake_id_(\d+)\.csv$/).slice(1, 3).map(Number);
                if (stakeId >= startStakeId && stakeId <= endStakeId) {
                    const responseProofCSV = await fetch(file);
                    const proofCSVText = await responseProofCSV.text();
                    const proofCSVData = Papa.parse(proofCSVText, { header: true }).data;

                    proofRow = proofCSVData.find(row => row['stake_id'] == stakeId);
                    if (proofRow) {
                        break;
                    }
                }
            }

            if (!proofRow || !proofRow['proof']) {
                alert("Merkle Proof not found in any CSV file.");
                return;
            }

            // Fill in the Merkle Proof field
            const claimMerkleProofElement = document.getElementById('claimMerkleProof');

            if (claimMerkleProofElement) {
                claimMerkleProofElement.value = proofRow['proof'];
            } else {
                console.error('Merkle Proof element not found.');
                return;
            }

		} catch (error) {
			console.error('Error auto populating fields:', error);
			alert("Error auto populating fields. Check the console for details.");
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

	async function isStakeClaimed(id) {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const contract = new ethers.Contract(tokenAddress, tokenABI, provider);
		const isClaimed = await contract.hasClaimedId(id);
		return isClaimed;
	}

	async function fetchAndDisplayStakes(account) {
		try {
			// Ensure account is lowercased for comparison
			const connectedAccount = String(account).trim().toLowerCase();

			console.log("Fetching and displaying stakes for account:", connectedAccount);

			// Fetch and parse the main CSV file
			const responseCSV = await fetch('merkle_tree_base.csv');
			const csvText = await responseCSV.text();
			const csvData = Papa.parse(csvText, { header: true }).data; // Use PapaParse library to parse CSV
			
			/*
			// Filter rows for the connected address and selected addresses
			const selectedAddresses = Array.from(addressSelect.selectedOptions).map(option => option.value.toLowerCase());
			console.log("Fetching and displaying stakes for selection:", selectedAddresses);
			*/

			const stakes = csvData.filter(row => {
				const eligibleAddress = String(row['eligible_address']).trim().toLowerCase();
				return eligibleAddress === connectedAccount // || selectedAddresses.includes(eligibleAddress);
			});

			// Get the table body element
			const tableBody = document.getElementById('stakesTable').getElementsByTagName('tbody')[0];
			tableBody.innerHTML = ''; // Clear any existing rows

             // Populate the table with stake data
			 for (const stake of stakes) {
				const row = tableBody.insertRow();
				row.insertCell(0).textContent = stake['id'];
				row.insertCell(1).textContent = stake['eligible_address'];
				row.insertCell(2).textContent = (stake['amount'] / 1e8).toFixed(0); // Format amount
				row.insertCell(3).textContent = new Date(stake['minting_start_date'] * 1000).toLocaleDateString(); // Format start date
				row.insertCell(4).textContent = new Date(stake['minting_end_date'] * 1000).toLocaleDateString(); // Format end date
	
				const isClaimed = await isStakeClaimed(stake['id']);
				console.log(`Stake ID: ${stake['id']}, Is Claimed: ${isClaimed}`);
				if (isClaimed) {
					row.insertCell(5).textContent = 'Stake already minted';
					row.style.backgroundColor = 'lightgreen'; // Highlight the row for claimed stakes
				} else {
					if (String(stake['eligible_address']).trim().toLowerCase() === connectedAccount) {
						row.style.backgroundColor = '#e67e22'; // Highlight the connected MetaMask address stakes
						const mintButton = document.createElement('button');
						mintButton.textContent = 'Mint';
						mintButton.addEventListener('click', () => initiateMint(stake));
						row.insertCell(5).appendChild(mintButton);
					} else {
						row.insertCell(5).textContent = ''; // Empty cell for non-connected addresses
					}
				}
			}
        } catch (error) {
            console.error('Error fetching and displaying stakes:', error);
        }
    }
/*
	async function populateAddressSelect() {
		try {
			// Fetch and parse the main CSV file
			const responseCSV = await fetch('merkle_tree_base.csv');
			const csvText = await responseCSV.text();
			const csvData = Papa.parse(csvText, { header: true }).data;

			// Clear any existing options
			addressSelect.innerHTML = '';

			// Populate the select options with unique eligible addresses
			const uniqueAddresses = [...new Set(csvData.map(row => String(row['eligible_address']).trim().toLowerCase()))];
			uniqueAddresses.forEach(address => {
				const option = document.createElement('option');
				option.value = address;
				option.textContent = address;
				addressSelect.appendChild(option);
			});

            // Re-initialize Select2 to update the options
            $('#addressSelect').select2({
                placeholder: "Add address to view",
                allowClear: true
            });
		} catch (error) {
			console.error('Error populating address select:', error);
		}
	}
*/
	async function initiateMint(stake) {
		try {
			const stakeId = stake['id'];
			const amount = stake['amount'];
			const startDate = stake['minting_start_date'];
			const endDate = stake['minting_end_date'];

			let proofRow = null;

            // List of Merkle Proof CSV files
            const proofFiles = [
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_3_until_end_stake_id_174231.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_174242_until_end_stake_id_272449.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_272460_until_end_stake_id_338663.csv',
                'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_338667_until_end_stake_id_385896.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_385899_until_end_stake_id_433470.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_433472_until_end_stake_id_474864.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_474866_until_end_stake_id_513074.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_513075_until_end_stake_id_550468.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_550469_until_end_stake_id_584350.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_584351_until_end_stake_id_614067.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_614069_until_end_stake_id_650060.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_650062_until_end_stake_id_684853.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_684854_until_end_stake_id_722051.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_722054_until_end_stake_id_762413.csv',
				'merkle_tree_proofs/merkle_tree_proofs_start_stake_id_762417_until_end_stake_id_55555516.csv'
            ];

            // Search through the Merkle Proof CSV files
            for (const file of proofFiles) {
                const [startStakeId, endStakeId] = file.match(/_stake_id_(\d+)_until_end_stake_id_(\d+)\.csv$/).slice(1, 3).map(Number);
                if (stakeId >= startStakeId && stakeId <= endStakeId) {
                    const responseProofCSV = await fetch(file);
                    const proofCSVText = await responseProofCSV.text();
                    const proofCSVData = Papa.parse(proofCSVText, { header: true }).data;

                    proofRow = proofCSVData.find(row => row['stake_id'] == stakeId);
                    if (proofRow) {
                        break;
                    }
                }
            }

			if (!proofRow || !proofRow['proof']) {
				alert("Merkle Proof not found in any CSV file.");
				return;
			}

			const merkleProof = proofRow['proof'].split(',');

			const signature = '0x'; // Add logic to handle signatures if needed

			const functionSignature = web3.eth.abi.encodeFunctionSignature('claim(uint256,uint256,uint256,uint256,bytes32[],bytes)');
			const data = functionSignature +
						web3.eth.abi.encodeParameters(['uint256', 'uint256', 'uint256', 'uint256', 'bytes32[]', 'bytes'], [stakeId, amount, startDate, endDate, merkleProof, signature]).substr(2);

			const gasPrice = await getCurrentGasPrices();
			const priorityFee = Math.round(gasPrice * 0.2);
			const gasLimit = 350000;

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
				console.error('Error sending claim transaction:', error);
			}
		} catch (error) {
			console.error('Error initiating mint:', error);
		}
	}


}
