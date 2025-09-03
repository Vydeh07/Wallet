import { useState } from "react";
import { generateMnemonic } from "bip39";
import { SolanaWallet } from "./SolanaWallet";
import { EthWallet } from "./EthWallet";

function App() {
  const [mnemonic, setMnemonic] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full bg-gray-900 px-6 py-4 shadow-lg flex items-center justify-between">
        <h1 className="text-2xl font-bold">Web Wallet</h1>
        <span className="text-sm text-gray-400">Solana & Ethereum</span>
      </nav>

      {/* Main content */}
      <div className="flex-1 p-8 max-w-3xl mx-auto w-full">
        {/* Seed Phrase */}
        <div className="bg-gray-900 rounded-2xl p-6 shadow-md mb-8">
          <button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
            }}
            className="px-6 py-2 bg-white text-black font-semibold rounded-lg shadow hover:bg-gray-200 transition"
          >
            Create Seed Phrase
          </button>

          <input
            type="text"
            value={mnemonic}
            readOnly
            placeholder="Your seed phrase will appear here..."
            className="mt-4 w-full px-4 py-2 bg-black border border-gray-700 rounded-lg text-white focus:outline-none"
          />
        </div>

        {/* Wallets Section */}
        {mnemonic && (
          <div className="space-y-8">
            <div className="bg-gray-900 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Solana Wallets</h2>
              <SolanaWallet mnemonic={mnemonic} />
            </div>

            <div className="bg-gray-900 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Ethereum Wallets</h2>
              <EthWallet mnemonic={mnemonic} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-center text-gray-500 py-4 text-sm">
        © {new Date().getFullYear()} Web Wallet. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
