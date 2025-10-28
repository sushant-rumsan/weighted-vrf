"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Dice1, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";
import { WalletConnection } from "@/components/wallet-connection-wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import {
  useReadOfficeLotteryGetEmployeeNamesAndWeights,
  useReadOfficeLotteryGetEmployees,
  useReadOfficeLotteryGetLastWinner,
  useWriteOfficeLotterySetActive,
  useWriteOfficeLotteryRunLottery,
} from "@/hooks/wagmi/contracts";
import { useWriteRandomNumberGeneratorRequestRandomNumber } from "@/hooks/wagmi/contracts";
import { Loader2 } from "lucide-react";

// Load employees from contract and convert to UI-friendly format
const contractAddress = CONTRACT_ADDRESSES.OFFICE_LOTTERY as `0x${string}`;
const vrfAddress = CONTRACT_ADDRESSES.VRF as `0x${string}`;

// Fun facts for loading screen
const funFacts = [
  "Did you know? Octopuses have three hearts!",
  "Fun fact: A group of flamingos is called a 'flamboyance'",
  "Did you know? Bananas are berries, but strawberries aren't!",
  "Fun fact: Honey never spoils. Archaeologists have found 3000-year-old honey that's still good!",
  "Did you know? Sharks have been around longer than trees!",
  "Fun fact: Your nose can remember 50,000 different scents",
  "Did you know? A single cloud can weigh more than a million pounds!",
  "Fun fact: Dolphins have names for each other",
];

