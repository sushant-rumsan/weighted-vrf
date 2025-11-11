"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  UserPlus,
  Users,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useAccount } from "wagmi";
import {
  useWriteOfficeLotteryAddEmployee,
  useReadOfficeLotteryGetEmployees,
  useReadOfficeLotteryEmployees,
} from "@/hooks/wagmi/contracts";
import { CONTRACT_ADDRESSES } from "@/lib/constants";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function EmployeesPage() {
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeAddress, setNewEmployeeAddress] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { address, isConnected } = useAccount();

  // Get contract address from constants
  const contractAddress = CONTRACT_ADDRESSES.OFFICE_LOTTERY as `0x${string}`;

  // Get all employee addresses
  const { data: employeeAddresses = [] } = useReadOfficeLotteryGetEmployees({
    address: contractAddress,
  });

  // Write contract hook for adding employee
  const {
    writeContract: addEmployee,
    isPending: isAddingEmployee,
    isSuccess: isAddSuccess,
  } = useWriteOfficeLotteryAddEmployee();

  // Get moderator status (implement isModerator function check)
  const [isModerator] = useState(true);

  useEffect(() => {
    if (isAddSuccess) {
      setMessage({ type: "success", text: "Employee added successfully!" });
      setNewEmployeeName("");
      setNewEmployeeAddress("");
      setTimeout(() => setMessage(null), 3000);
    }
  }, [isAddSuccess]);

  const generateRandomAddress = () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);
    setNewEmployeeAddress(account.address);
  };

  const handleAddEmployee = async () => {
    if (!isConnected || !address) {
      setMessage({ type: "error", text: "Please connect your wallet first" });
      return;
    }

    if (!newEmployeeName.trim() || !newEmployeeAddress.trim()) {
      setMessage({
        type: "error",
        text: "Please fill in both name and wallet address",
      });
      return;
    }

    // Basic address validation
    if (!newEmployeeAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      setMessage({
        type: "error",
        text: "Please enter a valid Ethereum address",
      });
      return;
    }

    if (!isModerator) {
      setMessage({ type: "error", text: "Only moderators can add employees" });
      return;
    }

    try {
      await addEmployee({
        address: contractAddress,
        args: [newEmployeeAddress as `0x${string}`, newEmployeeName.trim()],
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to add employee. Please try again.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-foreground">
              Manage Team 👥
            </h1>
            <p className="text-muted-foreground">
              {isConnected
                ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}`
                : "Connect your wallet to get started"}
            </p>
          </div>
        </div>

        {message && (
          <Alert
            className={`mb-6 ${message.type === "error" ? "border-destructive" : "border-primary"}`}
          >
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription
              className={
                message.type === "error" ? "text-destructive" : "text-primary"
              }
            >
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Add Employee Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <UserPlus className="w-5 h-5" />
              Add New Employee
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Name</Label>
              <Input
                id="employeeName"
                placeholder="Enter full name"
                value={newEmployeeName}
                onChange={(e) => setNewEmployeeName(e.target.value)}
                disabled={!isConnected || !isModerator || isAddingEmployee}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employeeAddress">Wallet Address</Label>
              <div className="flex gap-2">
                <Input
                  id="employeeAddress"
                  placeholder="0x..."
                  value={newEmployeeAddress}
                  onChange={(e) => setNewEmployeeAddress(e.target.value)}
                  disabled={!isConnected || !isModerator || isAddingEmployee}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateRandomAddress}
                  disabled={!isConnected || !isModerator || isAddingEmployee}
                  title="Generate random wallet address"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Click the refresh icon to generate a random wallet address
              </p>
            </div>
            <Button
              onClick={handleAddEmployee}
              disabled={
                !isConnected ||
                !isModerator ||
                !newEmployeeName.trim() ||
                !newEmployeeAddress.trim() ||
                isAddingEmployee
              }
              className="w-full"
              size="lg"
            >
              {isAddingEmployee ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
            {!isConnected && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please connect your wallet to add employees
                </AlertDescription>
              </Alert>
            )}
            {!isModerator && isConnected && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only moderators can add employees
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Users className="w-5 h-5" />
              Current Team
              <Badge variant="secondary">
                {employeeAddresses?.length || 0}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employeeAddresses && employeeAddresses.length > 0 ? (
                employeeAddresses.map((employeeAddress: string) => (
                  <EmployeeCard
                    key={employeeAddress}
                    address={employeeAddress}
                    contractAddress={contractAddress}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No employees added yet
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Separate component to load individual employee data
function EmployeeCard({
  address,
  contractAddress,
}: {
  address: string;
  contractAddress: `0x${string}`;
}) {
  const { data: employeeData } = useReadOfficeLotteryEmployees({
    address: contractAddress,
    args: [address as `0x${string}`],
  });

  if (!employeeData) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const [name, , activeToday] = employeeData;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-lg">{name}</p>
          {activeToday && (
            <Badge variant="outline" className="text-xs">
              Active Today
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground font-mono">{address}</p>
      </div>
    </div>
  );
}
