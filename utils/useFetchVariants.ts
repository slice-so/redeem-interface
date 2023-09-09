import useSWR from "swr"
import fetcher from "./fetcher"

const useFetchVariants = () => {
  const url =
    "https://raw.githubusercontent.com/slice-so/cron-job/main/data/printfulVariants.json"

  const { data, error } = useSWR(url, fetcher)

  return {
    variantsJson: data,
    isLoading: !error && !data,
    isError: error
  }
}

export default useFetchVariants
