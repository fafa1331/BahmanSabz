"use client"

/**
 * Users List Page
 *
 * Displays a paginated, searchable grid of users from DummyJSON API.
 * Uses React Query for caching, deduplication, and background refetching.
 */

import { useState } from "react"
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Card,
  Stack,
  HStack,
  Input,
  Image,
  Badge,
  Spinner,
  Button,
  Icon,
} from "@chakra-ui/react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPhone,
} from "react-icons/fi"
import { useUsers } from "@/lib/hooks/useUsers"

const LIMIT = 12

export default function UsersPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")

  // ---- React Query ----
  const { data, isLoading, isFetching } = useUsers({ page, limit: LIMIT, search })

  const users = data?.users ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / LIMIT)

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(0)
  }

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={6}>
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2}>
              Users
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Browse and manage {total} users
            </Text>
          </Box>

          {/* Search */}
          <Box position="relative" maxW="md">
            <Box
              position="absolute"
              left={3}
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
              zIndex={1}
            >
              <FiSearch />
            </Box>
            <Input
              placeholder="Search users by name..."
              pl={10}
              size="lg"
              bg="white"
              _dark={{ bg: "gray.800" }}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Box>

          {/* Users Grid */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={20}>
              <Spinner size="xl" color="teal.500" />
            </Box>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Text fontSize="lg" color="gray.500">
                No users found
              </Text>
            </Box>
          ) : (
            <>
              {isFetching && !isLoading && (
                <Box textAlign="right">
                  <Spinner size="sm" color="teal.500" />
                </Box>
              )}
              <Grid
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                }}
                gap={6}
              >
                {users.map((user) => (
                  <Link key={user.id} href={`/users/${user.id}`}>
                    <Card.Root
                      cursor="pointer"
                      transition="all 0.2s"
                      _hover={{
                        transform: "translateY(-4px)",
                        shadow: "lg",
                      }}
                    >
                      <Card.Body>
                        <Stack gap={4} alignItems="center" textAlign="center">
                          <Image
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            boxSize="80px"
                            borderRadius="full"
                            objectFit="cover"
                          />
                          <Box>
                            <Text fontWeight="bold" fontSize="lg">
                              {user.firstName} {user.lastName}
                            </Text>
                            <Badge colorPalette="teal" size="sm" mt={1}>
                              {user.role || "user"}
                            </Badge>
                          </Box>
                          <Stack gap={1} width="full">
                            <HStack
                              fontSize="sm"
                              color="gray.600"
                              _dark={{ color: "gray.400" }}
                            >
                              <Icon>
                                <FiMail />
                              </Icon>
                              <Text truncate>{user.email}</Text>
                            </HStack>
                            <HStack
                              fontSize="sm"
                              color="gray.600"
                              _dark={{ color: "gray.400" }}
                            >
                              <Icon>
                                <FiPhone />
                              </Icon>
                              <Text>{user.phone}</Text>
                            </HStack>
                          </Stack>
                          <Text fontSize="xs" color="gray.500">
                            {user.company?.name} &bull;{" "}
                            {user.company?.department}
                          </Text>
                        </Stack>
                      </Card.Body>
                    </Card.Root>
                  </Link>
                ))}
              </Grid>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <HStack justifyContent="center" gap={4} pt={4}>
              <Button
                variant="outline"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                <FiChevronLeft />
                Previous
              </Button>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.400" }}
              >
                Page {page + 1} of {totalPages}
              </Text>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <FiChevronRight />
              </Button>
            </HStack>
          )}
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
