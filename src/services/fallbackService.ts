// Fallback blockchain service for production when modules fail to load
export class FallbackBlockchainService {
  static async simulateTransaction(type: string, amount: number) {
    console.log(`🔄 Simulating ${type} transaction of ${amount}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      ok: true,
      txid: `fallback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      message: `${type} simulated successfully (demo mode)`
    };
  }

  static async simulateBalance() {
    return {
      ok: true,
      balance: 2.5,
      message: "Demo balance loaded"
    };
  }

  static async simulateCount(type: string) {
    return {
      ok: true,
      count: Math.floor(Math.random() * 100),
      message: `Demo ${type} count`
    };
  }
}
