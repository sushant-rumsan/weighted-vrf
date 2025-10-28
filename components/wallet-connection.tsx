"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react"
import { useWalletConnection } from "@/hooks/use-wallet"

export function WalletConnection() {
  const { address, isConnected, isConnecting, chainId, error, connect, disconnect } = useWalletConnection()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Wallet Connection
        </CardTitle>
        <CardDescription>Connect your wallet to interact with the lottery smart contract</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
              <div>
                <p className="font-medium">Connected</p>
                <p className="text-sm text-muted-foreground font-mono">{formatAddress(address!)}</p>
                {chainId && <p className="text-xs text-muted-foreground">Chain ID: {chainId}</p>}
              </div>
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={disconnect} className="flex-1 bg-transparent">
                Disconnect
              </Button>
              <Button variant="outline" size="icon" asChild>
                <a href={`https://etherscan.io/address/${address}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-center py-4">
              <Wallet className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No wallet connected</p>
            </div>
            <Button onClick={connect} disabled={isConnecting} className="w-full">
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Contract Status</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contract Address</span>
              <Badge variant="outline">Not Configured</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network</span>
              <Badge variant="outline">Ethereum</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
