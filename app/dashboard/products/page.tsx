"use client";

/**
 * Dashboard Products Page (table view)
 *
 * Displays products in a table format with pagination.
 * Uses React Query via the shared products hook.
 */

import { useState } from "react";
import {
  Center,
  Button,
  HStack,
  Text,
  Image,
  Table,
  SimpleGrid,
  Skeleton,
} from "@chakra-ui/react";
import { useProductsList } from "@/lib/hooks/useProducts";

export default function ProductsPage() {
  const [page, setPage] = useState(0);
  const limit = 10;

  const { data, isLoading, isError } = useProductsList({ page, limit });

  if (isLoading)
    return (
      <SimpleGrid columns={[1, 2, 3, 4]} gap={6} p={6}>
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} height="280px" borderRadius="lg" />
        ))}
      </SimpleGrid>
    );

  if (isError)
    return (
      <Center mt={20}>
        <Text color="red.500">Failed to load products</Text>
      </Center>
    );

  if (!data)
    return (
      <Center mt={20}>
        <Text>No products found</Text>
      </Center>
    );

  const totalPages = Math.ceil(data.total / limit);

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Product</Table.ColumnHeader>
            <Table.ColumnHeader>Category</Table.ColumnHeader>
            <Table.ColumnHeader>Price</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {data.products.map((product) => (
            <Table.Row key={product.id}>
              <Table.Cell>
                <HStack>
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    boxSize="50px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <Text>{product.title}</Text>
                </HStack>
              </Table.Cell>
              <Table.Cell>{product.category}</Table.Cell>
              <Table.Cell>${product.price}</Table.Cell>
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
  );
}
