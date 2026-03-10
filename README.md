# StakeYourTake - Bitcoin Prediction Platform

🚀 **Decentralized Bitcoin prediction market built on OP_NET blockchain**

## ✨ Features

- **📊 Bitcoin Predictions** - Make predictions on Bitcoin price movements
- **💰 Multi-Token Support** - Stake with BTC, MOTO, and PILL tokens
- **⚡ Blockchain Integration** - Real OP_NET blockchain transactions
- **🎯 Gamified Experience** - Earn reputation, badges, and rewards
- **💎 Beautiful UI** - Modern design with animations and golden rain effects
- **📱 Responsive Design** - Works perfectly on desktop and mobile

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Blockchain**: OP_NET + OP20 Tokens
- **Deployment**: Vercel + GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PrestoAlex/StakeYourTake2.git
cd StakeYourTake2
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:5174
```

## 📦 Build & Deploy

### Local Build
```bash
npm run build
npm run preview
```

### Deploy to Vercel

1. **Connect to GitHub**
   - Fork this repository
   - Connect your Vercel account to GitHub

2. **Deploy**
   - Import project in Vercel dashboard
   - All settings are pre-configured in `vercel.json`
   - Deploy automatically on push to main branch

## 🔧 Configuration

### Contract Addresses (OP_NET Testnet)

```typescript
// Real deployed contract addresses
CONTRACTS = {
  prediction: 'opt1sqpanuqzxmqxhvllzd9rc2t064c53dl4pqsndyh3t',
  stake: 'opt1sqrj8l5rraht9aw2s69ye6ugl7yuprf4llccyqyaw',
  tip: 'opt1sqq9atq0ayd333h2mvexv5dg5gryru5u4nckyzdwk',
  like: 'opt1sqpus3w732f9dvstuehjn2gpnt3652p569usgwu8e',
  comment: 'opt1sqqjnrrtggvysex6nqpjqql623gnc3mnd3cmx50hx',
  reputation: 'opt1sqqhqa7390yc4dte6ppwu47mrt78kretxcgxlt5el'
}

TOKENS = {
  MOTO: 'opt1sqzkx6wm5acawl9m6nay2mjsm6wagv7gazcgtczds',
  PILL: 'opt1sqp5gx9k0nrqph3sy3aeyzt673dz7ygtqxcfdqfle'
}
```

### Environment Variables
No environment variables required - all configuration is built-in.

## 🎮 How to Use

1. **Connect Wallet** - Click "Connect Wallet" to connect your OP_NET wallet
2. **Make Predictions** - Click "New Take" to create Bitcoin predictions
3. **Stake Tokens** - Stake BTC, MOTO, or PILL on predictions you believe in
4. **Earn Rewards** - Get reputation points and badges for accurate predictions
5. **Social Features** - Like, comment, and tip other users' predictions

## 🔗 Links

- **Live Demo**: [Deployed on Vercel](https://stakeyourtake2.vercel.app)
- **OP_NET Testnet**: https://testnet.opnet.org
- **Explorer**: https://opscan.org

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/PrestoAlex/StakeYourTake2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/PrestoAlex/StakeYourTake2/discussions)

---

**Built with ❤️ for the Bitcoin community**
