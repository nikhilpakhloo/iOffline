# TechReighs

TechReighs is an addictive, offline-first, swipe-based CEO simulation game built with React Native and powered by a highly optimized local SQLite engine.

## The Gameplay Loop
You are the CEO of a Silicon Valley startup. Every turn, you must make a critical decision by swiping left or right on a scenario card. Each decision impacts four core metrics:
1. 💰 **Cash**
2. 👨‍💻 **Team Morale**
3. 🚀 **Product Quality**
4. 📰 **Public PR**

If any metric drops to 0, you get fired and the game ends!

---

## Implementation Phases

### Phase 1: Engine Dependencies & SQLite Schema
- Install `react-native-reanimated` and `react-native-gesture-handler` for buttery smooth 60fps physics.
- Configure `babel.config.js` to support the animation plugins.
- Update the SQLite migration scripts (`src/sqlite/migrations/scripts.ts`) to create the `Cards` and `HighScores` tables.
- Create repositories (`CardRepository` and `HighScoreRepository`) to manage game data.

### Phase 2: The HUD (Heads Up Display) UI
- Define TypeScript models for the Game State.
- Build the main `GameScreen` UI structure.
- Create a `MetricBar` component to visually display the static levels of Cash, Morale, Product, and PR.

### Phase 3: Core Game Logic (Functionality)
- Implement the core game loop (applying card effects to state and checking for game-over conditions).
- Connect the Game State to the HUD UI.

### Phase 4: The Physics Swipe Engine
- Build the `SwipeableCard` component using `PanGestureHandler`.
- Implement Reanimated logic so the card tilts and follows the user's thumb smoothly.
- Add visual indicators that light up to show which metrics will be affected based on the drag direction.

### Phase 5: Polish, Haptics & High Scores
- Add tactile `Vibration` (haptic feedback) when a card is released or snapped.
- Build a sleek Game Over screen that explains why the CEO was fired.
- Save "Weeks Survived" to the SQLite `HighScores` table and display the all-time best record.
