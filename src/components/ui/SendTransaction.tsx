"use client";

import { useState } from "react";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, isAddress } from "viem";
import {
  FaPaperPlane,
  FaCircleNotch,
  FaCircleCheck,
  FaCircleXmark,
  FaArrowUpRightFromSquare,
} from "react-icons/fa6";

export default function SendTransaction() {
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [inputError, setInputError] = useState("");

  const {
    sendTransaction,
    data: txHash,
    isPending,
    error: sendError,
    reset,
  } = useSendTransaction();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash: txHash });

  const validate = () => {
    if (!isAddress(to)) {
      setInputError("Invalid wallet address.");
      return false;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setInputError("Enter a valid amount.");
      return false;
    }

    setInputError("");
    return true;
  };

  const handleSend = () => {
    if (!validate()) return;

    sendTransaction({
      to: to as `0x${string}`,
      value: parseEther(amount),
    });
  };

  const handleReset = () => {
    setTo("");
    setAmount("");
    setInputError("");
    reset();
  };

  return (
    <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
      <h2 className="text-white font-bold text-base mb-5 flex items-center gap-2">
        <FaPaperPlane className="text-blue-400" />
        Send ETH
      </h2>

      {/* Success State */}
      {isConfirmed && txHash && (
        <div className="text-center py-6">
          <FaCircleCheck className="text-green-400 text-4xl mx-auto mb-3" />

          <p className="text-white font-semibold mb-1">
            Transaction Confirmed
          </p>

          <p className="text-gray-500 text-xs mb-4">
            Your ETH has been sent successfully.
          </p>

          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs transition-colors mb-4"
          >
            View on Etherscan
            <FaArrowUpRightFromSquare />
          </a>

          <br />

          <button
            onClick={handleReset}
            className="text-gray-400 hover:text-white text-xs border border-white/10 px-4 py-2 rounded-full transition-all"
          >
            Send Another
          </button>
        </div>
      )}

      {/* Confirming State */}
      {isConfirming && (
        <div className="text-center py-6">
          <FaCircleNotch className="animate-spin text-blue-400 text-3xl mx-auto mb-3" />

          <p className="text-white font-semibold mb-1">
            Confirming...
          </p>

          <p className="text-gray-500 text-xs">
            Waiting for blockchain confirmation.
          </p>

          {txHash && (
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs transition-colors mt-3"
            >
              Track on Etherscan
              <FaArrowUpRightFromSquare />
            </a>
          )}
        </div>
      )}

      {/* Form State */}
      {!isConfirming && !isConfirmed && (
        <div className="space-y-4">
          {/* Recipient */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-2">
              Recipient Address
            </label>

            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="0x..."
              className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors font-mono"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-2">
              Amount (ETH)
            </label>

            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.001"
                min="0"
                className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 outline-none transition-colors"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-semibold">
                ETH
              </span>
            </div>
          </div>

          {/* Errors */}
          {inputError && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <FaCircleXmark />
              {inputError}
            </p>
          )}

          {sendError && (
            <p className="text-red-400 text-xs flex items-center gap-1.5">
              <FaCircleXmark />
              {sendError.message.slice(0, 80)}...
            </p>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <FaCircleNotch className="animate-spin" />
                Waiting for approval...
              </>
            ) : (
              <>
                <FaPaperPlane />
                Send ETH
              </>
            )}
          </button>

          <p className="text-gray-600 text-xs text-center">
            Transaction requires MetaMask approval. Gas fees apply.
          </p>
        </div>
      )}
    </div>
  );
}