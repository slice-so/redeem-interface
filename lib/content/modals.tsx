import { DoubleText, SubmissionBlock } from "@components/ui"

export type View = {
  name: ViewNames
  cross?: boolean
  params?: object
}
type ViewNames = "" | "SUBMISSIONS_VIEW"

export const SUBMISSIONS_VIEW = (params: any) => {
  const { slicerId, productId, questions, submissions } = params
  const orderedSubmissions = submissions.sort((a, b) =>
    a.createdAt < b.createdAt ? 1 : -1
  )

  return (
    <>
      <div className="pb-6 text-center">
        <DoubleText inactive logoText="Submissions" />
        <p className="pt-4 text-sm font-semibold text-gray-600 uppercase">
          #{slicerId}/{productId}
        </p>
      </div>
      <div className="grid justify-between grid-cols-5 p-4">
        <p className="col-span-2 font-semibold text-gray-600">Address</p>
        <p className="font-semibold text-center text-gray-600">Redeemed</p>
        <p className="col-span-2 font-semibold text-right text-gray-600">
          Date
        </p>
      </div>
      <ul className="space-y-4">
        {orderedSubmissions.map((el, key) => (
          <SubmissionBlock
            key={key}
            questions={questions}
            submission={submissions[key]}
          />
        ))}
      </ul>
    </>
  )
}
