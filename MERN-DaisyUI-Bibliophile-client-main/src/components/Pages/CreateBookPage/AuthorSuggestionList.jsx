const AuthorSuggestionList = ({ authorSuggestions, onAuthorSelect }) => {
  return (
    <ul className="menu bg-base-200 rounded-box mt-1 w-full">
      {authorSuggestions.map((author) => (
        <li key={author._id}>
          <button type="button" onClick={() => onAuthorSelect(author)}>
            {author.lastName}, {author.firstName}
          </button>
        </li>
      ))}
    </ul>
  )
}

export default AuthorSuggestionList
