"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * Register Page
 * Creates a new user via DummyJSON /users/add endpoint.
 * Note: DummyJSON simulates the response - no real user is created.
 */
export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://dummyjson.com/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!res.ok) {
        throw new Error("Registration failed");
      }

      // Redirect to login after successful registration
      router.push("/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card.Root>
      <Card.Header>
        <Heading size="xl" textAlign="center" mb={2}>
          Create Account
        </Heading>
        <Text color="gray.600" _dark={{ color: "gray.400" }} textAlign="center">
          Sign up to get started
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
                _dark={{ bg: "red.900" }}
                color="red.600"
                fontSize="sm"
              >
                {error}
              </Box>
            )}

            <Stack direction={{ base: "column", sm: "row" }} gap={4}>
              <Field label="First Name" required>
                <Input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  size="lg"
                />
              </Field>

              <Field label="Last Name" required>
                <Input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  size="lg"
                />
              </Field>
            </Stack>

            <Field label="Email" required>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="lg"
              />
            </Field>

            <Field label="Password" required>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
              />
            </Field>

            <Field label="Confirm Password" required>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                size="lg"
              />
            </Field>

            <Button
              type="submit"
              colorPalette="teal"
              size="lg"
              width="full"
              loading={isLoading}
            >
              Create Account
            </Button>
          </Stack>
        </form>
      </Card.Body>

      <Card.Footer>
        <Box width="full" textAlign="center">
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            Already have an account?{" "}
            <ChakraLink asChild color="teal.500" fontWeight="medium">
              <Link href="/login">Sign in</Link>
            </ChakraLink>
          </Text>
        </Box>
      </Card.Footer>
    </Card.Root>
  );
}
