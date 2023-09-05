import fs from "fs/promises"

export default async function getPrintfulColors() {
  const res = await fetch("https://api.printful.com/products")
  const data = await res.json()

  let colors = {}

  for (const p of data.result) {
    const hasColor = p.options.some((o) => o.id.includes("color"))
    if (!hasColor) continue

    const product = await fetch(`https://api.printful.com/products/${p.id}`)
    const res = await product.json()
    console.log(res)
    const productData = res.result
    if (!productData.variants) continue

    for (const v of productData.variants) {
      const colorKey = v.color
      const colorValue = v.color_code

      // Accumulate color in the colors object
      colors[colorKey] = colorValue
      console.log(colorKey, colorValue)
    }

    // await to not get rate limited
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  // Save colors to a JSON file
  await fs.writeFile(
    "constants/printfulColors.json",
    JSON.stringify(colors, null, 2)
  )
}
