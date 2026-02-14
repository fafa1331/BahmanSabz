"use client"

import {
  Box,
  Flex,
  Stack,
  Text,
  Icon,
  HStack,
  Separator,
  Image,
} from "@chakra-ui/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiPackage,
  FiLogOut,
  FiLayers,
} from "react-icons/fi"
import { PiGameControllerBold } from "react-icons/pi"
import { useAuth } from "@/lib/auth-context"

interface SidebarProps {
  isOpen?: boolean
}

const menuItems = [
  { icon: FiHome, label: "Dashboard", href: "/" },
  { icon: FiUsers, label: "Users", href: "/users" },
  { icon: FiPackage, label: "Products", href: "/products" },
  { icon: PiGameControllerBold, label: "Games", href: "/games" },
]

/**
 * Sidebar Navigation
 * Shows main nav items and authenticated user info.
 */
export function Sidebar({ isOpen = true }: SidebarProps) {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <Box
      as="aside"
      w={{ base: isOpen ? "full" : "0", md: "64" }}
      h="100vh"
      bg="white"
      _dark={{ bg: "gray.800" }}
      borderRight="1px"
      borderColor="gray.200"
      position={{ base: "fixed", md: "sticky" }}
      top="0"
      left="0"
      overflowY="auto"
      transition="all 0.3s"
      zIndex={20}
      display={{ base: isOpen ? "block" : "none", md: "block" }}
    >
      <Flex direction="column" h="full">
        {/* Logo */}
        <Box p={6}>
          <Link href="/">
            <Text fontSize="2xl" fontWeight="bold" color="teal.500">
              BahmanSabz
            </Text>
          </Link>
        </Box>

        <Separator />

        {/* Navigation */}
        <Stack gap={1} p={4} flex={1}>
          {menuItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <HStack
                  px={4}
                  py={3}
                  borderRadius="lg"
                  cursor="pointer"
                  bg={isActive ? "teal.50" : "transparent"}
                  _dark={{
                    bg: isActive ? "teal.900" : "transparent",
                  }}
                  color={isActive ? "teal.600" : "gray.700"}
                  _hover={{
                    bg: isActive ? "teal.50" : "gray.50",
                    _dark: {
                      bg: isActive ? "teal.900" : "gray.700",
                    },
                  }}
                  transition="all 0.2s"
                >
                  <Icon fontSize="xl">
                    <item.icon />
                  </Icon>
                  <Text fontWeight={isActive ? "semibold" : "medium"}>
                    {item.label}
                  </Text>
                </HStack>
              </Link>
            )
          })}
        </Stack>

        <Separator />

        {/* User Profile */}
        <Box p={4}>
          {isAuthenticated && user ? (
            <Stack gap={3}>
              <HStack gap={3}>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                    w={10}
                    h={10}
                    borderRadius="full"
                    objectFit="cover"
                  />
                ) : (
                  <Box
                    w={10}
                    h={10}
                    borderRadius="full"
                    bg="teal.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontWeight="bold"
                  >
                    {user.firstName[0]}
                  </Box>
                )}
                <Box flex={1}>
                  <Text fontWeight="semibold" fontSize="sm">
                    {user.firstName} {user.lastName}
                  </Text>
                  <Text fontSize="xs" color="gray.600" _dark={{ color: "gray.400" }}>
                    {user.email}
                  </Text>
                </Box>
              </HStack>
              <HStack
                px={4}
                py={2}
                borderRadius="lg"
                cursor="pointer"
                color="red.500"
                _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
                transition="all 0.2s"
                onClick={logout}
              >
                <Icon fontSize="lg"><FiLogOut /></Icon>
                <Text fontWeight="medium" fontSize="sm">Sign Out</Text>
              </HStack>
            </Stack>
          ) : (
            <Link href="/login">
              <HStack
                px={4}
                py={3}
                borderRadius="lg"
                cursor="pointer"
                bg="teal.50"
                _dark={{ bg: "teal.900", color: "teal.300" }}
                color="teal.600"
                _hover={{ bg: "teal.100", _dark: { bg: "teal.800" } }}
                transition="all 0.2s"
              >
                <Icon fontSize="xl"><FiSettings /></Icon>
                <Text fontWeight="medium">Sign In</Text>
              </HStack>
            </Link>
          )}
        </Box>
      </Flex>
    </Box>
  )
}
