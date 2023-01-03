module.exports = {
  swcMinify: true,
  images: {
    domains: [
      "files.cdn.printful.com",
      process.env.NEXT_PUBLIC_SUPABASE_URL.split("://").pop()
    ]
  }
}
