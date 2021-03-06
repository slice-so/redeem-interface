import { webcrypto } from "crypto"
const { subtle } = webcrypto

export const encryptTexts = async (
  productFormId: string,
  redeemedUnits: string,
  texts: string[]
) => {
  const key = await generateKey()
  const enc = new TextEncoder()
  const iv = calculateIv(productFormId, redeemedUnits)
  let encryptedTexts: string[] = []

  for (let i = 0; i < texts.length; i++) {
    const encoded = enc.encode(texts[i])

    const encryptedBuf: ArrayBuffer = await subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encoded
    )
    encryptedTexts.push(new Uint8Array(encryptedBuf).toString())
  }

  return encryptedTexts
}

export const decryptTexts = async (
  productFormId: string | number,
  redeemedUnits: string | number,
  texts: string[]
) => {
  const key = await generateKey()
  const dec = new TextDecoder()
  const iv = calculateIv(productFormId, redeemedUnits)

  let decryptedTexts: string[] = []

  for (let i = 0; i < texts.length; i++) {
    const encoded = new Uint8Array(texts[i].split(",").map((e) => Number(e)))
    const encryptedBuf: ArrayBuffer = await subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      encoded
    )
    decryptedTexts.push(dec.decode(encryptedBuf))
  }

  return decryptedTexts
}

const generateKey = async () => {
  let enc = new TextEncoder()

  const keyMaterial = await subtle.importKey(
    "raw",
    enc.encode(process.env.CRYPTO_PASSWORD),
    "PBKDF2",
    false,
    ["deriveKey"]
  )

  const key = await subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: Buffer.from(process.env.CRYPTO_SALT),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  )

  return key
}

const calculateIv = (
  productFormId: string | number,
  redeemedUnits: string | number
) =>
  new Uint8Array([
    5,
    254,
    31,
    Number(productFormId),
    63,
    77,
    Number(redeemedUnits),
    175,
    153,
    129,
    222,
    47
  ])

// TODO: Improve encryption / decryption madness
