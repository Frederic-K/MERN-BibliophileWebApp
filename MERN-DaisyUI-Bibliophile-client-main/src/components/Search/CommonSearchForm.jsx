import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import clsx from "clsx"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useSearchStore } from "../../lib/store/searchStore"

// Components
import RadioButtonFieldGroup from "../Shared/FormField/RadioButtonFieldGroup"
import SearchFieldSection from "../Shared/FormField/SearchFieldSection"
import ResetButton from "../Shared/Buttons/ResetButton"
import ApplyButton from "../Shared/Buttons/ApplyButton"
import Loader from "../Shared/Loader/Loader"

function CommonSearchForm({ searchType }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const setSearchResults = useSearchStore((state) => state.setSearchResults)
  const setSearchResultsPage = useSearchStore((state) => state.setSearchResultsPage)
  const setSearchTotalPages = useSearchStore((state) => state.setSearchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)

  const searchTypeFields = {
    books: { param: "bookInfo", fields: "title" },
    authors: { param: "authorInfo", fields: "firstName+lastName" },
    users: { param: "userInfo", fields: "userName+email+profileImage+role" },
  }

  const searchFormSchema = z.object({
    searchType: z.enum(["books", "authors", "users"]),
    searchTerm: z
      .string()
      .max(100, "Search term must be less than 100 characters")
      .or(z.literal("")),
    sortBy: z.enum(["title", "author", "firstName", "lastName", "username", "email"]),
    sortOrder: z.enum(["asc", "desc"]),
  })

  const defaultSortByValues = {
    authors: "lastName",
    users: "username",
    books: "title",
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchType,
      searchTerm: "",
      sortBy: defaultSortByValues[searchType] || "title",
      sortOrder: "desc",
    },
  })

  const searchTerm = watch("searchTerm")

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    if (queryParams.size > 0) {
      Object.entries(Object.fromEntries(queryParams)).forEach(([key, value]) => {
        setValue(key, value)
      })
      performSearch(queryParams)
    } else {
      clearSearch()
    }
  }, [location.search])

  const performSearch = async (queryParams) => {
    try {
      setIsLoading(true)
      const searchParams = new URLSearchParams(queryParams)

      const searchType = searchParams.get("searchType")

      // Set default limit and add appropriate fields based on search type
      if (!searchParams.has("limit")) {
        searchParams.set("limit", "10")
      }

      // Add appropriate fields based on search type
      if (searchType && searchTypeFields[searchType]) {
        const { param, fields } = searchTypeFields[searchType]
        searchParams.set(param, fields)
      }

      const response = await axios.get(`/api/search?${searchParams.toString()}`)

      // Determine the results based on the search type
      const results = response.data[searchType] || []

      if (results.length === 0) {
        const searchTerm = searchParams.get("searchTerm")
        const message = searchTerm
          ? `No results found for "${searchTerm}".`
          : "No items found matching the current criteria."
        toast.info(message)
        setSearchResults([])
        setSearchResultsPage(1)
        setSearchTotalPages(0)
      } else {
        setSearchResults(results)
        setSearchResultsPage(response.data.currentPage)
        setSearchTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error("Error searching:", error)
      toast.error("An error occurred while searching. Please try again.")
      clearSearch()
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = (data) => {
    const queryParams = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "All" && value !== "") {
        queryParams.set(key, value)
      }
    })
    navigate(`?${queryParams.toString()}`, { replace: true })
  }

  const handleReset = () => {
    reset()
    clearSearch()
    setIsExpanded(false)
    navigate(location.pathname, { replace: true })
  }

  if (isLoading) {
    return <Loader />
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-2 flex w-80 flex-col">
      <SearchFieldSection
        register={register}
        errors={errors}
        searchTerm={searchTerm}
        handleReset={handleReset}
        setIsExpanded={setIsExpanded}
        isExpanded={isExpanded}
      />

      <section>
        <div
          className={clsx(
            "p-4",
            isExpanded ? "border-base-content/15 mt-4 block rounded-md border" : "hidden"
          )}
        >
          <div className="divider mt-0 mb-3">{t("searchBar.sorting")}</div>

          {searchType === "books" && (
            <>
              <RadioButtonFieldGroup
                label="searchBar.sortBy"
                name="sortBy"
                options={[
                  { value: "title", label: "searchBar.sortTitle" },
                  { value: "author", label: "searchBar.sortAuthor" },
                ]}
                register={register}
              />
              <RadioButtonFieldGroup
                label="searchBar.sortOrder"
                name="sortOrder"
                options={[
                  { value: "desc", label: "searchBar.descending" },
                  { value: "asc", label: "searchBar.ascending" },
                ]}
                register={register}
              />
            </>
          )}

          {searchType === "authors" && (
            <>
              <RadioButtonFieldGroup
                label="searchBar.sortBy"
                name="sortBy"
                options={[
                  { value: "lastName", label: "searchBar.sortLastName" },
                  { value: "firstName", label: "searchBar.sortFirstName" },
                ]}
                register={register}
              />
              <RadioButtonFieldGroup
                label="searchBar.sortOrder"
                name="sortOrder"
                options={[
                  { value: "desc", label: "searchBar.descending" },
                  { value: "asc", label: "searchBar.ascending" },
                ]}
                register={register}
              />
            </>
          )}

          {searchType === "users" && (
            <>
              <RadioButtonFieldGroup
                label="searchBar.sortBy"
                name="sortBy"
                options={[
                  { value: "username", label: "searchBar.sortUsername" },
                  { value: "email", label: "searchBar.sortEmail" },
                ]}
                register={register}
              />
              <RadioButtonFieldGroup
                label="searchBar.sortOrder"
                name="sortOrder"
                options={[
                  { value: "desc", label: "searchBar.descending" },
                  { value: "asc", label: "searchBar.ascending" },
                ]}
                register={register}
              />
            </>
          )}

          <div className="mt-4 flex justify-end gap-2">
            <ResetButton onClick={handleReset} />
            <ApplyButton />
          </div>
        </div>
      </section>
    </form>
  )
}

export default CommonSearchForm
