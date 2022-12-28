type Props = { stateValue: string }

export const clientId = "app-8875250"

const CreateFormPrintful = ({ stateValue }: Props) => {
  const redirectUrl = process.env.NEXT_PUBLIC_APP_URL + "/create"

  return (
    <>
      <div className="text-left">
        <a
          href={`https://www.printful.com/oauth/authorize?client_id=${clientId}&state=${stateValue}&redirect_url=${redirectUrl}`}
        >
          Connect your printful account
        </a>
      </div>
    </>
  )
}

export default CreateFormPrintful

/** TODO:
  - Connect printful account
    - Auth with printful
    - Store access token in db
  - Link printful items with slicer product -> store in db
  - Automatically set delivery info for delivery
  - Add optional printful order submission on redeem
    - Refresh auth token if expired
*/
