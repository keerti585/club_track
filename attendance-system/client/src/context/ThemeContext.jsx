import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('theme') || 'dark'
        try {
            document.documentElement.setAttribute('data-theme', saved)
        } catch (e) {
            // ignore (server-side rendering or unavailable document)
        }
        return saved
    })

    useEffect(() => {
        localStorage.setItem('theme', theme)
        try {
            document.documentElement.setAttribute('data-theme', theme)
        } catch (e) {
            // ignore
        }
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
