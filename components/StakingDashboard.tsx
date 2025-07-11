import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://auvzzdbsdcvaxlqpkvso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dnp6ZGJzZGN2YXhscXBrdnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDMyNzksImV4cCI6MjA2NjY3OTI3OX0.1gHxcwisNt_81-LQB4jnH5wY8h9VZO7nL47WoPSJH2g"
);

export default function StakingDashboard() {
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [rewards, setRewards] = useState(0);

  useEffect(() => {
    if (address) {
      fetchStakingData();
    }
  }, [address]);

  const fetchStakingData = async () => {
    const { data, error } = await supabase
      .from("staking")
      .select("amount, reward")
      .eq("wallet", address?.toLowerCase())
      .single();

    if (data) {
      setBalance(data.amount);
      setRewards(data.reward);
    }
  };

  return (
    <div className="bg-white p-6 max-w-lg mx-auto mt-10 rounded-xl border border-yellow-500 shadow-md">
      <h1 className="text-2xl font-bold text-center text-yellow-600 mb-4">🐱 HAMCAT Staking</h1>

      <div className="space-y-3">
        <div className="flex justify-between text-gray-800">
          <span>Your Wallet:</span>
          <span className="font-mono">{address}</span>
        </div>

        <div className="flex justify-between">
          <span>Staked HAMCAT:</span>
          <span className="font-bold">{balance.toLocaleString()}</span>
        </div>

        <div className="flex justify-between">
          <span>Current Rewards:</span>
          <span className="text-green-600 font-semibold">{rewards.toLocaleString()} 🧀</span>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-full">
          Stake More
        </button>
        <button className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-full">
          Unstake
        </button>
      </div>
    </div>
  );
}
