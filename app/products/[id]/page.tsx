"use client"

/**
 * Product Detail Page
 *
 * Displays full product information:
 * - Image gallery with thumbnail navigation
 * - Price with discount calculation
 * - Star ratings and reviews
 * - Shipping, warranty, return policy
 * - Specifications
 *
 * Uses React Query for data fetching with caching.
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
  Separator,
} from "@chakra-ui/react"
import Link from "next/link"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import {
  FiArrowLeft,
  FiStar,
  FiPackage,
  FiTruck,
  FiShield,
  FiRotateCcw,
} from "react-icons/fi"
import { useProductById } from "@/lib/hooks/useProducts"

export default function ProductDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const [selectedImage, setSelectedImage] = useState(0)

  // ---- React Query ----
  const { data: product, isLoading, error } = useProductById(id)

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

  if (error || !product) {
    return (
      <DashboardLayout>
        <Container maxW="7xl" py={8}>
          <Stack gap={4} alignItems="center" py={20}>
            <Text color="red.500" fontSize="lg">
              {error instanceof Error ? error.message : "Product not found"}
            </Text>
            <Link href="/products">
              <Button variant="outline">
                <FiArrowLeft /> Back to Products
              </Button>
            </Link>
          </Stack>
        </Container>
      </DashboardLayout>
    )
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100)

  return (
    <DashboardLayout>
      <Container maxW="7xl" py={8}>
        <Stack gap={6}>
          {/* Back Button */}
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <FiArrowLeft /> Back to Products
            </Button>
          </Link>

          {/* Main Content */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={8}>
            {/* Image Gallery */}
            <Stack gap={4}>
              <Box
                borderRadius="xl"
                overflow="hidden"
                bg="gray.100"
                _dark={{ bg: "gray.800" }}
              >
                <Image
                  src={product.images[selectedImage] || product.thumbnail}
                  alt={product.title}
                  w="full"
                  h="400px"
                  objectFit="contain"
                />
              </Box>
              {product.images.length > 1 && (
                <HStack gap={2} overflowX="auto">
                  {product.images.map((img, idx) => (
                    <Box
                      key={idx}
                      borderRadius="md"
                      overflow="hidden"
                      cursor="pointer"
                      borderWidth="2px"
                      borderColor={
                        selectedImage === idx ? "teal.500" : "transparent"
                      }
                      onClick={() => setSelectedImage(idx)}
                      flexShrink={0}
                    >
                      <Image
                        src={img}
                        alt={`${product.title} ${idx + 1}`}
                        boxSize="80px"
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                </HStack>
              )}
            </Stack>

            {/* Product Info */}
            <Stack gap={4}>
              <Box>
                <Badge colorPalette="gray" mb={2}>
                  {product.category}
                </Badge>
                <Heading size="2xl">{product.title}</Heading>
                {product.brand && (
                  <Text color="gray.500" fontSize="lg" mt={1}>
                    by {product.brand}
                  </Text>
                )}
              </Box>

              {/* Rating */}
              <HStack>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={i}
                    color={
                      i < Math.round(product.rating) ? "yellow.400" : "gray.300"
                    }
                    fontSize="xl"
                  >
                    <FiStar />
                  </Icon>
                ))}
                <Text fontWeight="medium">
                  {product.rating.toFixed(1)} ({product.reviews.length} reviews)
                </Text>
              </HStack>

              {/* Price */}
              <HStack gap={3} alignItems="baseline">
                <Text fontSize="3xl" fontWeight="bold" color="teal.500">
                  ${discountedPrice.toFixed(2)}
                </Text>
                {product.discountPercentage > 0 && (
                  <>
                    <Text
                      fontSize="xl"
                      color="gray.400"
                      textDecoration="line-through"
                    >
                      ${product.price}
                    </Text>
                    <Badge colorPalette="red">
                      -{product.discountPercentage.toFixed(0)}% OFF
                    </Badge>
                  </>
                )}
              </HStack>

              <Text
                color="gray.600"
                _dark={{ color: "gray.400" }}
                lineHeight="tall"
              >
                {product.description}
              </Text>

              <Separator />

              {/* Product Details */}
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <HStack>
                  <Icon color="teal.500">
                    <FiPackage />
                  </Icon>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Stock
                    </Text>
                    <Text fontWeight="medium">{product.stock} units</Text>
                  </Box>
                </HStack>
                <HStack>
                  <Icon color="teal.500">
                    <FiTruck />
                  </Icon>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Shipping
                    </Text>
                    <Text fontWeight="medium">
                      {product.shippingInformation}
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Icon color="teal.500">
                    <FiShield />
                  </Icon>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Warranty
                    </Text>
                    <Text fontWeight="medium">
                      {product.warrantyInformation}
                    </Text>
                  </Box>
                </HStack>
                <HStack>
                  <Icon color="teal.500">
                    <FiRotateCcw />
                  </Icon>
                  <Box>
                    <Text fontSize="xs" color="gray.500">
                      Return Policy
                    </Text>
                    <Text fontWeight="medium">{product.returnPolicy}</Text>
                  </Box>
                </HStack>
              </Grid>

              {/* Tags */}
              {product.tags.length > 0 && (
                <HStack gap={2} flexWrap="wrap">
                  {product.tags.map((tag) => (
                    <Badge
                      key={tag}
                      colorPalette="teal"
                      variant="outline"
                      size="sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </HStack>
              )}

              {/* Availability */}
              <Badge
                colorPalette={product.stock > 0 ? "green" : "red"}
                size="lg"
                w="fit-content"
              >
                {product.availabilityStatus}
              </Badge>
            </Stack>
          </Grid>

          {/* Reviews Section */}
          {product.reviews.length > 0 && (
            <Card.Root>
              <Card.Header>
                <Heading size="lg">
                  Customer Reviews ({product.reviews.length})
                </Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={4}>
                  {product.reviews.map((review, idx) => (
                    <Box
                      key={idx}
                      p={4}
                      borderRadius="lg"
                      bg="gray.50"
                      _dark={{ bg: "gray.800" }}
                    >
                      <HStack justifyContent="space-between" mb={2}>
                        <Box>
                          <Text fontWeight="semibold">
                            {review.reviewerName}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(review.date).toLocaleDateString()}
                          </Text>
                        </Box>
                        <HStack>
                          {Array.from({ length: 5 }, (_, i) => (
                            <Icon
                              key={i}
                              fontSize="sm"
                              color={
                                i < review.rating ? "yellow.400" : "gray.300"
                              }
                            >
                              <FiStar />
                            </Icon>
                          ))}
                        </HStack>
                      </HStack>
                      <Text color="gray.600" _dark={{ color: "gray.400" }}>
                        {review.comment}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          )}

          {/* Dimensions */}
          <Card.Root>
            <Card.Header>
              <Heading size="lg">Specifications</Heading>
            </Card.Header>
            <Card.Body>
              <Grid
                templateColumns={{
                  base: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                }}
                gap={4}
              >
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    SKU
                  </Text>
                  <Text fontWeight="medium">{product.sku}</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Weight
                  </Text>
                  <Text fontWeight="medium">{product.weight} g</Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Dimensions
                  </Text>
                  <Text fontWeight="medium">
                    {product.dimensions.width} × {product.dimensions.height} ×{" "}
                    {product.dimensions.depth} cm
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" color="gray.500">
                    Min Order Qty
                  </Text>
                  <Text fontWeight="medium">
                    {product.minimumOrderQuantity}
                  </Text>
                </Box>
              </Grid>
            </Card.Body>
          </Card.Root>
        </Stack>
      </Container>
    </DashboardLayout>
  )
}
