import type { StaticImageData } from "next/image"

import avatarImg from "@quoosh/web/assets/Avatar/avatar.png"
import confusedImg from "@quoosh/web/assets/Avatar/confused.png"
import coolDudeImg from "@quoosh/web/assets/Avatar/cool-dude.png"
import elephantImg from "@quoosh/web/assets/Avatar/elephant.png"
import foxImg from "@quoosh/web/assets/Avatar/fox.png"
import frogImg from "@quoosh/web/assets/Avatar/frog.png"
import girlImg from "@quoosh/web/assets/Avatar/girl.png"
import krakenImg from "@quoosh/web/assets/Avatar/kraken.png"
import lionImg from "@quoosh/web/assets/Avatar/lion.png"
import marvelImg from "@quoosh/web/assets/Avatar/marvel.png"
import monkeyImg from "@quoosh/web/assets/Avatar/monkey.png"
import otakuImg from "@quoosh/web/assets/Avatar/otaku.png"
import robotImg from "@quoosh/web/assets/Avatar/robot.png"
import tigerImg from "@quoosh/web/assets/Avatar/Tiger.png"

export type AvatarKey =
  | "avatar"
  | "confused"
  | "cool-dude"
  | "elephant"
  | "fox"
  | "frog"
  | "girl"
  | "kraken"
  | "lion"
  | "marvel"
  | "monkey"
  | "otaku"
  | "robot"
  | "Tiger"

export const AVATARS: {
  key: AvatarKey
  src: StaticImageData
  label: string
}[] = [
  { key: "avatar", src: avatarImg, label: "Avatar" },
  { key: "confused", src: confusedImg, label: "Confused" },
  { key: "cool-dude", src: coolDudeImg, label: "Cool Dude" },
  { key: "elephant", src: elephantImg, label: "Elephant" },
  { key: "fox", src: foxImg, label: "Fox" },
  { key: "frog", src: frogImg, label: "Frog" },
  { key: "girl", src: girlImg, label: "Girl" },
  { key: "kraken", src: krakenImg, label: "Kraken" },
  { key: "lion", src: lionImg, label: "Lion" },
  { key: "marvel", src: marvelImg, label: "Marvel" },
  { key: "monkey", src: monkeyImg, label: "Monkey" },
  { key: "otaku", src: otakuImg, label: "Otaku" },
  { key: "robot", src: robotImg, label: "Robot" },
  { key: "Tiger", src: tigerImg, label: "Tiger" },
]

/** Resolve a StaticImageData from an avatar key string */
export const AVATAR_MAP: Record<string, StaticImageData> = Object.fromEntries(
  AVATARS.map(({ key, src }) => [key, src]),
)

/** Fallback to first avatar if key not found */
export function getAvatarSrc(key?: string): StaticImageData {
  return key ? (AVATAR_MAP[key] ?? AVATARS[0].src) : AVATARS[0].src
}
