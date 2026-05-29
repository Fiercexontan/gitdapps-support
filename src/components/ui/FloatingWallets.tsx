import Image from "next/image";

const wallets = [
  {
    name: "MetaMask",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    delay: "0s",
    position: "top-[12%] left-[10%]",
    rotate: "-rotate-6",
    animation: "animate-float",
  },
  {
    name: "Phantom",
    logo: "https://avatars.githubusercontent.com/u/75720280?s=200&v=4",
    delay: "0.5s",
    position: "top-[8%] right-[18%]",
    rotate: "rotate-3",
    animation: "animate-float-reverse",
  },
  {
    name: "Coinbase",
    logo: "https://avatars.githubusercontent.com/u/18060234?s=200&v=4",
    delay: "1s",
    position: "top-[42%] left-[5%]",
    rotate: "rotate-6",
    animation: "animate-float",
  },
  {
    name: "Trust",
    logo: "https://avatars.githubusercontent.com/u/32179889?s=200&v=4",
    delay: "1.4s",
    position: "top-[38%] right-[6%]",
    rotate: "-rotate-3",
    animation: "animate-float-slow",
  },
  {
    name: "Ledger",
    logo: "https://avatars.githubusercontent.com/u/9784193?s=200&v=4",
    delay: "0.8s",
    position: "bottom-[22%] left-[14%]",
    rotate: "-rotate-2",
    animation: "animate-float-reverse",
  },
  {
    name: "WalletConnect",
    logo: "https://avatars.githubusercontent.com/u/37784886?s=200&v=4",
    delay: "1.8s",
    position: "bottom-[18%] right-[12%]",
    rotate: "rotate-4",
    animation: "animate-float",
  },
  {
    name: "MetaMask",
    logo: "https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg",
    delay: "2.2s",
    position: "top-[22%] left-[26%]",
    rotate: "rotate-2",
    animation: "animate-float-slow",
  },
  {
    name: "Phantom",
    logo: "https://avatars.githubusercontent.com/u/75720280?s=200&v=4",
    delay: "2.6s",
    position: "top-[18%] right-[28%]",
    rotate: "-rotate-4",
    animation: "animate-float-reverse",
  },
];

export default function FloatingWallets() {
  return (
    <>
      {wallets.map((wallet, i) => (
        <div
          key={i}
          className={`absolute ${wallet.position} hidden lg:flex flex-col items-center gap-1.5 ${wallet.animation}`}
          style={{ animationDelay: wallet.delay }}
        >
          <div className={`w-14 h-14 ${wallet.rotate} rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-xl overflow-hidden`}>
            <Image
              src={wallet.logo}
              alt={wallet.name}
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <span className="text-gray-500 text-[10px] font-medium tracking-wide">
            {wallet.name}
          </span>
        </div>
      ))}
    </>
  );
}