export default function HomePage() {
  const { data: contractData, isLoading } =
    useReadOfficeLotteryGetEmployeeNamesAndWeights({
      address: contractAddress,
    });

  // Transform contract data to our UI format
  // contract returns: [names: string[], weights: uint256[]]
  // We also need addresses from getEmployees
  const { data: employeeAddresses = [] } = useReadOfficeLotteryGetEmployees({
    address: contractAddress,
  });

  // Hooks for contract interactions
  const { writeContract: setActive, isPending: isSettingActive } =
    useWriteOfficeLotterySetActive();
  const { writeContract: runLottery, isSuccess: isLotterySuccess } =
    useWriteOfficeLotteryRunLottery();
  const { writeContract: requestRandomNumber } =
    useWriteRandomNumberGeneratorRequestRandomNumber();

  // Get last winner
  const { data: lastWinnerAddress, refetch: refetchWinner } =
    useReadOfficeLotteryGetLastWinner({
      address: contractAddress,
    });

  // Lottery flow state
  const [lotteryPhase, setLotteryPhase] = useState<
    "idle" | "requestingRandom" | "waiting" | "runningLottery" | "complete"
  >("idle");
  const [currentFact, setCurrentFact] = useState("");

  // contractData is a tuple: [names: string[], weights: bigint[]]
  const employees = (contractData?.[0] || []).map(
    (name: string, idx: number) => {
      const address = employeeAddresses[idx] || "";
      const weight = contractData?.[1]?.[idx] || BigInt(0);

      return {
        id: idx + 1,
        name: name || `Employee ${idx + 1}`,
        address: address,
        probability: Number(weight), // Weight maps to probability
        daysSinceLastPaid: 0,
      };
    }
  );
  const [presentEmployees, setPresentEmployees] = useState<Set<number>>(
    new Set()
  );
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showPresenceSelection, setShowPresenceSelection] = useState(false);

  // Load today's status
  useEffect(() => {
    const loadStatus = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Check if we already have presence data for today
      const hasPresence = false; // Change this to test different states
      if (hasPresence) {
        setPresentEmployees(new Set([1, 3, 4]));
        setHasCheckedInToday(true);
      }
    };
    loadStatus();
  }, []);

  const handlePresenceSubmit = async (selectedIds: Set<number>) => {
    // Get addresses of selected employees
    const selectedAddresses = employees
      .filter((emp) => selectedIds.has(emp.id))
      .map((emp) => emp.address);

    // Call setActive with all selected addresses
    if (selectedAddresses.length > 0) {
      await setActive({
        address: contractAddress,
        args: [selectedAddresses as `0x${string}`[]],
      });
    }

    setPresentEmployees(selectedIds);
    setHasCheckedInToday(true);
    setShowPresenceSelection(false);
  };

  const handleLuckyDraw = async () => {
    setIsDrawing(true);
    setLotteryPhase("requestingRandom");

    try {
      // Step 1: Request random number from VRF
      await requestRandomNumber({
        address: vrfAddress,
      });
      setLotteryPhase("waiting");

      // Step 2: Show fun facts for 15 seconds
      const startTime = Date.now();
      const displayFacts = () => {
        const fact = funFacts[Math.floor(Math.random() * funFacts.length)];
        setCurrentFact(fact);

        if (Date.now() - startTime < 15000) {
          setTimeout(displayFacts, 2500);
        } else {
          // Step 3: Run lottery
          setLotteryPhase("runningLottery");
          runLotteryFlow();
        }
      };
      displayFacts();
    } catch (error) {
      console.error("Error in lottery flow:", error);
      setIsDrawing(false);
      setLotteryPhase("idle");
    }
  };

  const runLotteryFlow = async () => {
    try {
      // Call runLottery on the lottery contract
      await runLottery({
        address: contractAddress,
      });

      // Wait for transaction success (handled by isLotterySuccess)
    } catch (error) {
      console.error("Error running lottery:", error);
      setIsDrawing(false);
      setLotteryPhase("idle");
    }
  };

  // Handle lottery success
  useEffect(() => {
    if (isLotterySuccess && lotteryPhase === "runningLottery") {
      // Wait 2 seconds after transaction confirmation, then fetch the new winner
      setTimeout(() => {
        refetchWinner();
        setLotteryPhase("complete");
        setIsDrawing(false);
        setHasDrawnToday(true);
      }, 2000);
    }
  }, [isLotterySuccess, lotteryPhase, refetchWinner]);

  const presentCount = presentEmployees.size;
  const activeEmployees = employees.filter((emp) =>
    presentEmployees.has(emp.id)
  );
  const eligibleCount = activeEmployees.length;

  // Calculate total weight and percentages for active employees
  const totalWeight = activeEmployees.reduce(
    (sum, emp) => sum + emp.probability,
    0
  );
  const employeesWithPercentage = activeEmployees.map((emp) => ({
    ...emp,
    percentage:
      totalWeight > 0
        ? Math.round((emp.probability / totalWeight) * 10000) / 100 // Round to 2 decimal places
        : 0,
  }));

  // Find previous winner info
  const previousWinner = lastWinnerAddress
    ? employees.find(
        (emp) => emp.address.toLowerCase() === lastWinnerAddress.toLowerCase()
      )
    : null;

  // Get current winner when lottery is complete
  const currentWinner = lotteryPhase === "complete" ? previousWinner : null;

  if (!hasCheckedInToday || showPresenceSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,0,150,0.1),transparent_60deg,rgba(0,255,255,0.1),transparent_120deg,rgba(255,255,0,0.1),transparent)]"></div>

        <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
          <div className="flex justify-end mb-4">
            <WalletConnection />
          </div>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                ✨ Daily Vibe Check
              </span>
            </h1>
            <p className="text-white/80 font-medium">
              who&apos;s pulling up to the office today? 💅
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-white" />
                  <span className="ml-3 text-white">Loading employees...</span>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">No employees found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => {
                        const newPresent = new Set(presentEmployees);
                        if (presentEmployees.has(employee.id)) {
                          newPresent.delete(employee.id);
                        } else {
                          newPresent.add(employee.id);
                        }
                        setPresentEmployees(newPresent);
                      }}
                      className={`group relative p-5 rounded-2xl cursor-pointer transition-all duration-500 transform hover:scale-[1.02] ${
                        presentEmployees.has(employee.id)
                          ? "bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20 border-2 border-emerald-400/60 shadow-lg shadow-emerald-400/20"
                          : "bg-gradient-to-r from-white/5 to-white/10 border-2 border-white/10 hover:border-white/30 hover:from-white/10 hover:to-white/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                              presentEmployees.has(employee.id)
                                ? "bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-400/50"
                                : "bg-white/20 group-hover:bg-white/40"
                            }`}
                          ></div>
                          <div>
                            <span className="text-white font-bold text-lg">
                              {employee.name}
                            </span>
                            {presentEmployees.has(employee.id) && (
                              <div className="text-emerald-300 text-sm font-semibold animate-pulse">
                                locked in ✨
                              </div>
                            )}
                          </div>
                        </div>
                        {presentEmployees.has(employee.id) && (
                          <div className="text-2xl animate-bounce">🔥</div>
                        )}
                      </div>
                      {presentEmployees.has(employee.id) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-sm -z-10"></div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && employees.length > 0 && (
                <Button
                  onClick={() => handlePresenceSubmit(presentEmployees)}
                  disabled={presentEmployees.size === 0 || isSettingActive}
                  className="w-full mt-8 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 hover:from-violet-600 hover:via-purple-600 hover:to-pink-600 text-white font-black py-6 text-lg rounded-2xl shadow-xl shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 border-0"
                >
                  <span className="flex items-center justify-center gap-3">
                    {isSettingActive ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Setting active...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🚀</span>
                        let&apos;s gooo
                        <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm">
                          {presentEmployees.size}
                        </span>
                      </>
                    )}
                  </span>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.3),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(255,0,150,0.1),transparent_60deg,rgba(0,255,255,0.1),transparent_120deg,rgba(255,255,0,0.1),transparent)]"></div>

      <div className="container mx-auto px-4 py-8 max-w-md relative z-10">
        <div className="flex justify-end mb-4">
          <WalletConnection />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-5xl font-black text-white mb-2 animate-pulse tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              🎰 BILL ROULETTE
            </span>
          </h1>
          <p className="text-white/90 text-xl font-semibold">
            who&apos;s about to get rekt? 💸
          </p>
        </div>

        {previousWinner && !hasDrawnToday && (
          <Card className="mb-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 backdrop-blur-2xl shadow-xl rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🎖️</div>
                <div className="text-sm text-white/70 mb-1 uppercase tracking-wide">
                  Previous Winner
                </div>
                <div className="text-xl font-black text-white">
                  {previousWinner.name}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {!hasDrawnToday ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-6">
                {isDrawing ? (
                  <div className="animate-spin">
                    <Dice1 className="w-20 h-20 text-yellow-400 drop-shadow-lg" />
                  </div>
                ) : (
                  <Sparkles className="w-20 h-20 text-yellow-400 animate-pulse drop-shadow-lg" />
                )}
              </div>
              <CardTitle className="text-3xl text-white font-black">
                {isDrawing ? "🎲 SPINNING..." : "🔥 READY TO SPIN"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 p-6 rounded-2xl border border-emerald-400/30 text-center backdrop-blur-sm">
                  <div className="text-4xl font-black text-emerald-400">
                    {eligibleCount}
                  </div>
                  <div className="text-white/80 text-sm font-semibold uppercase tracking-wide">
                    ACTIVE TODAY
                  </div>
                </div>
                {employeesWithPercentage.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-white/90 text-sm font-semibold uppercase mb-3">
                      Lottery Weights:
                    </div>
                    {employeesWithPercentage.map((emp) => (
                      <div
                        key={emp.id}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex justify-between items-center">
                          <div className="text-white font-medium">
                            {emp.name}
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-white/60 text-xs">
                              Weight: {emp.probability}
                            </div>
                            <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-bold">
                              {emp.percentage}%
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                onClick={handleLuckyDraw}
                disabled={isDrawing || presentCount === 0}
                className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black py-8 text-2xl rounded-2xl shadow-xl shadow-orange-500/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 border-0"
              >
                {isDrawing ? "🎰 SPINNING..." : "🎲 SPIN THE WHEEL"}
              </Button>

              {isDrawing && (
                <div className="text-center space-y-4 py-6">
                  <div className="text-yellow-400 animate-pulse font-bold text-lg">
                    {lotteryPhase === "requestingRandom" &&
                      "Requesting random number... ✨"}
                    {lotteryPhase === "waiting" &&
                      "Generating randomness... 🎲"}
                    {lotteryPhase === "runningLottery" &&
                      "Running the lottery! 🎰"}
                  </div>
                  {currentFact && lotteryPhase === "waiting" && (
                    <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                      <p className="text-white/90 text-sm font-medium italic">
                        {currentFact}
                      </p>
                    </div>
                  )}
                  {lotteryPhase !== "waiting" && (
                    <div className="text-white/70 text-sm font-medium">
                      {lotteryPhase === "requestingRandom" &&
                        "Sign the transaction in MetaMask..."}
                      {lotteryPhase === "runningLottery" &&
                        "Sign the lottery transaction..."}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-yellow-400/20 to-orange-500/20 border-yellow-400/50 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center">
              <div className="text-8xl mb-4 animate-bounce">🏆</div>
              <CardTitle className="text-3xl text-yellow-400 mb-2 font-black">
                WINNER!
              </CardTitle>
              <div className="text-4xl font-black text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {currentWinner?.name ||
                  previousWinner?.name ||
                  "Winner determined!"}
              </div>
              <div className="text-white/90 mt-2 text-lg font-semibold">
                gets the bill today! 💸
              </div>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setHasDrawnToday(false);
                  setShowPresenceSelection(true);
                }}
                variant="outline"
                className="w-full border-yellow-400/50 text-yellow-400 hover:bg-yellow-400/10 py-4 text-lg font-bold rounded-2xl"
              >
                🔄 run it back tomorrow
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-center gap-6 mt-8">
          <Link href="/employees">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white text-sm font-medium"
            >
              <Users className="w-4 h-4 mr-2" />
              manage crew
            </Button>
          </Link>
          <Link href="/probability">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white text-sm font-medium"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              check odds
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
