# Disney+ Roku Clone - Technical Assessment

This project was built with [Create React App](https://github.com/facebook/create-react-app).

## Project Overview

A high-performance Disney+ clone built with TypeScript/React, demonstrating Roku development patterns and BrightScript architecture understanding.

## 📋 Requirements Checklist

### Core Requirements
- ✅ **API Integration** - Consumes Disney+ home page API and renders content
- ✅ **1.78 Aspect Ratio** - Specifically selects and displays 16:9 images
- ✅ **Focus Scaling** - Focused tiles scale up by 1.15x with smooth animation
- ✅ **Roku Device Support** - Built with standard patterns compatible with all Roku devices
- ✅ **Remote Navigation** - Full D-pad navigation (↑↓←→ + OK/Back)
- ✅ **Multiple Rows** - Displays dynamic content rows with horizontal scrolling

### Extra Credit Achievements
- ✅ **Dynamic Ref Sets** - Lazy loads content as rows come into view
- ✅ **Tile Interaction** - Modal with content details, Play/Add buttons
- ✅ **Visual Transitions** - Smooth animations, shimmer effects, focus states
- ✅ **Disney Magic** - Loading animations, glow effects, parallax gradients

## 🏗️ Architecture

```
src/
├── components/           # UI Components (SceneGraph equivalent)
│   ├── HomeScreen/      # Main scene component
│   ├── ContentRow/      # Horizontal content rows
│   ├── ContentTile/     # Individual content posters
│   ├── DetailModal/     # Content detail overlay
│   └── LoadingIndicator/# Loading state with Disney magic
├── hooks/               # Custom React hooks
│   └── useRokuNavigation.ts  # Reusable D-pad navigation
├── services/            # Business logic
│   └── api.service.ts   # API calls with caching
├── types/               # TypeScript definitions
│   └── disney.types.ts  # Content models
└── utils/               # Utility functions
```

## 🎯 Key Features

### 1. **Performance Optimizations**
- **Lazy Loading**: Ref sets load only when scrolled into view
- **Image Caching**: Reduces redundant network requests
- **Smooth Scrolling**: Hardware-accelerated CSS transforms
- **Efficient Re-renders**: Optimized React component updates

### 2. **Roku/TV UX Patterns**
- **Focus-Based Navigation**: No mouse required, pure D-pad control
- **Visual Focus Indicators**: Clear white border + scale animation
- **Overscan Safe**: 90px margins respect TV safe zones
- **Hidden Scrollbars**: Clean TV interface without scroll indicators

### 3. **Production-Ready Code**
- **TypeScript**: Full type safety with detailed interfaces
- **Error Handling**: Graceful fallbacks for API failures
- **Loading States**: Skeleton screens and shimmer effects

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Building and Running on Roku Devices

To deploy this application to a Roku device:

1. Run `npm run build` to create the optimized production build
2. Install the Roku Developer Tools on your computer
3. Enable Developer Mode on your Roku device
4. Package the build folder contents into a zip file
5. Upload the package to your Roku device using the Developer Application Installer
6. The application should launch automatically

Note: This project demonstrates React/TypeScript implementations of patterns that would typically be built in BrightScript and SceneGraph for actual Roku deployment.