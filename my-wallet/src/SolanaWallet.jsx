import { useState } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair, Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

export function SolanaWallet({ mnemonic }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [accounts, setAccounts] = useState([]);

  async function addWallet() {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;

      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      const pubKey = keypair.publicKey.toBase58();

      // connect to Solana devnet
      const connection = new Connection(clusterApiUrl("devnet"));
      const balance = await connection.getBalance(new PublicKey(pubKey));

      setAccounts([
        ...accounts,
        { pubKey, balance: balance / 1e9 }, // lamports → SOL
      ]);
      setCurrentIndex(currentIndex + 1);
    } catch (err) {
      console.error("Error adding Solana wallet:", err);
      alert("Failed to add Solana wallet. Check console for details.");
    }
  }

  return (
    <div>
      <button
        onClick={addWallet}
        className="px-6 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
      >
        Add Solana Wallet
      </button>

      <div className="mt-4 space-y-4">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="p-4 bg-black border border-gray-700 rounded-lg shadow"
          >
            <p className="text-sm font-mono break-all">
              <span className="text-gray-400">Address:</span> {acc.pubKey}
            </p>
            <p className="mt-2 font-semibold">
              Balance:{" "}
              <span className="text-blue-400">{acc.balance} SOL</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
