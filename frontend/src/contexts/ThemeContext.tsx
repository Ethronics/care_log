import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Theme, getTheme, setTheme as setThemeUtil, toggleTheme as toggleThemeUtil } from '../utils/theme'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => getTheme())

  useEffect(() => {
    // Initialize theme on mount
    const currentTheme = getTheme()
    setThemeState(currentTheme)
    setThemeUtil(currentTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = toggleThemeUtil()
    setThemeState(newTheme)
  }

  const setTheme = (newTheme: Theme) => {
    setThemeUtil(newTheme)
    setThemeState(newTheme)
  }

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if no manual preference is set
      if (!localStorage.getItem('theme')) {
        const newTheme = e.matches ? 'dark' : 'light'
        setThemeUtil(newTheme)
        setThemeState(newTheme)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
