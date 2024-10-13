const login = async (email: string, password: string) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/login?useCookies=true",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response.status == 200) {
      return { status: 200, detail: "Login success" };
    } else {
      const result = await response.json();

      // needs email confirmation
      if (result.detail === "NotAllowed") {
        await sendEmailConfirmation(email);

        return {
          status: 401,
          detail:
            "Please confirm your email. You have been sent a confirmation link.",
        };
      }

      return result;
    }
  } catch (error) {
    const message: string = (error as Error).message;

    console.error(message);

    return message;
  }
};

const register = async (email: string, password: string) => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/register",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );

    if (response.status == 200) {
      return { status: 200, message: "Registration success" };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    const message: string = (error as Error).message;

    console.error(message);

    return message;
  }
};

const isLoggedIn = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/User/me",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const sendEmailConfirmation = async (email: string) => {
  try {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/resendConfirmationEmail", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });
  } catch (error) {
    console.error((error as Error).message);
  }
};

export { login, register, isLoggedIn };
