import { CategoryVideoPage } from "@/components/category-video-page"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryVideoPage slug={params.slug} />
}
