// Algorand Payment Integration for Cover Letter Subscriptions
import algosdk from 'algosdk';

interface AlgorandConfig {
  server: string;
  port: number;
  token: string;
  network: 'testnet' | 'mainnet';
}

interface PaymentTransaction {
  txId: string;
  amount: number;
  sender: string;
  receiver: string;
  timestamp: number;
  confirmed: boolean;
}

interface SubscriptionPayment {
  userId: string;
  subscriptionType: 'basic' | 'premium';
  amount: number;
  duration: number; // in days
  txId: string;
}

export class AlgorandPaymentService {
  private algodClient: algosdk.Algodv2;
  private config: AlgorandConfig;
  private appAddress: string;

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.config = {
      server: network === 'testnet' 
        ? 'https://testnet-api.algonode.cloud' 
        : 'https://mainnet-api.algonode.cloud',
      port: 443,
      token: '',
      network
    };

    this.algodClient = new algosdk.Algodv2(
      this.config.token,
      this.config.server,
      this.config.port
    );

    // CareerKit app wallet address (would be generated during deployment)
    this.appAddress = network === 'testnet' 
      ? 'TESTNET_APP_ADDRESS_HERE' 
      : 'MAINNET_APP_ADDRESS_HERE';
  }

  /**
   * Create a payment transaction for cover letter subscription
   */
  async createSubscriptionPayment(
    userWallet: string,
    subscriptionType: 'basic' | 'premium',
    userPrivateKey: Uint8Array
  ): Promise<PaymentTransaction> {
    try {
      const amount = this.getSubscriptionAmount(subscriptionType);
      const suggestedParams = await this.algodClient.getTransactionParams().do();

      // Create payment transaction
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: userWallet,
        to: this.appAddress,
        amount: algosdk.algosToMicroalgos(amount),
        suggestedParams,
        note: new Uint8Array(Buffer.from(`CareerKit-${subscriptionType}-subscription`))
      });

      // Sign transaction
      const signedTxn = txn.signTxn(userPrivateKey);

      // Submit transaction
      const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();

      // Wait for confirmation
      const confirmedTxn = await this.waitForConfirmation(txId);

      return {
        txId,
        amount,
        sender: userWallet,
        receiver: this.appAddress,
        timestamp: Date.now(),
        confirmed: confirmedTxn !== null
      };
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw new Error('Failed to create payment transaction');
    }
  }

  /**
   * Verify payment transaction on blockchain
   */
  async verifyPayment(txId: string): Promise<boolean> {
    try {
      const txInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      return txInfo['confirmed-round'] > 0;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  /**
   * Get subscription amount based on type
   */
  private getSubscriptionAmount(type: 'basic' | 'premium'): number {
    const prices = {
      basic: 3, // $3 for 7 additional cover letters
      premium: 10 // $10 for unlimited monthly access
    };
    return prices[type];
  }

  /**
   * Wait for transaction confirmation
   */
  private async waitForConfirmation(txId: string, maxRounds = 10): Promise<any> {
    const status = await this.algodClient.status().do();
    let lastRound = status['last-round'];

    for (let i = 0; i < maxRounds; i++) {
      const pendingInfo = await this.algodClient.pendingTransactionInformation(txId).do();
      
      if (pendingInfo['confirmed-round'] !== null && pendingInfo['confirmed-round'] > 0) {
        return pendingInfo;
      }

      lastRound++;
      await this.algodClient.statusAfterBlock(lastRound).do();
    }

    throw new Error('Transaction not confirmed after maximum rounds');
  }

  /**
   * Generate new Algorand wallet
   */
  generateWallet(): { address: string; privateKey: Uint8Array; mnemonic: string } {
    const account = algosdk.generateAccount();
    const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
    
    return {
      address: account.addr,
      privateKey: account.sk,
      mnemonic
    };
  }

  /**
   * Restore wallet from mnemonic
   */
  restoreWallet(mnemonic: string): { address: string; privateKey: Uint8Array } {
    const account = algosdk.mnemonicToSecretKey(mnemonic);
    
    return {
      address: account.addr,
      privateKey: account.sk
    };
  }

  /**
   * Get wallet balance
   */
  async getWalletBalance(address: string): Promise<number> {
    try {
      const accountInfo = await this.algodClient.accountInformation(address).do();
      return algosdk.microalgosToAlgos(accountInfo.amount);
    } catch (error) {
      console.error('Failed to get wallet balance:', error);
      return 0;
    }
  }

  /**
   * Create smart contract for subscription management
   */
  async deploySubscriptionContract(): Promise<string> {
    // This would contain the actual smart contract deployment logic
    // For now, returning a placeholder
    return 'CONTRACT_APP_ID_PLACEHOLDER';
  }
}

// Subscription management with blockchain integration
export class SubscriptionManager {
  private paymentService: AlgorandPaymentService;
  private storageKey = 'careerkit_subscription';

  constructor(network: 'testnet' | 'mainnet' = 'testnet') {
    this.paymentService = new AlgorandPaymentService(network);
  }

  /**
   * Process subscription payment
   */
  async processSubscription(
    userWallet: string,
    privateKey: Uint8Array,
    subscriptionType: 'basic' | 'premium'
  ): Promise<SubscriptionPayment> {
    try {
      const payment = await this.paymentService.createSubscriptionPayment(
        userWallet,
        subscriptionType,
        privateKey
      );

      const subscription: SubscriptionPayment = {
        userId: userWallet,
        subscriptionType,
        amount: payment.amount,
        duration: subscriptionType === 'basic' ? 30 : 30, // 30 days
        txId: payment.txId
      };

      // Save subscription locally
      this.saveSubscription(subscription);

      return subscription;
    } catch (error) {
      console.error('Subscription processing failed:', error);
      throw new Error('Failed to process subscription payment');
    }
  }

  /**
   * Verify subscription status
   */
  async verifySubscription(txId: string): Promise<boolean> {
    return await this.paymentService.verifyPayment(txId);
  }

  /**
   * Save subscription to local storage
   */
  private saveSubscription(subscription: SubscriptionPayment): void {
    try {
      const existing = this.getStoredSubscriptions();
      existing.push(subscription);
      localStorage.setItem(this.storageKey, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save subscription:', error);
    }
  }

  /**
   * Get stored subscriptions
   */
  private getStoredSubscriptions(): SubscriptionPayment[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
      return [];
    }
  }

  /**
   * Check if user has active subscription
   */
  hasActiveSubscription(userWallet: string): boolean {
    const subscriptions = this.getStoredSubscriptions();
    const userSubscriptions = subscriptions.filter(sub => sub.userId === userWallet);
    
    if (userSubscriptions.length === 0) return false;

    // Check if any subscription is still valid (within duration)
    const now = Date.now();
    return userSubscriptions.some(sub => {
      const subscriptionDate = new Date(sub.txId).getTime(); // Simplified - would use actual tx timestamp
      const expiryDate = subscriptionDate + (sub.duration * 24 * 60 * 60 * 1000);
      return now < expiryDate;
    });
  }
}

// Export singleton instances
export const algorandPayment = new AlgorandPaymentService();
export const subscriptionManager = new SubscriptionManager();