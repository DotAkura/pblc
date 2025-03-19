import type { GameSettings, MinesSettings, DiceSettings, CrashSettings } from "./models"

// Default game settings
const defaultGameSettings: GameSettings = {
  minesSettings: {
    houseEdge: 1,
    mineCount: 5,
    gridSize: 25,
    maxMultiplier: 100,
    lossChance: 5,
  },
  diceSettings: {
    houseEdge: 1,
    winChance: 49,
    maxMultiplier: 98,
    lossChance: 3,
  },
  crashSettings: {
    houseEdge: 1,
    crashChance: 1,
    maxMultiplier: 100,
  },
}

// Helper to check if we're in a browser environment
const isBrowser = () => typeof window !== "undefined"

export const gameSettingsService = {
  // Get all game settings
  getGameSettings: (): GameSettings => {
    if (isBrowser()) {
      const storedSettings = localStorage.getItem("gameSettings")
      if (storedSettings) {
        try {
          return JSON.parse(storedSettings)
        } catch (e) {
          console.error("Failed to parse game settings", e)
          return defaultGameSettings
        }
      }
    }
    return defaultGameSettings
  },

  // Save all game settings
  saveGameSettings: (settings: GameSettings): Promise<GameSettings> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isBrowser()) {
          localStorage.setItem("gameSettings", JSON.stringify(settings))
        }
        resolve(settings)
      }, 500) // Simulate API delay
    })
  },

  // Get mines settings
  getMinesSettings: (): MinesSettings => {
    return gameSettingsService.getGameSettings().minesSettings
  },

  // Save mines settings
  saveMinesSettings: (settings: MinesSettings): Promise<MinesSettings> => {
    return new Promise((resolve) => {
      const currentSettings = gameSettingsService.getGameSettings()
      const updatedSettings = {
        ...currentSettings,
        minesSettings: settings,
      }

      gameSettingsService.saveGameSettings(updatedSettings).then(() => resolve(settings))
    })
  },

  // Get dice settings
  getDiceSettings: (): DiceSettings => {
    return gameSettingsService.getGameSettings().diceSettings
  },

  // Save dice settings
  saveDiceSettings: (settings: DiceSettings): Promise<DiceSettings> => {
    return new Promise((resolve) => {
      const currentSettings = gameSettingsService.getGameSettings()
      const updatedSettings = {
        ...currentSettings,
        diceSettings: settings,
      }

      gameSettingsService.saveGameSettings(updatedSettings).then(() => resolve(settings))
    })
  },

  // Get crash settings
  getCrashSettings: (): CrashSettings => {
    return gameSettingsService.getGameSettings().crashSettings
  },

  // Save crash settings
  saveCrashSettings: (settings: CrashSettings): Promise<CrashSettings> => {
    return new Promise((resolve) => {
      const currentSettings = gameSettingsService.getGameSettings()
      const updatedSettings = {
        ...currentSettings,
        crashSettings: settings,
      }

      gameSettingsService.saveGameSettings(updatedSettings).then(() => resolve(settings))
    })
  },

  // Apply game settings to a mines game result
  applyMinesSettings: (isWin: boolean, settings?: MinesSettings): boolean => {
    const minesSettings = settings || gameSettingsService.getMinesSettings()

    // If the game result is already a loss, keep it as a loss
    if (!isWin) return false

    // Apply forced loss chance
    if (minesSettings.lossChance > 0) {
      const random = Math.random() * 100
      if (random < minesSettings.lossChance) {
        return false // Force a loss
      }
    }

    return isWin
  },

  // Apply game settings to a dice game result
  applyDiceSettings: (isWin: boolean, settings?: DiceSettings): boolean => {
    const diceSettings = settings || gameSettingsService.getDiceSettings()

    // If the game result is already a loss, keep it as a loss
    if (!isWin) return false

    // Apply forced loss chance
    if (diceSettings.lossChance > 0) {
      const random = Math.random() * 100
      if (random < diceSettings.lossChance) {
        return false // Force a loss
      }
    }

    return isWin
  },
}

