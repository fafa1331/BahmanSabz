"use client"

/**
 * Products List Page
 *
 * Displays products from DummyJSON with:
 * - Category filtering
 * - Search with instant results
 * - Sort by name/price/rating
 * - Grid/List view toggle
 * - Pagination
 *
 * All data fetching uses React Query for caching & deduplication.
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
  FiStar,
  FiGrid,
  FiList,
} from "react-icons/fi"
import { useProductsList, useCategories } from "@/lib/hooks/useProducts"

const LIMIT = 12

export default function ProductsPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("title")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // ---- React Query ----
  const { data, isLoading, isFetching } = useProductsList({
    page,
    limit: LIMIT,
    search,
    category: selectedCategory,
    sortBy,
    order: sortOrder,
  })

  const { data: categories = [] } = useCategories()

  const products = data?.products ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / LIMIT)

  // ---- Handlers ----
  const handleSearch = (value: string) => {
    setSearch(value)
    setSelectedCategory("")
    setPage(0)
  }

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat === selectedCategory ? "" : cat)
    setSearch("")
    setPage(0)
  }

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"))
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
    setPage(0)
  }

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={6}>
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2}>
              Products
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Browse {total} products from the catalog
            </Text>
          </Box>

          {/* Search & Controls */}
          <Stack
            direction={{ base: "column", md: "row" }}
            gap={4}
            alignItems={{ md: "center" }}
          >
            <Box position="relative" flex={1} maxW={{ md: "md" }}>
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
                placeholder="Search products..."
                pl={10}
                size="lg"
                bg="white"
                _dark={{ bg: "gray.800" }}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Box>

            <HStack gap={2}>
              {/* Sort Buttons */}
              {[
                { field: "title", label: "Name" },
                { field: "price", label: "Price" },
                { field: "rating", label: "Rating" },
              ].map((s) => (
                <Button
                  key={s.field}
                  size="sm"
                  variant={sortBy === s.field ? "solid" : "outline"}
                  colorPalette={sortBy === s.field ? "teal" : "gray"}
                  onClick={() => handleSort(s.field)}
                >
                  {s.label}{" "}
                  {sortBy === s.field && (sortOrder === "asc" ? "↑" : "↓")}
                </Button>
              ))}

              {/* View Toggle */}
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  setViewMode(viewMode === "grid" ? "list" : "grid")
                }
              >
                <Icon>
                  {viewMode === "grid" ? <FiList /> : <FiGrid />}
                </Icon>
              </Button>
            </HStack>
          </Stack>

          {/* Categories */}
          <HStack gap={2} flexWrap="wrap">
            <Button
              size="xs"
              variant={selectedCategory === "" ? "solid" : "outline"}
              colorPalette={selectedCategory === "" ? "teal" : "gray"}
              onClick={() => handleCategoryChange("")}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.slug}
                size="xs"
                variant={selectedCategory === cat.slug ? "solid" : "outline"}
                colorPalette={selectedCategory === cat.slug ? "teal" : "gray"}
                onClick={() => handleCategoryChange(cat.slug)}
              >
                {cat.name}
              </Button>
            ))}
          </HStack>

          {/* Products Grid/List */}
          {isLoading ? (
            <Box display="flex" justifyContent="center" py={20}>
              <Spinner size="xl" color="teal.500" />
            </Box>
          ) : products.length === 0 ? (
            <Box textAlign="center" py={20}>
              <Text fontSize="lg" color="gray.500">
                No products found
              </Text>
            </Box>
          ) : (
            <>
              {isFetching && !isLoading && (
                <Box textAlign="right">
                  <Spinner size="sm" color="teal.500" />
                </Box>
              )}

              {viewMode === "grid" ? (
                <Grid
                  templateColumns={{
                    base: "repeat(1, 1fr)",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                    lg: "repeat(4, 1fr)",
                  }}
                  gap={6}
                >
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <Card.Root
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          transform: "translateY(-4px)",
                          shadow: "lg",
                        }}
                        overflow="hidden"
                        h="full"
                      >
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          h="180px"
                          w="full"
                          objectFit="cover"
                        />
                        <Card.Body>
                          <Stack gap={2}>
                            <Text fontWeight="bold" truncate>
                              {product.title}
                            </Text>
                            <Badge
                              colorPalette="gray"
                              size="sm"
                              w="fit-content"
                            >
                              {product.category}
                            </Badge>
                            <HStack justifyContent="space-between">
                              <Text
                                fontWeight="bold"
                                fontSize="xl"
                                color="teal.500"
                              >
                                ${product.price}
                              </Text>
                              <HStack fontSize="sm" color="yellow.500">
                                <Icon>
                                  <FiStar />
                                </Icon>
                                <Text>{product.rating.toFixed(1)}</Text>
                              </HStack>
                            </HStack>
                            {product.discountPercentage > 0 && (
                              <Badge
                                colorPalette="red"
                                size="sm"
                                w="fit-content"
                              >
                                -{product.discountPercentage.toFixed(0)}%
                              </Badge>
                            )}
                          </Stack>
                        </Card.Body>
                      </Card.Root>
                    </Link>
                  ))}
                </Grid>
              ) : (
                /* List View */
                <Stack gap={3}>
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <Card.Root
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{ shadow: "md" }}
                      >
                        <Card.Body>
                          <HStack gap={4}>
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              boxSize="80px"
                              objectFit="cover"
                              borderRadius="md"
                            />
                            <Box flex={1} minW={0}>
                              <Text fontWeight="bold">{product.title}</Text>
                              <Text
                                fontSize="sm"
                                color="gray.600"
                                _dark={{ color: "gray.400" }}
                                truncate
                              >
                                {product.description}
                              </Text>
                              <HStack mt={1}>
                                <Badge colorPalette="gray" size="sm">
                                  {product.category}
                                </Badge>
                                <Badge
                                  colorPalette={
                                    product.stock > 0 ? "green" : "red"
                                  }
                                  size="sm"
                                >
                                  {product.availabilityStatus}
                                </Badge>
                              </HStack>
                            </Box>
                            <Box textAlign="right">
                              <Text
                                fontWeight="bold"
                                fontSize="xl"
                                color="teal.500"
                              >
                                ${product.price}
                              </Text>
                              <HStack
                                fontSize="sm"
                                color="yellow.500"
                                justifyContent="flex-end"
                              >
                                <Icon>
                                  <FiStar />
                                </Icon>
                                <Text>{product.rating.toFixed(1)}</Text>
                              </HStack>
                            </Box>
                          </HStack>
                        </Card.Body>
                      </Card.Root>
                    </Link>
                  ))}
                </Stack>
              )}
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
                <FiChevronLeft /> Previous
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
                Next <FiChevronRight />
              </Button>
            </HStack>
          )}
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
