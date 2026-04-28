import { toBlob } from "html-to-image";
import { toValidFileName } from "./toValidFileName";
import { SaveCardPNG } from "../../wailsjs/go/main/App";
import { LogError } from "../../wailsjs/runtime/runtime";

export const printCard = async (elementSelector: string, name: string) => {

    const el = document.querySelector(elementSelector) as HTMLElement | null
    if (!el) return
  
    try {
      const blob = await toBlob(el)
      if (!blob) return
  
      const defaultName = `${toValidFileName(`${name}`)}.png`
      const buf = new Uint8Array(await blob.arrayBuffer())
      await SaveCardPNG(defaultName, Array.from(buf))
    } catch (e) {
      LogError(String(e))
    }

}