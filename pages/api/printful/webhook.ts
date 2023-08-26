import type { NextApiRequest, NextApiResponse } from "next"
import corsMiddleware from "@utils/corsMiddleware"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await corsMiddleware(req, res)

  try {
    if (req.method === "POST") {
      const { type, data } = req.body
      let message = ""

      const items = data.order.items
        .map((item) => item.quantity + " x " + item.name)
        .join("\n- ")

      switch (type) {
        case "package_shipped":
          const { order, shipment } = data

          message = `Your package has been shipped! 📦 See tracking details below\n\nOrder ${
            order.external_id
          }\nCarrier: ${shipment.carrier}\nTracking number: ${
            shipment.tracking_number
          }\nTracking URL: ${
            shipment.tracking_url
          }\nExtimated delivery date: from ${new Date(
            shipment.estimated_delivery_dates.from
          ).toDateString()} to ${new Date(
            shipment.estimated_delivery_dates.to
          ).toDateString()}\n\nItems:\n- ${items}`
          break
        case "order_created":
          const { order: orderCreated } = data

          // TODO: ADD STORE NAME
          message = `Your order has been created! 🎉\n\nOrder ${
            orderCreated.external_id
          }\nCarrier: ${
            orderCreated.shipping
          }\nExtimated delivery date: ${new Date(
            orderCreated.estimated_fulfillment
          ).toDateString()}\n\nItems:\n- ${items}`
          break
        case "order_updated":
          const { order: orderUpdated } = data
          message = `Your order has been updated! 🎉\n\nOrder ${
            orderUpdated.external_id
          }\nStatus: ${orderUpdated.status}\nCarrier: ${
            orderUpdated.shipping
          }\nExtimated delivery date: ${new Date(
            orderUpdated.estimated_fulfillment
          ).toDateString()}\n\nItems:\n- ${items}`
          break
      }

      res.status(200).send("OK")
    }
  } catch (err) {
    console.log(err)
    res.status(500).send(err.message)
  }
}

export default handler
