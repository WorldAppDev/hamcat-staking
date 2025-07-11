import { useEffect, useState } from "react";
import { IDKitWidget, VerificationLevel } from "@worldcoin/idkit";
import { useAccount } from "wagmi";
import { createClient } from "@supabase/supabase-js";

// ✅ Your Supabase config
const supabase = createClient(
  "https://auvzzdbsdcvaxlqpkvso.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1dnp6ZGJzZGN2YXhscXBrdnNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDMyNzksImV4cCI6MjA2NjY3OTI3OX0.1gHxcwisNt_81-LQB4jnH5wY8h9VZO7nL47WoPSJH2g"
);

const WorldIDGate = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    checkVerification();
  }, [address]);

  const checkVerification = async () => {
    const { data, error } = await supabase
      .from("verified_wallets")
      .select("wallet")
      .eq("wallet", address?.toLowerCase());

    setVerified(!!data?.length);
    setLoading(false);
  };

  const handleProof = async (proof: any) => {
    if (!address) return;

    try {
      const { data, error } = await supabase.from("verified_wallets").insert([
        {
          wallet: address.toLowerCase(),
          nullifier_hash: proof.nullifier_hash,
          merkle_root: proof.merkle_root,
          proof: proof.proof,
        },
      ]);

      if (!error) {
        setVerified(true);
      }
    } catch (e) {
      console.error("Verification error:", e);
    }
  };

  if (!address) return <p className="text-center mt-10">Please connect wallet first.</p>;
  if (loading) return <p className="text-center mt-10">Checking verification...</p>;
  if (verified) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center mt-10 bg-yellow-100 p-6 rounded-xl border border-black shadow-lg max-w-md mx-auto">
      <p className="mb-4 text-lg font-bold text-center text-black">
        Verify with World ID to access HAMCAT staking
      </p>
      <IDKitWidget
        app_id="app_aecc73ca4ec54a00540d132f493739f2"
        action="hamcat-access"
        signal={address}
        onSuccess={handleProof}
        verification_level={VerificationLevel.Orb}
      >
        {({ open }) => (
          <button
            className="bg-black hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-full"
            onClick={open}
          >
            ✅ Verify with World ID
          </button>
        )}
      </IDKitWidget>
    </div>
  );
};

export default WorldIDGate;
