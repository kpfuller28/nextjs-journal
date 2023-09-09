import EntryCard from '@/components/EntryCard'
import { analyze } from '@/utils/ai'
import getUserByClerkID from '@/utils/auth'
import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export async function PATCH(request: Request, { params }) {
  const user = await getUserByClerkID()
  const { content } = await request.json()
  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId_id: {
        userId: user.id,
        id: params.id,
      },
    },
    data: {
      content,
    },
  })

  const analysis = await analyze(updatedEntry.content)
  const updated = await prisma.analysis.upsert({
    where: {
      entryId: updatedEntry.id,
    },
    create: {
      entryId: updatedEntry.id,
      ...analysis,
    },
    update: analysis,
  })

  return NextResponse.json({ data: { ...updatedEntry, analysis: updated } })
}