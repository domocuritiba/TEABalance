window.addEventListener("DOMContentLoaded", () => {
   
// Endereço do contrato TEA na testnet
    const teaTokenAddress = "0xB182AEe93d3454ab6691DBAcdD5F82c779Cc2a6a";
    /*const tokenContracts = [
        {
            name: "TEA",
            address: "0xB182AEe93d3454ab6691DBAcdD5F82c779Cc2a6a"
        },
        {
            name: "Staked TEA",
            address: "0x04290DACdb061C6C9A0B9735556744Ff0cC84012"
        },
        {
            name: "Wrapped TEA",
            address: "0xfc4e864C051cBb4aB732D5F2495eB286f8860196"
        }*/
    ];

// ABI mínima para interagir com o contrato ERC-20
    const teaTokenAbi = [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "function balanceOf(address) view returns (uint)"
    ];


let provider; // será definido após conexão com MetaMask

// Conectar MetaMask
document.getElementById("connect").onclick = async () => {
    if (typeof window.ethereum !== "undefined") {
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            document.getElementById("wallet").value = address;
            document.getElementById("address").innerText = `Endereço conectado: ${address}`;
            document.getElementById("error").innerText = "";
        } catch (err) {
            console.error("Erro ao conectar MetaMask:", err);
            document.getElementById("error").innerText = "Erro ao conectar MetaMask.";
        }
    } else {
        document.getElementById("error").innerText = "MetaMask não detectado!";
    }
};

// Permitir edição do campo de endereço
document.getElementById("unlock").onclick = () => {
    const walletInput = document.getElementById("wallet");
    walletInput.removeAttribute("readonly");
    walletInput.focus();
};

// Verificar saldo TEA
document.getElementById("check").onclick = async () => {
    const inputAddress = document.getElementById("wallet").value.trim();
    const errorEl = document.getElementById("error");
    const balanceEl = document.getElementById("balance");
    const addressEl = document.getElementById("address");
    const tokenInfoEl = document.getElementById("tokenInfo");

    errorEl.innerText = "";
    balanceEl.innerText = "Saldo: --";
    tokenInfoEl.innerText = "Token: --";

    if (!provider) {
        errorEl.innerText = "Conecte a MetaMask antes de verificar o saldo.";
        return;
    }

    if (!ethers.utils.isAddress(inputAddress)) {
        errorEl.innerText = "Endereço inválido. Verifique e tente novamente.";
        return;
    }

    try {
        const teaContract = new ethers.Contract(teaTokenAddress, teaAbi, provider);
        const rawBalance = await teaContract.balanceOf(inputAddress);
        const decimals = await teaContract.decimals();
        const name = await teaContract.name();
        const symbol = await teaContract.symbol();
        const formattedBalance = ethers.utils.formatUnits(rawBalance, decimals);

        addressEl.innerText = `Endereço: ${inputAddress}`;
        balanceEl.innerText = `Saldo: ${formattedBalance} ${symbol}`;
        tokenInfoEl.innerText = `Token: ${name} (${symbol})`;
    } catch (err) {
        errorEl.innerText = "Erro ao buscar saldo. Verifique se o contrato está correto.";
        console.error(err);
    }
};

});
