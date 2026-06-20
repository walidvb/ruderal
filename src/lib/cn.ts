import { clsx } from "clsx"
import { extendTailwindMerge, getDefaultConfig } from "tailwind-merge"

const customTwMerge = extendTailwindMerge(() => {
  const config = getDefaultConfig()
  // @ts-ignore
  config.classGroups["font-size"] = [
    {
      text: [
        "heading-l",
        "heading-m",
        "heading-s",
        "heading-xs",
        "body-l",
        "body-m",
        "body-s",
        "m_heading-s",
        "m_heading-xs",
        "m_body-l",
        "m_body-m",
        "m_body-s",
        "text",
        "button",
        "title-3",
        "subtitle-3",
        "subtitle",
        "subtitle-2",
        "title-2",
      ],
    },
  ]
  // @ts-ignore
  config.classGroups["text-color"] = [
    {
      text: [
        "yellow",
        "red",
        "pink",
        "brand",
        "brand-dark",
        "brand-light",
        "brand-ultralight",
        "white",
        "blue",
      ],
    },
  ]
  return config
})
export function cn(...inputs: any[]) {
  return customTwMerge(clsx(inputs))
}
