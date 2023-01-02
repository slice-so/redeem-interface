const getBlurImageUrl = (url: string) => {
  const fileExt = url.split(".").pop()
  const blurImageUrl = `${url.substring(
    0,
    url.length - fileExt.length - 1
  )}_blur.${fileExt}`

  return blurImageUrl
}

export default getBlurImageUrl
