import { SearchResults } from "@/components/search-results"

interface SearchPageProps {
  searchParams: {
    q?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ""

  return <SearchResults query={query} />
}
