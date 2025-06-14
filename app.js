document.addEventListener('DOMContentLoaded', () => {
    initializeEmptyTable();

    let web3;
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        console.log("MetaMask is available!");
        initializeApp(web3);
    } else {
        console.error("MetaMask is not found. Please install MetaMask.");
    }

    if (typeof ethers === 'undefined') {
        console.error('Ethers.js is not loaded');
        return;
    }


});

function initializeEmptyTable() {
    const tableBody = document.getElementById('stakesTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Clear any existing rows

    // Add 10 empty rows as placeholders
    for (let i = 0; i < 10; i++) {
        const row = tableBody.insertRow();
        for (let j = 0; j < 6; j++) { // 6 columns including the Action column
            const cell = row.insertCell();
            cell.textContent = '-'; // Dash to make empty cells visible
        }
    }
}

function initializeApp(web3) {
    if (!web3) {
        console.error("Web3 is not initialized");
        return;
    }

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
        const connectionStatus = document.getElementById('connectionStatus');
        connectionStatus.textContent = 'Connecting...';
        try {
            account = await connectToMetaMask();
            console.log('Connected:', account);
            connectionStatus.textContent = `Connected: ${account}`;
            
            // Wait for web3 to be fully initialized
            while (!web3 || !web3.eth) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            await fetchAndDisplayStakes(account);
        } catch (error) {
            console.error('Error connecting:', error);
            connectionStatus.textContent = 'Connection failed. Please try again.';
        }
    });

    async function getCurrentGasPrices() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gasPrice = await provider.getGasPrice();
        console.log(`Current gas price: ${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`);
        return gasPrice;
    }

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

			// Fetch and parse the main CSV file with retries
			const csvData = await fetchCSVWithRetry('merkle_tree_base.csv', 3);
			
			const stakes = csvData.filter(row => {
				const eligibleAddress = String(row['eligible_address']).trim().toLowerCase();
				return eligibleAddress === connectedAccount;
			});

			// Sort stakes by start date (earliest first)
			stakes.sort((a, b) => parseInt(a['minting_start_date']) - parseInt(b['minting_start_date']));
			
			// Get the table body element
			const tableBody = document.getElementById('stakesTable').getElementsByTagName('tbody')[0];
			tableBody.innerHTML = ''; // Clear any existing rows

			let totalAmount = 0;
            let mintedAmount = 0;
            let currentlyMintableAmount = 0;
            let lockedMintableAmount = 0;
            let stakeCount = 0;
            let mintedStakeCount = 0;

            // Populate the table with sorted stake data
            for (const stake of stakes) {
                const row = tableBody.insertRow();
                row.style = ''; // Reset any inline styles
                row.insertCell(0).textContent = stake['id'];
                row.insertCell(1).textContent = stake['eligible_address'];
                row.insertCell(2).textContent = `${Number(stake['amount'] / 1e8).toLocaleString()} LHEX`; // Format amount with commas and add LHEX ticker
                row.insertCell(3).textContent = new Date(stake['minting_start_date'] * 1000).toLocaleDateString(); // Format start date
                row.insertCell(4).textContent = new Date(stake['minting_end_date'] * 1000).toLocaleDateString(); // Format end date

                const amount = parseInt(stake['amount']);
                totalAmount += amount;
                stakeCount++;

                const isClaimed = await isStakeClaimed(stake['id']);
                const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
                const startDate = parseInt(stake['minting_start_date']);
                const endDate = parseInt(stake['minting_end_date']);

                if (isClaimed) {
                    mintedAmount += amount;
                    mintedStakeCount++;
                    row.classList.add('minted');
                    row.insertCell(5).textContent = 'Stake already minted';
                } else {
                    if (currentTime > endDate) {
                        // Expired stakes are not counted in any mintable amount
                    } else if (currentTime < startDate) {
                        // Locked stakes
                        lockedMintableAmount += amount;
                    } else {
                        // Currently mintable stakes
                        currentlyMintableAmount += amount;
                    }
                    if (String(stake['eligible_address']).trim().toLowerCase() === connectedAccount) {
                        row.classList.add('connected-address');
                        const actionCell = row.insertCell(5);
                        
                        if (currentTime > endDate) {
                            // If current time is after end date and stake wasn't minted
                            actionCell.textContent = 'Expired';
                        } else if (currentTime < startDate) {
                            // If current time is before start date
                            actionCell.textContent = `Locked until ${new Date(startDate * 1000).toLocaleDateString()}`;
                        } else {
                            // If within minting period
                            const mintButton = document.createElement('button');
                            mintButton.textContent = 'Mint';
                            mintButton.title = 'Mint this stake';
                            mintButton.addEventListener('click', () => initiateMint(stake));
                            actionCell.style.padding = '0';
                            actionCell.appendChild(mintButton);
                        }
                    } else {
                        row.insertCell(5).textContent = '';
                    }
                }

                // Force a repaint of the row to ensure styles are applied
                void row.offsetWidth;
            }

            // Create or update the info panel
            let infoPanel = document.querySelector('.info-panel');
            if (!infoPanel) {
                infoPanel = document.createElement('div');
                infoPanel.className = 'info-panel';
                const tableContainer = document.querySelector('.inputs');
                tableContainer.insertBefore(infoPanel, tableContainer.firstChild);
            }

            infoPanel.innerHTML = `
                <div class="info-item">
                    <span class="info-label">Currently Mintable:</span>
                    <span class="info-value">${(currentlyMintableAmount / 1e8).toLocaleString()} LHEX</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Stakes Minted:</span>
                    <span class="info-value">${mintedStakeCount} of ${stakeCount}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Minted Amount:</span>
                    <span class="info-value">${(mintedAmount / 1e8).toLocaleString()} LHEX</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Locked Mintable:</span>
                    <span class="info-value">${(lockedMintableAmount / 1e8).toLocaleString()} LHEX</span>
                </div>
            `;
		} catch (error) {
			console.error('Error fetching and displaying stakes:', error);
			throw error; // Rethrow the error to be caught by the caller
		}
	}

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

    async function connectToMetaMask(maxRetries = 3, retryDelay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts && accounts.length > 0) {
                    return accounts[0];
                }
            } catch (error) {
                console.error(`Attempt ${i + 1} failed:`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        throw new Error('Failed to connect to MetaMask after multiple attempts');
    }

    async function fetchCSVWithRetry(url, maxRetries = 3, retryDelay = 1000) {
        for (let i = 0; i < maxRetries; i++) {
            try {
                const response = await fetch(url);
                const csvText = await response.text();
                return Papa.parse(csvText, { header: true }).data;
            } catch (error) {
                console.error(`Attempt ${i + 1} to fetch CSV failed:`, error);
                if (i === maxRetries - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, retryDelay));
            }
        }
        throw new Error(`Failed to fetch CSV after ${maxRetries} attempts`);
    }

