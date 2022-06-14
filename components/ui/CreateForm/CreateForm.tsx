import { useAppContext } from "../context"

type Props = {
  productCreator: string
}

const CreateForm = ({ productCreator }: Props) => {
  const { account } = useAppContext()

  return productCreator == account.toLowerCase() ? (
    <div>
      <p>Correct account</p>
    </div>
  ) : (
    <p className="max-w-md mx-auto">
      The connected address is not the creator of this product. Verify you are
      the creator of this product and you are connected with the correct
      address.
    </p>
  )
}

export default CreateForm
