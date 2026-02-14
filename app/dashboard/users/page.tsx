"use client"

/**
 * Dashboard Users Page (table view)
 *
 * Displays users in a table format with pagination.
 * Uses React Query via the shared users hook.
 */

import { useState } from "react"
import {
  Spinner,
  Center,
  Button,
  HStack,
  Text,
  Table,
  Image,
} from "@chakra-ui/react"
import { useUsers } from "@/lib/hooks/useUsers"

export default function UsersPage() {
  const [page, setPage] = useState(0)
  const limit = 10

  const { data, isLoading, isError } = useUsers({ page, limit })

  if (isLoading)
    return (
      <Center mt={20}>
        <Spinner size="xl" />
      </Center>
    )

  if (isError)
    return (
      <Center mt={20}>
        <Text color="red.500">Failed to load users</Text>
      </Center>
    )

  if (!data)
    return (
      <Center mt={20}>
        <Text>No users found</Text>
      </Center>
    )

  const totalPages = Math.ceil(data.total / limit)

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>User</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Age</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.users.map((user) => (
            <Table.Row key={user.id}>
              <Table.Cell>
                <HStack>
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    boxSize="32px"
                    borderRadius="full"
                    objectFit="cover"
                  />
                  <Text>
                    {user.firstName} {user.lastName}
                  </Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>{user.email}</Table.Cell>
              <Table.Cell>{user.age}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Center mt={4}>
        <HStack>
          <Button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={page === 0}
          >
            Prev
          </Button>
          <Text>
            Page {page + 1} of {totalPages}
          </Text>
          <Button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </HStack>
      </Center>
    </>
  )
}
