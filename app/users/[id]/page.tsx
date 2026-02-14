"use client"

/**
 * User Detail Page
 *
 * Displays comprehensive profile info for a single user.
 * Uses React Query for data fetching with caching.
 */

import { useParams } from "next/navigation"
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Card,
  Stack,
  HStack,
  Image,
  Badge,
  Spinner,
  Button,
  Separator,
  Icon,
} from "@chakra-ui/react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiGlobe,
  FiCreditCard,
} from "react-icons/fi"
import { useUserById } from "@/lib/hooks/useUsers"

export default function UserDetailPage() {
  const params = useParams()
  const id = Number(params.id)

  // ---- React Query ----
  const { data: user, isLoading, error } = useUserById(id)

  if (isLoading) {
    return (
      <DashboardLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minH="60vh"
        >
          <Spinner size="xl" color="teal.500" />
        </Box>
      </DashboardLayout>
    )
  }

  if (error || !user) {
    return (
      <DashboardLayout>
        <Container maxW="7xl" py={8}>
          <Stack gap={4} alignItems="center" py={20}>
            <Text color="red.500" fontSize="lg">
              {error instanceof Error ? error.message : "User not found"}
            </Text>
            <Link href="/users">
              <Button variant="outline">
                <FiArrowLeft /> Back to Users
              </Button>
            </Link>
          </Stack>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={6}>
          {/* Back Button */}
          <Link href="/users">
            <Button variant="ghost" size="sm">
              <FiArrowLeft /> Back to Users
            </Button>
          </Link>

          {/* Profile Header */}
          <Card.Root>
            <Card.Body>
              <Stack
                direction={{ base: "column", md: "row" }}
                gap={6}
                alignItems={{ base: "center", md: "flex-start" }}
              >
                <Image
                  src={user.image}
                  alt={`${user.firstName} ${user.lastName}`}
                  boxSize="120px"
                  borderRadius="full"
                  objectFit="cover"
                />
                <Box flex={1} textAlign={{ base: "center", md: "left" }}>
                  <Heading size="xl">
                    {user.firstName} {user.lastName}
                  </Heading>
                  <Text
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                    mt={1}
                  >
                    @{user.username}
                  </Text>
                  <HStack
                    mt={2}
                    flexWrap="wrap"
                    justifyContent={{ base: "center", md: "flex-start" }}
                  >
                    <Badge colorPalette="teal">{user.role || "user"}</Badge>
                    <Badge colorPalette="blue">{user.gender}</Badge>
                    <Badge colorPalette="purple">Age: {user.age}</Badge>
                  </HStack>
                  <HStack
                    mt={3}
                    gap={4}
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                    fontSize="sm"
                    flexWrap="wrap"
                    justifyContent={{ base: "center", md: "flex-start" }}
                  >
                    <HStack>
                      <Icon>
                        <FiMail />
                      </Icon>
                      <Text>{user.email}</Text>
                    </HStack>
                    <HStack>
                      <Icon>
                        <FiPhone />
                      </Icon>
                      <Text>{user.phone}</Text>
                    </HStack>
                  </HStack>
                </Box>
              </Stack>
            </Card.Body>
          </Card.Root>

          {/* Details Grid */}
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {/* Address */}
            <Card.Root>
              <Card.Header>
                <HStack>
                  <Icon color="teal.500">
                    <FiMapPin />
                  </Icon>
                  <Heading size="md">Address</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={2} fontSize="sm">
                  <Text>{user.address.address}</Text>
                  <Text>
                    {user.address.city}, {user.address.state}{" "}
                    {user.address.postalCode}
                  </Text>
                  <Text color="gray.500">{user.address.country}</Text>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Company */}
            <Card.Root>
              <Card.Header>
                <HStack>
                  <Icon color="teal.500">
                    <FiBriefcase />
                  </Icon>
                  <Heading size="md">Company</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={2} fontSize="sm">
                  <Text fontWeight="semibold">{user.company.name}</Text>
                  <Text>{user.company.title}</Text>
                  <Text color="gray.500">{user.company.department}</Text>
                  <Separator />
                  <Text fontSize="xs" color="gray.500">
                    {user.company.address.address}, {user.company.address.city}
                  </Text>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Bank */}
            <Card.Root>
              <Card.Header>
                <HStack>
                  <Icon color="teal.500">
                    <FiCreditCard />
                  </Icon>
                  <Heading size="md">Banking</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={2} fontSize="sm">
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Card Type</Text>
                    <Text fontWeight="medium">{user.bank.cardType}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Card Number</Text>
                    <Text fontWeight="medium">
                      ****{user.bank.cardNumber.slice(-4)}
                    </Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Currency</Text>
                    <Text fontWeight="medium">{user.bank.currency}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Expires</Text>
                    <Text fontWeight="medium">{user.bank.cardExpire}</Text>
                  </HStack>
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Personal Info */}
            <Card.Root>
              <Card.Header>
                <HStack>
                  <Icon color="teal.500">
                    <FiGlobe />
                  </Icon>
                  <Heading size="md">Personal Info</Heading>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={2} fontSize="sm">
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Birth Date</Text>
                    <Text fontWeight="medium">{user.birthDate}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Blood Group</Text>
                    <Text fontWeight="medium">{user.bloodGroup}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Height</Text>
                    <Text fontWeight="medium">{user.height} cm</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Weight</Text>
                    <Text fontWeight="medium">{user.weight} kg</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">Eye Color</Text>
                    <Text fontWeight="medium">{user.eyeColor}</Text>
                  </HStack>
                  <HStack justifyContent="space-between">
                    <Text color="gray.500">University</Text>
                    <Text fontWeight="medium" truncate maxW="150px">
                      {user.university}
                    </Text>
                  </HStack>
                </Stack>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
