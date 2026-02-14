"use client";

/**
 * Dashboard Home Page
 *
 * Main landing page after login. Shows:
 * - Summary stats (users, products, carts, revenue)
 * - Recent users list
 * - Recent products grid
 * - Quick navigation links
 *
 * All data is fetched via React Query for caching & deduplication.
 */

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
  Icon,
  Separator,
} from "@chakra-ui/react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  FiUsers,
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiArrowRight,
  FiStar,
} from "react-icons/fi";
import { PiGameControllerBold } from "react-icons/pi";
import {
  useDashboardStats,
  useRecentUsers,
  useRecentProducts,
} from "@/lib/hooks/useDashboard";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: usersData } = useRecentUsers(5);
  const { data: productsData } = useRecentProducts(4);

  const recentUsers = usersData?.users ?? [];
  const recentProducts = productsData?.products ?? [];

  // Stats cards configuration
  const statCards = [
    {
      label: "Total Users",
      value: stats?.totalUsers?.toLocaleString() ?? "—",
      icon: FiUsers,
      color: "blue",
      href: "/users",
    },
    {
      label: "Total Products",
      value: stats?.totalProducts?.toLocaleString() ?? "—",
      icon: FiPackage,
      color: "green",
      href: "/products",
    },
    {
      label: "Total Carts",
      value: stats?.totalCarts?.toLocaleString() ?? "—",
      icon: FiShoppingCart,
      color: "orange",
      href: "#",
    },
    {
      label: "Total Revenue",
      value: stats
        ? `$${stats.totalRevenue.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}`
        : "—",
      icon: FiDollarSign,
      color: "teal",
      href: "#",
    },
  ];

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={8}>
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2}>
              Dashboard
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Welcome back! Here&apos;s an overview of your platform.
            </Text>
          </Box>

          {/* Stats Cards */}
          {statsLoading ? (
            <Box display="flex" justifyContent="center" py={10}>
              <Spinner size="xl" color="teal.500" />
            </Box>
          ) : (
            <Grid
              templateColumns={{
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                lg: "repeat(4, 1fr)",
              }}
              gap={6}
            >
              {statCards.map((stat) => (
                <Link key={stat.label} href={stat.href}>
                  <Card.Root
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{
                      transform: "translateY(-2px)",
                      shadow: "md",
                    }}
                  >
                    <Card.Body>
                      <HStack justifyContent="space-between">
                        <Stack gap={1}>
                          <Text
                            fontSize="sm"
                            color="gray.500"
                            fontWeight="medium"
                          >
                            {stat.label}
                          </Text>
                          <Text fontSize="2xl" fontWeight="bold">
                            {stat.value}
                          </Text>
                        </Stack>
                        <Box
                          p={3}
                          borderRadius="lg"
                          bg={`${stat.color}.50`}
                          _dark={{ bg: `${stat.color}.900` }}
                        >
                          <Icon fontSize="2xl" color={`${stat.color}.500`}>
                            <stat.icon />
                          </Icon>
                        </Box>
                      </HStack>
                    </Card.Body>
                  </Card.Root>
                </Link>
              ))}
            </Grid>
          )}

          {/* Quick Links */}
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
            <Link href="/games">
              <Card.Root
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ shadow: "md" }}
                bg="teal.50"
                _dark={{ bg: "teal.900" }}
              >
                <Card.Body>
                  <HStack justifyContent="space-between">
                    <HStack gap={3}>
                      <Icon fontSize="2xl" color="teal.500">
                        <PiGameControllerBold />
                      </Icon>
                      <Box>
                        <Text fontWeight="bold">Browse Games</Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Explore RAWG game database
                        </Text>
                      </Box>
                    </HStack>
                    <Icon color="teal.500">
                      <FiArrowRight />
                    </Icon>
                  </HStack>
                </Card.Body>
              </Card.Root>
            </Link>

            <Link href="/components">
              <Card.Root
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ shadow: "md" }}
                bg="purple.50"
                _dark={{ bg: "purple.900" }}
              >
                <Card.Body>
                  <HStack justifyContent="space-between">
                    <HStack gap={3}>
                      <Text fontSize="2xl">🧩</Text>
                      <Box>
                        <Text fontWeight="bold">Components</Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Advanced Select demo
                        </Text>
                      </Box>
                    </HStack>
                    <Icon color="purple.500">
                      <FiArrowRight />
                    </Icon>
                  </HStack>
                </Card.Body>
              </Card.Root>
            </Link>

            <Link href="/products">
              <Card.Root
                cursor="pointer"
                transition="all 0.2s"
                _hover={{ shadow: "md" }}
                bg="green.50"
                _dark={{ bg: "green.900" }}
              >
                <Card.Body>
                  <HStack justifyContent="space-between">
                    <HStack gap={3}>
                      <Icon fontSize="2xl" color="green.500">
                        <FiPackage />
                      </Icon>
                      <Box>
                        <Text fontWeight="bold">Products</Text>
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          _dark={{ color: "gray.400" }}
                        >
                          Browse product catalog
                        </Text>
                      </Box>
                    </HStack>
                    <Icon color="green.500">
                      <FiArrowRight />
                    </Icon>
                  </HStack>
                </Card.Body>
              </Card.Root>
            </Link>
          </Grid>

          {/* Content Grid */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
            {/* Recent Users */}
            <Card.Root>
              <Card.Header>
                <HStack justifyContent="space-between">
                  <Heading size="md">Recent Users</Heading>
                  <Link href="/users">
                    <Text
                      fontSize="sm"
                      color="teal.500"
                      fontWeight="medium"
                      _hover={{ textDecoration: "underline" }}
                    >
                      View all →
                    </Text>
                  </Link>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  {recentUsers.map((user, idx) => (
                    <Box key={user.id}>
                      <Link href={`/users/${user.id}`}>
                        <HStack
                          gap={3}
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{
                            bg: "gray.50",
                            _dark: { bg: "gray.700" },
                          }}
                          transition="all 0.2s"
                        >
                          <Image
                            src={user.image}
                            alt={`${user.firstName} ${user.lastName}`}
                            boxSize="40px"
                            borderRadius="full"
                            objectFit="cover"
                          />
                          <Box flex={1} minW={0}>
                            <Text fontWeight="semibold" fontSize="sm">
                              {user.firstName} {user.lastName}
                            </Text>
                            <Text fontSize="xs" color="gray.500" truncate>
                              {user.email}
                            </Text>
                          </Box>
                          <Badge colorPalette="teal" size="sm">
                            {user.role || "user"}
                          </Badge>
                        </HStack>
                      </Link>
                      {idx < recentUsers.length - 1 && <Separator mt={2} />}
                    </Box>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>

            {/* Recent Products */}
            <Card.Root>
              <Card.Header>
                <HStack justifyContent="space-between">
                  <Heading size="md">Recent Products</Heading>
                  <Link href="/products">
                    <Text
                      fontSize="sm"
                      color="teal.500"
                      fontWeight="medium"
                      _hover={{ textDecoration: "underline" }}
                    >
                      View all →
                    </Text>
                  </Link>
                </HStack>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  {recentProducts.map((product, idx) => (
                    <Box key={product.id}>
                      <Link href={`/products/${product.id}`}>
                        <HStack
                          gap={3}
                          p={2}
                          borderRadius="md"
                          cursor="pointer"
                          _hover={{
                            bg: "gray.50",
                            _dark: { bg: "gray.700" },
                          }}
                          transition="all 0.2s"
                        >
                          <Image
                            src={product.thumbnail}
                            alt={product.title}
                            boxSize="40px"
                            borderRadius="md"
                            objectFit="cover"
                          />
                          <Box flex={1} minW={0}>
                            <Text fontWeight="semibold" fontSize="sm" truncate>
                              {product.title}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {product.category}
                            </Text>
                          </Box>
                          <Box textAlign="right">
                            <Text
                              fontWeight="bold"
                              fontSize="sm"
                              color="teal.500"
                            >
                              ${product.price}
                            </Text>
                            <HStack
                              fontSize="xs"
                              color="yellow.500"
                              justifyContent="flex-end"
                            >
                              <Icon fontSize="xs">
                                <FiStar />
                              </Icon>
                              <Text>{product.rating.toFixed(1)}</Text>
                            </HStack>
                          </Box>
                        </HStack>
                      </Link>
                      {idx < recentProducts.length - 1 && <Separator mt={2} />}
                    </Box>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  );
}
