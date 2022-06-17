export default async function markdownToHtml(markdown) {
  const { remark } = await import("remark")
  const html = (await import("remark-html")).default
  // const prism = (await import("remark-prism")).default
  const result = await remark().use(html).process(markdown)
  return result.toString()
}
