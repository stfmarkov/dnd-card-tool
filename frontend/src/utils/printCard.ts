import { toBlob } from "html-to-image";
import { toValidFileName } from "./toValidFileName";
import { SaveCardPNG } from "../../wailsjs/go/main/App";

export const printCard = async (elementSelector: string, name: string) => {

    const el = document.querySelector(elementSelector) as HTMLElement | null
    if (!el) throw new Error('Card element not found')

    const blob = await toBlob(el)
    if (!blob) throw new Error('Failed to render card image')

    const defaultName = `${toValidFileName(`${name}`)}.png`
    const buf = new Uint8Array(await blob.arrayBuffer())
    await SaveCardPNG(defaultName, Array.from(buf))
    return defaultName

}