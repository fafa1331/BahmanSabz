"use client"

/**
 * Game Detail Page
 *
 * Displays comprehensive game information:
 * - Hero image with gradient overlay
 * - Screenshots gallery with carousel
 * - Rating breakdown with progress bars
 * - Platforms, developers, publishers, tags
 *
 * Data fetching via React Query for caching & deduplication.
 */

import { useState } from "react"
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
  Icon,
} from "@chakra-ui/react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import {
  FiArrowLeft,
  FiStar,
  FiCalendar,
  FiGlobe,
  FiMonitor,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { useGameById, useGameScreenshots } from "@/lib/hooks/useGames"

export default function GameDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [currentScreenshot, setCurrentScreenshot] = useState(0)

  // ---- React Query hooks ----
  const {
    data: game,
    isLoading,
    error,
  } = useGameById(id)

  const { data: screenshotsData } = useGameScreenshots(id)
  const screenshots = screenshotsData?.results ?? []

  // ---- Loading State ----
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

  // ---- Error State ----
  if (error || !game) {
    return (
      <DashboardLayout>
        <Container maxW="7xl" py={8}>
          <Stack gap={4} alignItems="center" py={20}>
            <Text color="red.500" fontSize="lg">
              {error instanceof Error ? error.message : "Game not found"}
            </Text>
            <Link href="/games">
              <Button variant="outline">
                <FiArrowLeft /> Back to Games
              </Button>
            </Link>
          </Stack>
        </Container>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <Box position="relative" h={{ base: "250px", md: "400px" }} overflow="hidden">
        <Image
          src={game.background_image || "/globe.svg"}
          alt={game.name}
          w="full"
          h="full"
          objectFit="cover"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="to-t"
          gradientFrom="blackAlpha.800"
          gradientTo="transparent"
        />
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={{ base: 4, md: 8 }}
        >
          <Container maxW="7xl">
            <Link href="/games">
              <Button variant="ghost" color="white" size="sm" mb={4}>
                <FiArrowLeft /> Back to Games
              </Button>
            </Link>
            <Heading color="white" size={{ base: "xl", md: "3xl" }}>
              {game.name}
            </Heading>
            <HStack mt={2} flexWrap="wrap" gap={2}>
              {game.genres.map((genre) => (
                <Badge key={genre.id} colorPalette="teal" size="sm">
                  {genre.name}
                </Badge>
              ))}
            </HStack>
          </Container>
        </Box>
      </Box>

      <Container maxW="7xl" py={8}>
        <Stack gap={8}>
          {/* Rating & Meta Bar */}
          <Grid
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            }}
            gap={4}
          >
            <Card.Root>
              <Card.Body textAlign="center">
                <HStack justifyContent="center" color="yellow.400" mb={1}>
                  <Icon fontSize="xl">
                    <FiStar />
                  </Icon>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold">
                  {game.rating.toFixed(1)}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Rating
                </Text>
              </Card.Body>
            </Card.Root>

            {game.metacritic && (
              <Card.Root>
                <Card.Body textAlign="center">
                  <Box
                    display="inline-flex"
                    px={2}
                    py={1}
                    borderRadius="md"
                    bg={
                      game.metacritic >= 75
                        ? "green.100"
                        : game.metacritic >= 50
                        ? "yellow.100"
                        : "red.100"
                    }
                    _dark={{
                      bg:
                        game.metacritic >= 75
                          ? "green.900"
                          : game.metacritic >= 50
                          ? "yellow.900"
                          : "red.900",
                    }}
                    mb={1}
                  >
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color={
                        game.metacritic >= 75
                          ? "green.600"
                          : game.metacritic >= 50
                          ? "yellow.600"
                          : "red.600"
                      }
                    >
                      {game.metacritic}
                    </Text>
                  </Box>
                  <Text fontSize="sm" color="gray.500">
                    Metacritic
                  </Text>
                </Card.Body>
              </Card.Root>
            )}

            <Card.Root>
              <Card.Body textAlign="center">
                <HStack justifyContent="center" color="teal.500" mb={1}>
                  <Icon fontSize="xl">
                    <FiCalendar />
                  </Icon>
                </HStack>
                <Text fontSize="md" fontWeight="bold">
                  {game.released || "TBA"}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Release Date
                </Text>
              </Card.Body>
            </Card.Root>

            <Card.Root>
              <Card.Body textAlign="center">
                <HStack justifyContent="center" color="purple.500" mb={1}>
                  <Icon fontSize="xl">
                    <FiMonitor />
                  </Icon>
                </HStack>
                <Text fontSize="md" fontWeight="bold">
                  {game.playtime}h
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Avg Playtime
                </Text>
              </Card.Body>
            </Card.Root>
          </Grid>

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <Card.Root overflow="hidden">
              <Card.Header>
                <Heading size="lg">Screenshots</Heading>
              </Card.Header>
              <Card.Body>
                <Box position="relative">
                  <Image
                    src={screenshots[currentScreenshot]?.image}
                    alt={`Screenshot ${currentScreenshot + 1}`}
                    w="full"
                    h={{ base: "200px", md: "400px" }}
                    objectFit="cover"
                    borderRadius="lg"
                  />
                  {screenshots.length > 1 && (
                    <>
                      <Button
                        position="absolute"
                        left={2}
                        top="50%"
                        transform="translateY(-50%)"
                        size="sm"
                        variant="solid"
                        onClick={() =>
                          setCurrentScreenshot((c) =>
                            c === 0 ? screenshots.length - 1 : c - 1
                          )
                        }
                      >
                        <FiChevronLeft />
                      </Button>
                      <Button
                        position="absolute"
                        right={2}
                        top="50%"
                        transform="translateY(-50%)"
                        size="sm"
                        variant="solid"
                        onClick={() =>
                          setCurrentScreenshot((c) =>
                            c === screenshots.length - 1 ? 0 : c + 1
                          )
                        }
                      >
                        <FiChevronRight />
                      </Button>
                    </>
                  )}
                </Box>
                <HStack gap={2} mt={3} overflowX="auto">
                  {screenshots.map((ss, idx) => (
                    <Box
                      key={ss.id}
                      flexShrink={0}
                      cursor="pointer"
                      borderWidth="2px"
                      borderColor={
                        currentScreenshot === idx ? "teal.500" : "transparent"
                      }
                      borderRadius="md"
                      overflow="hidden"
                      onClick={() => setCurrentScreenshot(idx)}
                    >
                      <Image
                        src={ss.image}
                        alt={`Screenshot ${idx + 1}`}
                        boxSize="80px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </HStack>
              </Card.Body>
            </Card.Root>
          )}

          {/* Main Content Grid */}
          <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
            {/* Description */}
            <Card.Root>
              <Card.Header>
                <Heading size="lg">About</Heading>
              </Card.Header>
              <Card.Body>
                <Box
                  color="gray.700"
                  _dark={{ color: "gray.300" }}
                  lineHeight="tall"
                  dangerouslySetInnerHTML={{ __html: game.description }}
                />
              </Card.Body>
            </Card.Root>

            {/* Side Info */}
            <Stack gap={4}>
              {/* Platforms */}
              <Card.Root>
                <Card.Header py={3}>
                  <HStack>
                    <Icon color="teal.500">
                      <FiMonitor />
                    </Icon>
                    <Heading size="sm">Platforms</Heading>
                  </HStack>
                </Card.Header>
                <Card.Body py={2}>
                  <HStack gap={2} flexWrap="wrap">
                    {game.platforms.map((p) => (
                      <Badge key={p.platform.id} colorPalette="gray" size="sm">
                        {p.platform.name}
                      </Badge>
                    ))}
                  </HStack>
                </Card.Body>
              </Card.Root>

              {/* Developers */}
              {game.developers.length > 0 && (
                <Card.Root>
                  <Card.Header py={3}>
                    <HStack>
                      <Icon color="teal.500">
                        <FiUser />
                      </Icon>
                      <Heading size="sm">Developers</Heading>
                    </HStack>
                  </Card.Header>
                  <Card.Body py={2}>
                    <Stack gap={1}>
                      {game.developers.map((dev) => (
                        <Text key={dev.id} fontSize="sm">
                          {dev.name}
                        </Text>
                      ))}
                    </Stack>
                  </Card.Body>
                </Card.Root>
              )}

              {/* Publishers */}
              {game.publishers.length > 0 && (
                <Card.Root>
                  <Card.Header py={3}>
                    <HStack>
                      <Icon color="teal.500">
                        <FiGlobe />
                      </Icon>
                      <Heading size="sm">Publishers</Heading>
                    </HStack>
                  </Card.Header>
                  <Card.Body py={2}>
                    <Stack gap={1}>
                      {game.publishers.map((pub) => (
                        <Text key={pub.id} fontSize="sm">
                          {pub.name}
                        </Text>
                      ))}
                    </Stack>
                  </Card.Body>
                </Card.Root>
              )}

              {/* ESRB Rating */}
              {game.esrb_rating && (
                <Card.Root>
                  <Card.Header py={3}>
                    <Heading size="sm">ESRB Rating</Heading>
                  </Card.Header>
                  <Card.Body py={2}>
                    <Badge colorPalette="purple" size="lg">
                      {game.esrb_rating.name}
                    </Badge>
                  </Card.Body>
                </Card.Root>
              )}

              {/* Tags */}
              {game.tags.length > 0 && (
                <Card.Root>
                  <Card.Header py={3}>
                    <Heading size="sm">Tags</Heading>
                  </Card.Header>
                  <Card.Body py={2}>
                    <HStack gap={1} flexWrap="wrap">
                      {game.tags.slice(0, 15).map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="outline"
                          size="sm"
                          fontSize="xs"
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </HStack>
                  </Card.Body>
                </Card.Root>
              )}

              {/* Website */}
              {game.website && (
                <Card.Root>
                  <Card.Header py={3}>
                    <Heading size="sm">Website</Heading>
                  </Card.Header>
                  <Card.Body py={2}>
                    <a
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text
                        color="teal.500"
                        fontSize="sm"
                        _hover={{ textDecoration: "underline" }}
                      >
                        {game.website}
                      </Text>
                    </a>
                  </Card.Body>
                </Card.Root>
              )}
            </Stack>
          </Grid>

          {/* Rating Breakdown */}
          {game.ratings.length > 0 && (
            <Card.Root>
              <Card.Header>
                <Heading size="lg">Rating Breakdown</Heading>
              </Card.Header>
              <Card.Body>
                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: `repeat(${game.ratings.length}, 1fr)`,
                  }}
                  gap={4}
                >
                  {game.ratings.map((r) => (
                    <Box key={r.id} textAlign="center">
                      <Text
                        fontSize="2xl"
                        fontWeight="bold"
                        textTransform="capitalize"
                      >
                        {r.title}
                      </Text>
                      <Box
                        w="full"
                        h={2}
                        bg="gray.200"
                        _dark={{ bg: "gray.700" }}
                        borderRadius="full"
                        mt={2}
                      >
                        <Box
                          h="full"
                          bg={
                            r.title === "exceptional"
                              ? "green.400"
                              : r.title === "recommended"
                              ? "blue.400"
                              : r.title === "meh"
                              ? "yellow.400"
                              : "red.400"
                          }
                          borderRadius="full"
                          w={`${r.percent}%`}
                        />
                      </Box>
                      <Text fontSize="sm" color="gray.500" mt={1}>
                        {r.count} votes ({r.percent.toFixed(1)}%)
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Card.Body>
            </Card.Root>
          )}
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
