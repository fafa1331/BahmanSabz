"use client"

/**
 * Games List Page
 *
 * Displays games from RAWG API with:
 * - Genre & platform sidebar filters
 * - Search with debounce
 * - Sort ordering
 * - Paginated results
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
  FiCalendar,
} from "react-icons/fi"
import { useGames, useGenres, usePlatforms } from "@/lib/hooks/useGames"

const PAGE_SIZE = 12

const orderOptions = [
  { value: "-rating", label: "Top Rated" },
  { value: "-released", label: "Newest" },
  { value: "released", label: "Oldest" },
  { value: "-metacritic", label: "Metacritic" },
  { value: "name", label: "Name A-Z" },
  { value: "-added", label: "Popular" },
]

export default function GamesPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState("")
  const [ordering, setOrdering] = useState("-rating")

  // ---- React Query hooks ----
  const {
    data: gamesData,
    isLoading,
    isFetching,
  } = useGames({
    page,
    page_size: PAGE_SIZE,
    search: search || undefined,
    genres: selectedGenre || undefined,
    platforms: selectedPlatform || undefined,
    ordering: ordering || undefined,
  })

  const { data: genresData } = useGenres()
  const { data: platformsData } = usePlatforms()

  const games = gamesData?.results ?? []
  const count = gamesData?.count ?? 0
  const genres = genresData?.results ?? []
  const platforms = (platformsData?.results ?? []).slice(0, 15)
  const totalPages = Math.ceil(count / PAGE_SIZE)

  // ---- Handlers ----
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const handleGenreChange = (genreSlug: string) => {
    setSelectedGenre(genreSlug === selectedGenre ? "" : genreSlug)
    setPage(1)
  }

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId === selectedPlatform ? "" : platformId)
    setPage(1)
  }

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={6}>
          {/* Header */}
          <Box>
            <Heading size="2xl" mb={2}>
              Games
            </Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              Explore {count.toLocaleString()} games from RAWG database
            </Text>
          </Box>

          {/* Search */}
          <form onSubmit={handleSearchSubmit}>
            <HStack maxW="md">
              <Box position="relative" flex={1}>
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
                  placeholder="Search games..."
                  pl={10}
                  size="lg"
                  bg="white"
                  _dark={{ bg: "gray.800" }}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </Box>
              <Button type="submit" colorPalette="teal" size="lg">
                Search
              </Button>
            </HStack>
          </form>

          {/* Ordering */}
          <HStack gap={2} flexWrap="wrap">
            <Text fontSize="sm" fontWeight="medium" color="gray.500">
              Sort:
            </Text>
            {orderOptions.map((opt) => (
              <Button
                key={opt.value}
                size="xs"
                variant={ordering === opt.value ? "solid" : "outline"}
                colorPalette={ordering === opt.value ? "teal" : "gray"}
                onClick={() => {
                  setOrdering(opt.value)
                  setPage(1)
                }}
              >
                {opt.label}
              </Button>
            ))}
          </HStack>

          {/* Filters + Grid */}
          <Grid templateColumns={{ base: "1fr", md: "200px 1fr" }} gap={6}>
            {/* Sidebar Filters */}
            <Stack gap={4}>
              {/* Genres Filter */}
              <Card.Root>
                <Card.Header py={3}>
                  <Heading size="sm">Genres</Heading>
                </Card.Header>
                <Card.Body py={2} maxH="300px" overflowY="auto">
                  <Stack gap={1}>
                    {genres.map((genre) => (
                      <Box
                        key={genre.id}
                        px={3}
                        py={1.5}
                        borderRadius="md"
                        cursor="pointer"
                        bg={
                          selectedGenre === genre.slug
                            ? "teal.50"
                            : "transparent"
                        }
                        _dark={{
                          bg:
                            selectedGenre === genre.slug
                              ? "teal.900"
                              : "transparent",
                          color:
                            selectedGenre === genre.slug
                              ? "teal.300"
                              : undefined,
                        }}
                        color={
                          selectedGenre === genre.slug ? "teal.600" : undefined
                        }
                        _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                        onClick={() => handleGenreChange(genre.slug)}
                        fontSize="sm"
                        fontWeight={
                          selectedGenre === genre.slug ? "semibold" : "normal"
                        }
                      >
                        {genre.name}
                      </Box>
                    ))}
                  </Stack>
                </Card.Body>
              </Card.Root>

              {/* Platforms Filter */}
              <Card.Root>
                <Card.Header py={3}>
                  <Heading size="sm">Platforms</Heading>
                </Card.Header>
                <Card.Body py={2} maxH="300px" overflowY="auto">
                  <Stack gap={1}>
                    {platforms.map((platform) => (
                      <Box
                        key={platform.id}
                        px={3}
                        py={1.5}
                        borderRadius="md"
                        cursor="pointer"
                        bg={
                          selectedPlatform === String(platform.id)
                            ? "teal.50"
                            : "transparent"
                        }
                        _dark={{
                          bg:
                            selectedPlatform === String(platform.id)
                              ? "teal.900"
                              : "transparent",
                        }}
                        _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                        onClick={() =>
                          handlePlatformChange(String(platform.id))
                        }
                        fontSize="sm"
                        fontWeight={
                          selectedPlatform === String(platform.id)
                            ? "semibold"
                            : "normal"
                        }
                      >
                        {platform.name}
                      </Box>
                    ))}
                  </Stack>
                </Card.Body>
              </Card.Root>
            </Stack>

            {/* Games Grid */}
            <Box>
              {isLoading ? (
                <Box display="flex" justifyContent="center" py={20}>
                  <Spinner size="xl" color="teal.500" />
                </Box>
              ) : games.length === 0 ? (
                <Box textAlign="center" py={20}>
                  <Text fontSize="lg" color="gray.500">
                    No games found
                  </Text>
                </Box>
              ) : (
                <>
                  {/* Fetching indicator */}
                  {isFetching && !isLoading && (
                    <Box textAlign="right" mb={2}>
                      <Spinner size="sm" color="teal.500" />
                    </Box>
                  )}
                  <Grid
                    templateColumns={{
                      base: "repeat(1, 1fr)",
                      sm: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                  >
                    {games.map((game) => (
                      <Link key={game.id} href={`/games/${game.id}`}>
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
                          <Box position="relative">
                            <Image
                              src={game.background_image || "/globe.svg"}
                              alt={game.name}
                              h="180px"
                              w="full"
                              objectFit="cover"
                            />
                            {game.metacritic && (
                              <Badge
                                position="absolute"
                                top={2}
                                right={2}
                                colorPalette={
                                  game.metacritic >= 75
                                    ? "green"
                                    : game.metacritic >= 50
                                    ? "yellow"
                                    : "red"
                                }
                                fontSize="sm"
                                fontWeight="bold"
                              >
                                {game.metacritic}
                              </Badge>
                            )}
                          </Box>
                          <Card.Body>
                            <Stack gap={2}>
                              <Text
                                fontWeight="bold"
                                fontSize="md"
                                lineClamp={1}
                              >
                                {game.name}
                              </Text>

                              <HStack gap={2} flexWrap="wrap">
                                {game.genres.slice(0, 3).map((genre) => (
                                  <Badge
                                    key={genre.id}
                                    colorPalette="gray"
                                    size="sm"
                                  >
                                    {genre.name}
                                  </Badge>
                                ))}
                              </HStack>

                              <HStack
                                justifyContent="space-between"
                                fontSize="sm"
                              >
                                <HStack color="yellow.500">
                                  <Icon>
                                    <FiStar />
                                  </Icon>
                                  <Text fontWeight="medium">
                                    {game.rating.toFixed(1)}
                                  </Text>
                                </HStack>
                                {game.released && (
                                  <HStack color="gray.500">
                                    <Icon>
                                      <FiCalendar />
                                    </Icon>
                                    <Text>{game.released}</Text>
                                  </HStack>
                                )}
                              </HStack>

                              {/* Platform badges */}
                              <HStack gap={1} flexWrap="wrap">
                                {game.platforms?.slice(0, 4).map((p) => (
                                  <Badge
                                    key={p.platform.id}
                                    variant="outline"
                                    size="sm"
                                    fontSize="xs"
                                  >
                                    {p.platform.name}
                                  </Badge>
                                ))}
                                {game.platforms?.length > 4 && (
                                  <Badge
                                    variant="outline"
                                    size="sm"
                                    fontSize="xs"
                                  >
                                    +{game.platforms.length - 4}
                                  </Badge>
                                )}
                              </HStack>
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
                <HStack justifyContent="center" gap={4} pt={6}>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <FiChevronLeft /> Previous
                  </Button>
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    _dark={{ color: "gray.400" }}
                  >
                    Page {page} of {Math.min(totalPages, 500)}
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= Math.min(totalPages, 500)}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next <FiChevronRight />
                  </Button>
                </HStack>
              )}
            </Box>
          </Grid>
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
