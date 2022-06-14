import { Button, Input, VerifiedBlock, RedeemForm } from "@components/ui"
import { useState } from "react"
import { useAppContext } from "../context"
import usePrismaQuery from "@utils/prismaQuery"
import Spinner from "@components/icons/Spinner"

const ProductsList = () => {
  const { account } = useAppContext()

  const data = usePrismaQuery(`/api/form/creator?account=${account}`)

  console.log(data)

  return data ? (
    <>
      <p>Connected</p>
    </>
  ) : (
    <div className="flex justify-center">
      <Spinner size="w-10 h-10" />
    </div>
  )
}

export default ProductsList
