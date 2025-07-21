import { useCurrentAuthorStore } from "../../../lib/store/currentAuthorStore"

const AuthorInfo = () => {
  const currentAuthor = useCurrentAuthorStore((state) => state.currentAuthor)

  return (
    <div className="flex flex-1 flex-col items-start justify-center">
      <h1 className="text-2xl font-bold">
        {currentAuthor.lastName}, {currentAuthor.firstName}
      </h1>
      <h2>
        <span>
          {currentAuthor.birthDate && `(${currentAuthor.birthDate}`}
          {currentAuthor.birthDate && currentAuthor.deathDate && " - "}
          {currentAuthor.deathDate && `${currentAuthor.deathDate})`}
        </span>
      </h2>
    </div>
  )
}

export default AuthorInfo
