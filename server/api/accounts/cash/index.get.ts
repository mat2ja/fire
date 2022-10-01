import type { Prisma } from '@prisma/client'
import { prisma } from '~/prisma'
import { useContextUserId, useTransactionDateRange } from '~~/composables/server'

// Get cash accounts, with transactions only from given month range
export default defineEventHandler((event) => {
  const userId = useContextUserId(event)
  const { dateQuery: date } = useTransactionDateRange(event)

  const paymentAccountArgs: Prisma.TransactionFindManyArgs = {
    where: {
      date,
    },
    orderBy: {
      date: 'desc',
    },
  }

  try {
    return prisma.cashAccount.findMany({
      include: {
        paymentFromAccount: paymentAccountArgs,
        paymentToAccount: paymentAccountArgs,
        account: true,
      },
      where: {
        account: {
          userId,
        },
      },
    })
  } catch (err) {
    console.error(err)
    sendInternalError(event, err)
  }
})
