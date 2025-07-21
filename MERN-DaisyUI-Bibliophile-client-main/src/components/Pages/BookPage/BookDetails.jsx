import DetailsCollapse from "../../Shared/Collapses/DetailsCollapse"

function BookDetails() {
  return (
    <section className="flex w-80 flex-col gap-2">
      <div className="divider my-0 w-80"></div>
      <DetailsCollapse itemType="book" />
      <div className="divider my-0 w-80"></div>
    </section>
  )
}

export default BookDetails
