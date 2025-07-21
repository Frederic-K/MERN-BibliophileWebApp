import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import axios from "axios"
import { useSearchStore } from "../../lib/store/searchStore"
import { useUserStore } from "../../lib/store/userStore"
import { toast } from "react-toastify"
import RatingField from "../Shared/FormField/RatingField"
import SearchFieldSection from "../Shared/FormField/SearchFieldSection"
import RadioButtonFieldGroup from "../Shared/FormField/RadioButtonFieldGroup"
import DatePickerField from "../Shared/FormField/DatePickerField"
import ResetButton from "../Shared/Buttons/ResetButton"
import ApplyButton from "../Shared/Buttons/ApplyButton"
import Loader from "../Shared/Loader/Loader"

const searchFormSchema = z.object({
  searchType: z.enum(["bookshelf"]),
  searchTerm: z.string().max(100, "Search term must be less than 100 characters").or(z.literal("")),
  sortBy: z.enum(["title", "author", "rating", "readStatus", "startReadDate", "endReadDate"]),
  sortOrder: z.enum(["asc", "desc"]),
  readStatus: z.enum(["All", "to-read", "reading", "read"]),
  minRating: z.enum(["All", "1", "2", "3", "4", "5"]),
  isFavorite: z.enum(["All", "true"]),
  format: z.enum(["All", "digital", "physical"]),
  availabilityStatus: z.enum(["All", "available", "unavailable", "reserved"]),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
})

function AdvancedSearchForm({ searchType }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isSearchLoading, setIsSearchLoading] = useState(false)

  // const currentUser = useUserStore((state) => state.currentUser)

  const setSearchResults = useSearchStore((state) => state.setSearchResults)
  const setSearchResultsPage = useSearchStore((state) => state.setSearchResultsPage)
  const setSearchTotalPages = useSearchStore((state) => state.setSearchTotalPages)
  const clearSearch = useSearchStore((state) => state.clearSearch)

  // const userId = currentUser?._id

  const {
    register: searchRegister,
    handleSubmit: handleSearchSubmit,
    formState: { errors: searchErrors },
    setValue: setSearchValue,
    reset: resetSearch,
    watch: watchSearch,
  } = useForm({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      searchType,
      searchTerm: "",
      sortBy: "title",
      sortOrder: "asc",
      readStatus: "All",
      minRating: "All",
      isFavorite: "All",
      format: "All",
      availabilityStatus: "All",
      startDate: "",
      endDate: "",
    },
  })

  const searchTerm = watchSearch("searchTerm")

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)

    if (queryParams.size > 0) {
      // Set form values based on URL parameters
      Object.entries(Object.fromEntries(queryParams)).forEach(([key, value]) => {
        setSearchValue(key, value)
      })

      performSearch(queryParams)
    } else {
      clearSearch()
    }
  }, [location.search])

  const performSearch = async (queryParams) => {
    setIsSearchLoading(true)
    try {
      const searchParams = new URLSearchParams(queryParams)

      // Set default limit to 5
      if (!searchParams.has("limit")) {
        searchParams.set("limit", "5")
      }

      const response = await axios.get(`/api/search?${searchParams.toString()}`)

      if (response.data.items.length === 0) {
        const searchTerm = searchParams.get("searchTerm")
        const message = searchTerm
          ? `No results found for "${searchTerm}".`
          : "No items found matching the current criteria."
        toast.info(message)
        setSearchResults([])
        setSearchResultsPage(1)
        setSearchTotalPages(0)
      } else {
        setSearchResults(response.data.items)
        setSearchResultsPage(response.data.currentPage)
        setSearchTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error("Error fetching reading dashboard:", error)
      toast.error("An error occurred while fetching data. Please try again.")
      setSearchResults(null)
    } finally {
      setIsSearchLoading(false)
    }
  }

  const onSearchSubmit = (data) => {
    const queryParams = new URLSearchParams()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== "All" && value !== "") {
        queryParams.set(key, value)
      }
    })
    navigate(`?${queryParams.toString()}`, { replace: true })
  }

  const handleSearchReset = () => {
    resetSearch()
    clearSearch()
    navigate(location.pathname, { replace: true })
  }

  if (isSearchLoading) {
    return <Loader />
  }

  return (
    <form onSubmit={handleSearchSubmit(onSearchSubmit)} className="my-2 flex w-80 flex-col">
      <SearchFieldSection
        register={searchRegister}
        errors={searchErrors}
        searchTerm={searchTerm}
        handleReset={handleSearchReset}
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
          <fieldset className="w-72">
            <RadioButtonFieldGroup
              label="searchBar.sortBy"
              name="sortBy"
              options={[
                { value: "title", label: "searchBar.sortTitle" },
                { value: "author", label: "searchBar.sortAuthor" },
                { value: "rating", label: "searchBar.sortRating" },
                { value: "readStatus", label: "searchBar.sortReadStatus" },
                { value: "startReadDate", label: "searchBar.sortStartDate" },
                { value: "endReadDate", label: "searchBar.sortEndDate" },
              ]}
              register={searchRegister}
            />

            <RadioButtonFieldGroup
              label="searchBar.sortOrder"
              name="sortOrder"
              options={[
                { value: "asc", label: "searchBar.ascending" },
                { value: "desc", label: "searchBar.descending" },
              ]}
              register={searchRegister}
            />
          </fieldset>

          <div className="divider mt-4 mb-3">{t("searchBar.filters")}</div>

          <RadioButtonFieldGroup
            label="searchBar.readStatus"
            name="readStatus"
            options={[
              { value: "All", label: "searchBar.all" },
              { value: "to-read", label: "searchBar.toRead" },
              { value: "reading", label: "searchBar.reading" },
              { value: "read", label: "searchBar.read" },
            ]}
            register={searchRegister}
          />

          <RatingField register={searchRegister} name="minRating" className="mt-4" />

          <RadioButtonFieldGroup
            label="searchBar.isFavorite"
            name="isFavorite"
            options={[
              { value: "All", label: "searchBar.all" },
              { value: "true", label: "searchBar.favorite" },
            ]}
            register={searchRegister}
          />

          <RadioButtonFieldGroup
            label="searchBar.format"
            name="format"
            options={[
              { value: "All", label: "searchBar.all" },
              { value: "physical", label: "searchBar.physical" },
              { value: "digital", label: "searchBar.digital" },
            ]}
            register={searchRegister}
          />

          <RadioButtonFieldGroup
            label="searchBar.availabilityStatus"
            name="availabilityStatus"
            options={[
              { value: "All", label: "searchBar.all" },
              { value: "available", label: "searchBar.available" },
              { value: "unavailable", label: "searchBar.unavailable" },
              { value: "reserved", label: "searchBar.reserved" },
            ]}
            register={searchRegister}
          />

          <p className="mt-3 mb-2 font-medium">{t("searchBar.dateRange")}</p>
          <div className="flex flex-col gap-2">
            <DatePickerField
              label="searchBar.startDate"
              name="startDate"
              register={searchRegister}
            />
            <DatePickerField label="searchBar.endDate" name="endDate" register={searchRegister} />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <ResetButton onClick={handleSearchReset} />
            <ApplyButton />
          </div>
        </div>
      </section>
    </form>
  )
}

export default AdvancedSearchForm
