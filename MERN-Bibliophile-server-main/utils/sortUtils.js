export const getSortStage = (sortBy, sortOrder) => {
  const order = sortOrder === "desc" ? -1 : 1
  switch (sortBy) {
    case "title":
      return [{ $sort: { "bookDetails.title": order } }]
    case "author":
      return [{ $sort: { "authorDetails.lastName": order, "authorDetails.firstName": order } }]
    case "rating":
      return [{ $sort: { rating: order } }]
    case "readStatus":
      return [
        {
          $addFields: {
            readStatusOrder: {
              $switch: {
                branches: [
                  { case: { $eq: ["$readStatus", "reading"] }, then: 1 },
                  { case: { $eq: ["$readStatus", "to-read"] }, then: 2 },
                  { case: { $eq: ["$readStatus", "read"] }, then: 3 },
                ],
                default: 4,
              },
            },
          },
        },
        { $sort: { readStatusOrder: order } },
      ]
    case "startReadDate":
      return [{ $sort: { startReadDate: order } }]
    case "endReadDate":
      return [{ $sort: { endReadDate: order } }]
    default:
      return [{ $sort: { "bookDetails.title": 1 } }] // default sort
  }
}
