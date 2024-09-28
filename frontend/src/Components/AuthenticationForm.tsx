import { useToggle, upperFirst } from "@mantine/hooks";
import { useState } from "react";
import { useForm } from "@mantine/form";
import { IconCheck, IconX } from "@tabler/icons-react";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Anchor,
  Container,
  Stack,
  List,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { login, register } from "../api/Authorization.tsx";

const processPassword = (password, confirmPassword) => {
  const empty = password === "";

  const statuses = [
    {
      message: "at least one digit",
      valid: /\d/.test(password) && !empty,
    },
    {
      message: "at least one lowercase letter",
      valid: /[a-z]/.test(password) && !empty,
    },
    {
      message: "at least one uppercase letter",
      valid: /[A-Z]/.test(password) && !empty,
    },
    {
      message: "at least one special character",
      valid: /[^a-zA-Z\d]/.test(password) && !empty,
    },
    {
      message: "14 characters long",
      valid: password.length > 14,
    },
    {
      message: "passwords match",
      valid: password === confirmPassword && !empty,
    },
  ];

  return statuses;
};

const AuthenticationForm = (props: PaperProps) => {
  const [type, toggle] = useToggle(["login", "register"]);
  const [passwordState, setPasswordState] = useState(processPassword(""));
  const [status, setStatus] = useState({ message: "", color: "green" });

  const onPassswordChange = (password, confirmPassword) => {
    setPasswordState(processPassword(password, confirmPassword));
  };

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });

  return (
    <MantineProvider>
      <Container fluid>
        <Paper radius="md" p="xl" withBorder {...props}>
          <Text size="lg" fw={500}>
            Welcome to Ithildin!
          </Text>

          <Divider label={type} labelPosition="center" my="lg" />

          <form
            onSubmit={form.onSubmit((values) => {
              if (type === "login") {
                login(values["email"], values["password"]).then((result) => {
                  if (result.status == 200) {
                    return;
                  } else {
                    setStatus({ color: "red", message: result.detail });
                  }
                });
              } else {
                for (const s of passwordState) {
                  if (!s["valid"]) {
                    return;
                  }
                }

                register(values["email"], values["password"]).then((result) => {
                  if (result.status == 200) {
                    toggle();
                  } else {
                    let message = "";

                    for (const e in result.errors)
                      message += result.errors[e][0] + "\n";

                    setStatus({ color: "red", message: message });
                  }
                });
              }
            })}
          >
            <Stack ta="left">
              <TextInput
                required
                label="Email"
                placeholder="hello@example.com"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
                radius="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) => {
                  form.setFieldValue("password", event.currentTarget.value);
                  onPassswordChange(
                    event.currentTarget.value,
                    form.values.confirmPassword
                  );
                }}
                radius="md"
              />

              {type === "register" && (
                <>
                  <PasswordInput
                    required
                    label="Repeat Password"
                    placeholder="Confirm your password"
                    value={form.values.confirmPassword}
                    onChange={(event) => {
                      form.setFieldValue(
                        "confirmPassword",
                        event.currentTarget.value
                      );
                      onPassswordChange(
                        form.values.password,
                        event.currentTarget.value
                      );
                    }}
                    radius="md"
                  />

                  <List
                    spacing="xs"
                    size="sm"
                    ta="left"
                    icon={
                      <ThemeIcon color="teal" size={20} radius="xl">
                        <IconCheck
                          style={{ width: rem(14), height: rem(14) }}
                        />
                      </ThemeIcon>
                    }
                  >
                    {passwordState.map((state, index) => {
                      return (
                        <List.Item
                          icon={
                            state.valid ? null : (
                              <ThemeIcon color="red" size={20} radius="xl">
                                <IconX
                                  style={{ width: rem(14), height: rem(14) }}
                                />
                              </ThemeIcon>
                            )
                          }
                          key={index}
                        >
                          <Text size="sm">{state.message}</Text>
                        </List.Item>
                      );
                    })}
                  </List>
                </>
              )}

              <p
                style={{
                  minWidth: "100%",
                  width: 0,
                  margin: 0,
                  color: status.color,
                }}
              >
                {status.message}
              </p>
            </Stack>

            <Group justify="space-between" mt="xl">
              <Anchor
                component="button"
                type="button"
                c="dimmed"
                onClick={() => toggle()}
                size="xs"
              >
                {type === "register"
                  ? "Already have an account? Login"
                  : "Don't have an account? Register"}
              </Anchor>
              <Button type="submit" radius="xl" error={status}>
                {upperFirst(type)}
              </Button>
            </Group>
          </form>
        </Paper>
      </Container>
    </MantineProvider>
  );
};

export default AuthenticationForm;
