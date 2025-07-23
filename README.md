# Stock Market Recommender

A React Native mobile application that provides stock market recommendations based on price and social media mentions data. Built with Expo for cross-platform compatibility.


## Features

- Search for stock symbols and view historical data
- Interactive charts for price and mentions visualization
- Data-driven stock recommendations (Buy/Hold/Sell)
- Paginated results for better performance
- Clean and intuitive user interface
- Built with TypeScript for type safety


## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (for local development)

## Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

3. Run on your preferred platform:
   - iOS Simulator: Press `i` in the terminal
   - Android Emulator: Press `a` in the terminal
   - Physical device: Scan the QR code with the Expo Go app

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate test coverage report
npm run test:coverage
```

## Technologies Used

- React Native
- Expo
- TypeScript
- React Navigation
- React Native Chart Kit
- Jest & React Testing Library

## Project Structure

```
src/
├── components/      # Reusable UI components
├── screens/        # Screen components
├── services/       # API and data services
├── utils/          # Utility functions and helpers
└── __tests__/     # Test files
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with ❤️ using React Native and Expo
- Charting powered by react-native-chart-kit
- Testing with Jest and React Testing Library
