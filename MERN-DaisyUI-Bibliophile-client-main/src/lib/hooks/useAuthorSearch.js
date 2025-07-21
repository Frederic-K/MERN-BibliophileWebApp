import { useState, useEffect } from "react"
import { useDebounce } from "./useDebounce"
import axios from "axios"
import { toast } from "react-toastify"

export default function useAuthorSearch(authorSearch, authorSelected) {
  const [authorSuggestions, setAuthorSuggestions] = useState([])
  const [isLoadingAuthors, setIsLoadingAuthors] = useState(false)
  const debouncedAuthorSearch = useDebounce(authorSearch, 300)

  useEffect(() => {
    const searchAuthors = async () => {
      if (debouncedAuthorSearch && debouncedAuthorSearch.length >= 3 && !authorSelected) {
        setIsLoadingAuthors(true)
        try {
          const response = await axios.get(
            `/api/search?searchType=authors&searchTerm=${debouncedAuthorSearch}&limit=10`
          )
          setAuthorSuggestions(response.data.authors)
        } catch (error) {
          console.error("Error searching authors:", error)
          toast.error("Failed to search authors. Please try again.")
        } finally {
          setIsLoadingAuthors(false)
        }
      } else {
        setAuthorSuggestions([])
      }
    }

    searchAuthors()
  }, [debouncedAuthorSearch, authorSelected])

  return { authorSuggestions, isLoadingAuthors }
}