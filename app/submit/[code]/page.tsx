import SubmitForm from './submit-form'

interface PageProps {
  params: Promise<{ code: string }>
}

export default async function SubmitPage({ params }: PageProps) {
  const { code } = await params
  return <SubmitForm code={code} />
} 