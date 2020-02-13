import {useCallback, useState} from 'react'
export type StocksMode = 'absolute' | 'percent'

export const useMode = (initialValue: StocksMode = 'absolute') =>{
    const [mode, setMode] = useState<StocksMode>(initialValue)
    const toggleMode = useCallback(() => {
        mode === 'absolute' ? setMode('percent') : setMode('absolute')
    }, [mode, setMode])

    return {
        mode,
        toggleMode
    }
}
