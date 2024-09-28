const login = async (email, password) => {
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

    const result = await response.json();

    if (result.detail === "NotAllowed") {
      await sendEmailConfirmation(email);

      return {
        status: 401,
        detail:
          "Please confirm your email. You have been sent a confirmation link.",
      };
    }

    return result;
  } catch (error) {
    console.error(error.message);

    return error.message;
  }
};

const register = async (email, password) => {
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
    console.log(result);
    return result;
  } catch (error) {
    console.error(error.message);

    return error.message;
  }
};

const isLoggedIn = async () => {
  try {
    const response = await fetch(
      import.meta.env.VITE_BACKEND_URL + "/users/me",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    if (response.status == 200) return true;
    else return false;
  } catch (error) {
    return false;
  }
};

const sendEmailConfirmation = async (email) => {
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
    console.error(error.message);
  }
};

export { login, register, isLoggedIn };
