import { mnemonicToSeed } from "bip39";
import { useState } from "react";

export const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accounts, setAccounts] = useState([]);

  async function addWallet() {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const wallet = new Wallet(child.privateKey);

      // ⚠️ Replace with Alchemy/Infura URL to avoid CORS
      const provider = new JsonRpcProvider("https://rpc2.sepolia.org");

      const balanceWei = await provider.getBalance(wallet.address);
      const balanceEth = formatEther(balanceWei);

      setAccounts([
        ...accounts,
        { address: wallet.address, balance: balanceEth },
      ]);
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      console.error("Error adding ETH wallet:", err);
      alert("Failed to add ETH wallet. Check console for details.");
    }
  }

  return (
    <div>
      <button
        onClick={addWallet}
        className="px-6 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
      >
        Add ETH Wallet
      </button>

      <div className="mt-4 space-y-4">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="p-4 bg-black border border-gray-700 rounded-lg shadow"
          >
            <p className="text-sm font-mono break-all">
              <span className="text-gray-400">Address:</span> {acc.address}
            </p>
            <p className="mt-2 font-semibold">
              Balance:{" "}
              <span className="text-green-400">{acc.balance} ETH</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
