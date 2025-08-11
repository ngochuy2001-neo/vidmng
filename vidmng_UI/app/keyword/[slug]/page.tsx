import { KeywordDetailPage } from "@/components/keyword-detail-page"

interface KeywordPageProps {
  params: {
    slug: string
  }
}

export default function KeywordPage({ params }: KeywordPageProps) {
  return <KeywordDetailPage slug={params.slug} />
}