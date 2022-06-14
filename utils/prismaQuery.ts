import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { ApolloQueryResult } from "@apollo/client"

export const prismaQuery = async (
  queryUrl: string,
  setData: Dispatch<SetStateAction<ApolloQueryResult<any>>>
) => {
  const fetcher = (await import("@utils/fetcher")).default

  try {
    const { data } = await fetcher(queryUrl)
    setData(data)
  } catch (err) {
    console.log("Error fetching data: ", err)
  }
}

const usePrismaQuery = (queryUrl: string, dependencies = []) => {
  const [data, setData] = useState(null)
  useEffect(() => {
    let execute = true
    dependencies.map((dep) => {
      !dep ? (execute = false) : null
    })
    if (execute) {
      prismaQuery(queryUrl, setData)
    }
  }, dependencies)
  return data
}

export default usePrismaQuery
