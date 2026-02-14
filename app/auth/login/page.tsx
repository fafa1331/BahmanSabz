"use client";

import { Button, Input, Stack, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuthStore, type User } from "@/app/stores/auth.store";
import { loginRequest } from "@/app/services/dummyjson";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAuthStore((s: { setUser: (u: User) => void }) => s.setUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending } = useMutation<User, Error, { username: string; password: string }>({
    mutationFn: async (credentials) => {
      const res = await loginRequest(credentials);
      return res.data as User;
    },
    onSuccess: (data) => {
      setUser(data);
      router.push("/dashboard");
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack maxW="400px" mx="auto" mt="100px" wordSpacing={4}>
        <Heading size="lg">Login</Heading>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" colorScheme="teal" loading={isPending}>
          Login
        </Button>
      </Stack>
    </form>
  );
}