// Move these button event listeners outside of DOMContentLoaded
document.getElementById('transferBtn').addEventListener('click', () => showPopup('transfer'));
document.getElementById('mintManuallyBtn').addEventListener('click', () => showPopup('mint'));
document.getElementById('createSignatureBtn').addEventListener('click', () => showPopup('signature'));

// Close button functionality
document.querySelector('.close-btn').addEventListener('click', closePopup);

// Move showPopup function outside of initializeApp
function showPopup(type) {
    console.log('showPopup called with type:', type); // Debug log
    const popupContainer = document.getElementById('popupContainer');
    const popupBody = document.getElementById('popupBody');
    let content = '';

    switch(type) {
        case 'transfer':
            content = `
                <h3>Transfer Liquid HEX</h3>
                <input type="text" id="recipientAddress" placeholder="Recipient Address">
                <input type="number" id="tokenAmount" placeholder="Amount (Hearts)">
                <button id="transferToken">Transfer Liquid HEX</button>
            `;
            break;
        case 'mint':
            content = `
                <h3>Mint Liquid HEX</h3>
                <input type="number" id="stakeId" placeholder="Stake ID">
                <input type="number" id="claimAmount" placeholder="Amount (Hearts)">
                <input type="number" id="startDate" placeholder="Start Time (EPOCH)">
                <input type="number" id="endDate" placeholder="End Time (EPOCH)">
                <input type="text" id="claimMerkleProof" placeholder="Merkle Proof (comma-separated)">
                <input type="text" id="claimSignature" placeholder="Signature (optional)">
                <button id="autoPopulate">Auto Populate</button>
                <button id="claimToken">Mint Liquid HEX</button>
            `;
            break;
        case 'signature':
            content = `
                <h3>Create Signature</h3>
                <input type="text" id="signatureSender" placeholder="Recipient Address">
                <input type="number" id="signatureId" placeholder="Stake ID">
                <input type="number" id="signatureAmount" placeholder="Amount (Hearts)">
                <button id="createSignature">Generate Signature</button>
                <div id="signatureOutput">Signature will appear here...</div>
            `;
            break;
    }

    popupBody.innerHTML = content;
    popupContainer.style.display = 'block';

    // Add event listeners for the buttons inside the popup
    if (type === 'transfer') {
        document.getElementById('transferToken').addEventListener('click', handleTransfer);
    } else if (type === 'mint') {
        document.getElementById('autoPopulate').addEventListener('click', handleAutoPopulate);
        document.getElementById('claimToken').addEventListener('click', handleClaim);
    } else if (type === 'signature') {
        document.getElementById('createSignature').addEventListener('click', handleCreateSignature);
    }
}

function closePopup() {
    console.log('Closing popup');
    document.getElementById('popupContainer').style.display = 'none';
}

// Implement the handler functions using the existing functionality
async function handleTransfer() {
	const recipient = document.getElementById('recipientAddress').value;
	const amount = document.getElementById('tokenAmount').value;

	const functionSignature = web3.eth.abi.encodeFunctionSignature('transfer(address,uint256)');
	const data = functionSignature +
			  web3.eth.abi.encodeParameter('address', recipient).substr(2) +
			  web3.eth.abi.encodeParameter('uint256', amount).substr(2);
				 
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
}

async function handleAutoPopulate() {
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
}

async function handleClaim() {
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
}

async function handleCreateSignature() {
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
}
}
