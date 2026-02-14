"use client"

import { useState } from "react"
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

/**
 * Login Page
 * Authenticates user via DummyJSON /auth/login endpoint.
 * Test credentials: username: "emilys", password: "emilyspass"
 */
export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading: authLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(username, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="xl" textAlign="center" mb={2}>
          Welcome Back
        </Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
          Sign in to your account
        </Text>
      </Card.Header>

      <Card.Body>
        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            {error && (
              <Box
                p={3}
                borderRadius="md"
                bg="red.50"
                _dark={{ bg: "red.900", color: "red.200" }}
                color="red.600"
                fontSize="sm"
              >
                {error}
              </Box>
            )}

            <Field label="Username" required>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                size="lg"
              />
            </Field>

            <Field label="Password" required>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
            </Field>

            <Button
              type="submit"
              colorPalette="teal"
              size="lg"
              width="full"
              loading={isLoading || authLoading}
            >
              Sign In
            </Button>

            <Box
              p={3}
              borderRadius="md"
              bg="gray.50"
              _dark={{ bg: "gray.800" }}
              fontSize="xs"
              color="gray.500"
            >
              <Text fontWeight="semibold" mb={1}>Test Credentials:</Text>
              <Text>Username: emilys</Text>
              <Text>Password: emilyspass</Text>
            </Box>
          </Stack>
        </form>
      </Card.Body>

      <Card.Footer>
        <Box width="full" textAlign="center">
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            Don&apos;t have an account?{" "}
            <ChakraLink asChild color="teal.500" fontWeight="medium">
              <Link href="/register">Sign up</Link>
            </ChakraLink>
          </Text>
        </Box>
      </Card.Footer>
    </Card.Root>
  )
}
