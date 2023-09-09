import Editor from '@/components/Editor'
import getUserByClerkID from '@/utils/auth'
import { prisma } from '@/utils/db'

async function getEntry(id) {
  const user = await getUserByClerkID()

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })
  return entry
}
export default async function EntryPage({ params }) {
  const entry = await getEntry(params.id)

  return (
    // h-full w-full
    <div className="h-full w-full">
      <Editor entry={entry} />
    </div>
  )
}
