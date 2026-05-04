import placeholderUrl from '../assets/images/placeholder.svg?url';

export const toBase64Src = (artwork?: string) => {
    const raw = artwork?.trim()
    if (!raw) return placeholderUrl
    return `data:image/png;base64,${raw}`
}