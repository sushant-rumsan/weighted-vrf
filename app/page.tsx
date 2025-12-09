"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { WalletConnection } from "@/components/wallet-connection-wagmi";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import {
  useReadOfficeLotteryGetEmployeeNamesAndWeights,
  useReadOfficeLotteryGetEmployees,
  useReadOfficeLotteryGetLastWinner,
} from "@/hooks/wagmi/contracts";
import {
  signSetActive,
  signRequestRandomNumber,
  signRunLottery,
} from "@/lib/transaction-signer";

// Load employees from contract and convert to UI-friendly format
const contractAddress = CONTRACT_ADDRESSES.OFFICE_LOTTERY as `0x${string}`;
const vrfAddress = CONTRACT_ADDRESSES.VRF as `0x${string}`;

// Snake animation loader component
function SnakeAnimationLoader({
  employees,
  winner,
  showWinner,
  onBack,
  progress,
}: {
  employees: { id: number; name: string }[];
  winner?: { name: string };
  showWinner: boolean;
  onBack?: () => void;
  progress: number;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showWinnerName, setShowWinnerName] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [snakePosition, setSnakePosition] = useState(0);
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  // Fun messages based on progress
  const getFunMessage = () => {
    if (progress < 10) return "🐍 Snake is waking up...";
    if (progress < 25) return "🐍 Snake is slithering...";
    if (progress < 40) return "🐍 Snake is hunting...";
    if (progress < 55) return "🐍 Snake is narrowing down...";
    if (progress < 70) return "🐍 Snake is getting closer...";
    if (progress < 85) return "🐍 Snake is almost there...";
    if (progress < 95) return "🐍 Snake found someone!";
    return "🐍 Snake is ready to strike!";
  };

  useEffect(() => {
    if (employees.length === 0) return;

    if (!showWinner) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % employees.length);
      }, 500); // Change every 500ms

      return () => clearInterval(interval);
    }
  }, [employees.length, showWinner]);

  // Animate snake position along progress bar
  useEffect(() => {
    if (!showWinner) {
      setSnakePosition(progress);
    }
  }, [progress, showWinner]);

  // Generate sparkles for fun effect
  useEffect(() => {
    if (!showWinner && progress > 0) {
      const interval = setInterval(() => {
        setSparkles((prev) => {
          const newSparkles = prev.filter((s) => s.id > Date.now() - 2000);
          if (Math.random() > 0.7) {
            newSparkles.push({
              id: Date.now(),
              x: Math.random() * 100,
              y: Math.random() * 100,
            });
          }
          return newSparkles;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [progress, showWinner]);

  // Handle winner announcement timing
  useEffect(() => {
    if (showWinner && winner) {
      // Wait 3 seconds, then show winner name with party popper
      const timer1 = setTimeout(() => {
        setShowWinnerName(true);
      }, 3000);

      // Wait 1 more second (4 seconds total), then show message
      const timer2 = setTimeout(() => {
        setShowMessage(true);
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [showWinner, winner]);

  if (employees.length === 0) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-8xl animate-bounce">🐍</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-center py-32 min-h-[400px] overflow-hidden">
      {showMessage && onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-10 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300"
        >
          ← Back
        </button>
      )}

      {/* Animated background snakes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-4xl opacity-10 animate-pulse"
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          >
            🐍
          </div>
        ))}
      </div>

      {/* Sparkles effect */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-2xl animate-ping pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
          }}
        >
          ✨
        </div>
      ))}

      {/* Main snake with rotation animation */}
      <div className="relative mb-8">
        <div
          className="text-8xl animate-spin"
          style={{ animationDuration: "3s" }}
        >
          🐍
        </div>
        <div className="absolute inset-0 text-8xl animate-pulse opacity-50">
          🐍
        </div>
      </div>

      {!showWinnerName ? (
        <>
          {/* Show flashing names with fun styling */}
          <div className="relative mb-8">
            <div className="text-6xl font-black text-white bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent transition-all duration-500 animate-pulse drop-shadow-2xl">
              {employees[currentIndex]?.name || "🐍"}
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 text-6xl font-black bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent blur-xl opacity-50 animate-pulse">
              {employees[currentIndex]?.name || "🐍"}
            </div>
          </div>

          {/* Fun progress bar with snake indicator */}
          <div className="w-full max-w-md px-8 relative">
            <div className="relative">
              <Progress
                value={progress}
                className="h-4 bg-white/10 border-2 border-emerald-400/30 rounded-full overflow-hidden"
              />
              {/* Snake indicator on progress bar */}
              <div
                className="absolute top-0 text-2xl transition-all duration-100 ease-linear"
                style={{
                  left: `calc(${snakePosition}% - 16px)`,
                  transform: "translateY(-8px)",
                }}
              >
                🐍
              </div>
              {/* Animated border glow */}
              <div
                className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-pulse"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Fun message with emoji */}
            <div className="text-center mt-4">
              <div className="text-white/90 text-lg font-bold mb-1 animate-pulse">
                {getFunMessage()}
              </div>
              <div className="text-white/60 text-sm">
                {Math.round(progress)}% complete
              </div>
            </div>

            {/* Fun emoji trail */}
            <div className="flex justify-center gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="text-2xl animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    opacity: progress > i * 20 ? 1 : 0.3,
                  }}
                >
                  {i % 2 === 0 ? "🐍" : "✨"}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        // Show winner
        <div className="text-center">
          {!showMessage ? (
            // Show winner name with party popper
            <div className="flex flex-col items-center gap-6">
              <div className="text-9xl animate-bounce">🎉</div>
              <div className="text-7xl font-black text-yellow-400 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {winner?.name}
              </div>
            </div>
          ) : (
            // Show full message
            <div className="flex flex-col items-center gap-6">
              <div className="text-9xl animate-bounce">🎉</div>
              <div className="text-7xl font-black text-yellow-400 bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {winner?.name}
              </div>
              <div className="text-3xl text-white/80 font-bold mt-4">
                will pay the price today
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

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

  // State for transaction status
  const [isSettingActive, setIsSettingActive] = useState(false);
  const [isSetActiveSuccess, setIsSetActiveSuccess] = useState(false);
  const [isLotterySuccess, setIsLotterySuccess] = useState(false);

  // Get last winner
  const { data: lastWinnerAddress, refetch: refetchWinner } =
    useReadOfficeLotteryGetLastWinner({
      address: contractAddress,
    });

  // Lottery flow state
  const [lotteryPhase, setLotteryPhase] = useState<
    "idle" | "requestingRandom" | "waiting" | "runningLottery" | "complete"
  >("idle");

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
  const [lotteryProgress, setLotteryProgress] = useState(0);

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
      .map((emp) => emp.address) as `0x${string}`[];

    // Call setActive with all selected addresses using private key
    if (selectedAddresses.length > 0) {
      try {
        setIsSettingActive(true);
        await signSetActive(contractAddress, selectedAddresses);
        setIsSetActiveSuccess(true);
        setPresentEmployees(selectedIds);
      } catch (error) {
        console.error("Error setting active:", error);
        setIsSettingActive(false);
        return; // Don't proceed if transaction fails
      } finally {
        setIsSettingActive(false);
      }
    } else {
      setPresentEmployees(selectedIds);
    }
  };

  const handleLuckyDraw = async () => {
    setIsDrawing(true);
    setLotteryPhase("requestingRandom");
    setLotteryProgress(0); // Reset progress

    try {
      // Step 1: Request random number from VRF using private key
      await signRequestRandomNumber(vrfAddress);
      setLotteryPhase("waiting");

      // Step 2: Wait 15 seconds for VRF to generate random number
      setTimeout(() => {
        setLotteryPhase("runningLottery");
        runLotteryFlow();
      }, 15000);
    } catch (error) {
      console.error("Error in lottery flow:", error);
      setIsDrawing(false);
      setLotteryPhase("idle");
      setLotteryProgress(0);
    }
  };

  const runLotteryFlow = async () => {
    try {
      // Call runLottery on the lottery contract using private key
      await signRunLottery(contractAddress);
      setIsLotterySuccess(true);
    } catch (error) {
      console.error("Error running lottery:", error);
      setIsDrawing(false);
      setLotteryPhase("idle");
    }
  };

  // Handle setActive success
  useEffect(() => {
    if (isSetActiveSuccess) {
      setHasCheckedInToday(true);
      setShowPresenceSelection(false);
    }
  }, [isSetActiveSuccess]);

  // Handle lottery success
  useEffect(() => {
    if (isLotterySuccess && lotteryPhase === "runningLottery") {
      // Wait 2 seconds after transaction confirmation, then fetch the new winner
      setTimeout(() => {
        refetchWinner();
        setLotteryPhase("complete");
        setLotteryProgress(100); // Complete the progress
        // Keep isDrawing true to show winner announcement
      }, 2000);
    }
  }, [isLotterySuccess, lotteryPhase, refetchWinner]);

  // Progress bar timer - updates from 0% to 100% over 40 seconds
  useEffect(() => {
    if (!isDrawing || lotteryPhase === "complete") {
      return;
    }

    const startTime = Date.now();
    const duration = 40000; // 40 seconds
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLotteryProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(interval);
  }, [isDrawing, lotteryPhase]);

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

  // After showing winner, keep it displayed in the animation loader
  // Don't redirect anywhere, just leave it there

  // Show presence selection if not checked in or if showing selection explicitly
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
              <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                🐍 Who will pay for tea today? 🐍
              </span>
            </h1>
            <p className="text-white/80 font-medium">
              Select who&apos;s in office today 🐍
            </p>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-6xl snake-rotate snake-glow">🐍</div>
                  <span className="ml-3 text-white">Hissing around....</span>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🐍</div>
                  <p className="text-white/60">No snakes in the nest</p>
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
                          ? "bg-gradient-to-r from-emerald-500/20 via-yellow-500/20 to-orange-500/20 border-2 border-emerald-400/60 shadow-lg shadow-emerald-400/20"
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
                                sssssshhhhhhh 🐍
                              </div>
                            )}
                          </div>
                        </div>
                        {presentEmployees.has(employee.id) && (
                          <div className="text-3xl snake-slither animate-bounce">
                            🐍
                          </div>
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
                        <span className="text-xl animate-spin">🐍</span>
                        <span>Snake is slithering...</span>
                      </>
                    ) : (
                      <>
                        <span className="text-xl animate-spin">🐍</span>
                        Confirm presence
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
        {isDrawing ? (
          <SnakeAnimationLoader
            employees={activeEmployees}
            winner={currentWinner ? { name: currentWinner.name } : undefined}
            showWinner={lotteryPhase === "complete" && !!currentWinner}
            progress={lotteryProgress}
            onBack={() => {
              setShowPresenceSelection(true);
              setHasCheckedInToday(false);
              setIsDrawing(false);
              setHasDrawnToday(false);
              setLotteryPhase("idle");
              setLotteryProgress(0);
            }}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowPresenceSelection(true);
                  setHasCheckedInToday(false);
                  setHasDrawnToday(false); // Reset lottery state
                  setLotteryProgress(0);
                }}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                ← Back
              </Button>
              <WalletConnection />
            </div>
            <div className="text-center mb-8">
              <h1 className="text-5xl font-black text-white mb-2 animate-pulse tracking-tight">
                <span className="bg-gradient-to-r from-emerald-400 via-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  🐍 VICTIM 🐍
                </span>
              </h1>
              <p className="text-white/90 text-xl font-semibold">
                who&apos;s getting bitten today? 🐍
              </p>
            </div>

            {previousWinner && !hasDrawnToday && (
              <Card className="mb-6 bg-gradient-to-br from-emerald-500/20 to-yellow-500/20 border-emerald-400/50 backdrop-blur-2xl shadow-xl rounded-3xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-3xl mb-2 animate-bounce">🐍</div>
                    <div className="text-sm text-white/70 mb-1 uppercase tracking-wide">
                      Previous Victim
                    </div>
                    <div className="text-xl font-black text-white">
                      {previousWinner.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {!hasDrawnToday ? (
              <>
                <Card className="bg-white/5 border-white/10 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-6">
                      <div className="text-8xl snake-slither snake-glow animate-pulse">
                        🐍
                      </div>
                    </div>
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
                      className="w-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-orange-500 hover:from-emerald-600 hover:via-yellow-600 hover:to-orange-600 text-white font-black py-8 text-2xl rounded-2xl shadow-xl shadow-emerald-500/30 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 border-0"
                    >
                      🐍 SELECT VICTIM!
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-to-br from-emerald-400/20 to-yellow-500/20 border-emerald-400/50 backdrop-blur-2xl shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">🐍</div>
                  <CardTitle className="text-3xl text-emerald-400 mb-2 font-black">
                    BITTEN! 🐍
                  </CardTitle>
                  <div className="text-4xl font-black text-white bg-gradient-to-r from-emerald-400 to-yellow-400 bg-clip-text text-transparent">
                    {currentWinner?.name ||
                      previousWinner?.name ||
                      "Snake has chosen!"}
                  </div>
                  <div className="text-white/90 mt-2 text-lg font-semibold">
                    got the snake bite today! 🐍
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => {
                      setHasDrawnToday(false);
                      setShowPresenceSelection(true);
                      setHasCheckedInToday(false); // Reset check-in state
                      setLotteryProgress(0);
                    }}
                    variant="outline"
                    className="w-full border-emerald-400/50 text-emerald-400 hover:bg-emerald-400/10 py-4 text-lg font-bold rounded-2xl"
                  >
                    🐍 slither back tomorrow
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
          </>
        )}
      </div>
    </div>
  );
}
